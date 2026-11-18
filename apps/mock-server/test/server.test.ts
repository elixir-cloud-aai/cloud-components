import assert from "node:assert/strict";
import { request } from "node:http";
import { connect } from "node:net";
import { after, before, describe, it } from "node:test";

import { HttpError, parseJson } from "../src/http.ts";
import { createServer } from "../src/server.ts";
import type { Router } from "../src/router.ts";
import { Store } from "../src/store.ts";
import {
  fixturesDir,
  startServer,
  waitForLogs,
  type RunningServer,
} from "./helpers.ts";

// Routes that only the tests register: they expose the store the way the
// API stubs do
const testRoutes = (router: Router): void => {
  router.get("/things", ({ store }) => ({
    status: 200,
    body: store.list("things"),
  }));
  router.get("/things/:id", ({ store, params }) => {
    const thing = store.find("things", (item) => item.id === params.id);
    if (!thing) {
      throw new HttpError(404, `No thing '${params.id}'`);
    }
    return { status: 200, body: thing };
  });
  router.post("/things", (ctx) => {
    const thing = parseJson(ctx) as Record<string, unknown>;
    return { status: 201, body: ctx.store.create("things", thing) };
  });
  router.get("/fail", () => {
    throw new Error("boom");
  });
  router.delete("/things/:id", () => ({ status: 204 }));
  router.get("/throw-symbol", () => {
    throw Symbol("odd");
  });
  router.get("/unserializable", () => ({ status: 200, body: { n: 1n } }));
};

// Sends a body in chunks without `Content-Length` (chunked transfer
// encoding), so that the server can only tell its size while reading it
const postChunked = (
  url: string,
  chunk: Buffer,
  count: number
): Promise<{ status: number; body: string }> =>
  new Promise((resolve, reject) => {
    const req = request(
      url,
      { method: "POST", headers: { "Content-Type": "application/json" } },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (data: Buffer) => chunks.push(data));
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 0,
            body: Buffer.concat(chunks).toString(),
          })
        );
      }
    );
    req.on("error", reject);
    for (let i = 0; i < count; i += 1) {
      req.write(chunk);
    }
    req.end();
  });

interface ErrorBody {
  msg: string;
  status_code: number;
}

const errorOf = async (res: Response): Promise<ErrorBody> =>
  (await res.json()) as ErrorBody;

const idsOf = async (res: Response): Promise<string[]> =>
  ((await res.json()) as { id: string }[]).map((thing) => thing.id);

describe("mock server", () => {
  let server: RunningServer;

  before(async () => {
    server = await startServer({ routes: [testRoutes], maxCreated: 3 });
  });

  after(async () => {
    await server.close();
  });

  describe("health", () => {
    it("answers GET /healthz", async () => {
      const res = await fetch(`${server.url}/healthz`);
      assert.equal(res.status, 200);
      assert.match(res.headers.get("content-type") ?? "", /application\/json/);
      assert.deepEqual(await res.json(), { status: "ok" });
    });
  });

  describe("CORS", () => {
    it("answers preflight requests for any path", async () => {
      const res = await fetch(`${server.url}/any/path`, {
        method: "OPTIONS",
        headers: {
          Origin: "https://docs.example.org",
          "Access-Control-Request-Method": "PUT",
          "Access-Control-Request-Headers": "content-type, authorization",
        },
      });
      assert.equal(res.status, 204);
      assert.equal(res.headers.get("access-control-allow-origin"), "*");
      assert.equal(
        res.headers.get("access-control-allow-methods"),
        "GET, HEAD, POST, PUT, DELETE, OPTIONS"
      );
      assert.equal(
        res.headers.get("access-control-allow-headers"),
        "content-type, authorization"
      );
      assert.ok(Number(res.headers.get("access-control-max-age")) > 0);
      assert.equal(await res.text(), "");
    });

    it("allows any origin on other responses, errors included", async () => {
      const ok = await fetch(`${server.url}/healthz`, {
        headers: { Origin: "https://docs.example.org" },
      });
      assert.equal(ok.headers.get("access-control-allow-origin"), "*");
      const missing = await fetch(`${server.url}/missing`);
      assert.equal(missing.headers.get("access-control-allow-origin"), "*");
    });
  });

  describe("routing", () => {
    it("answers unknown paths with a JSON 404", async () => {
      const res = await fetch(`${server.url}/no/such/path`);
      assert.equal(res.status, 404);
      assert.match(res.headers.get("content-type") ?? "", /application\/json/);
      const body = await errorOf(res);
      assert.equal(body.status_code, 404);
      assert.equal(typeof body.msg, "string");
    });

    it("answers unknown methods of known paths with a JSON 404", async () => {
      const res = await fetch(`${server.url}/healthz`, { method: "PUT" });
      assert.equal(res.status, 404);
      assert.equal((await errorOf(res)).status_code, 404);
    });

    it("answers HEAD like GET, without a body", async () => {
      const res = await fetch(`${server.url}/healthz`, { method: "HEAD" });
      assert.equal(res.status, 200);
      assert.equal(await res.text(), "");
    });

    it("passes decoded path parameters and ignores the query", async () => {
      const res = await fetch(`${server.url}/things/fixture-1?x=%2F`);
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), {
        id: "fixture-1",
        name: "First fixture",
      });
    });

    it("answers malformed path encodings with 400", async () => {
      const res = await fetch(`${server.url}/things/%E0%A4%A`);
      assert.equal(res.status, 400);
      assert.equal((await errorOf(res)).status_code, 400);
    });

    it("turns HTTP errors of handlers into JSON errors", async () => {
      const res = await fetch(`${server.url}/things/nope`);
      assert.equal(res.status, 404);
      assert.deepEqual(await res.json(), {
        msg: "No thing 'nope'",
        status_code: 404,
      });
    });

    it("answers unexpected errors with 500, without details", async () => {
      const before = server.logs.length;
      const res = await fetch(`${server.url}/fail`);
      assert.equal(res.status, 500);
      const body = await errorOf(res);
      assert.equal(body.status_code, 500);
      assert.doesNotMatch(body.msg, /boom/);
      // One line, with the error
      await waitForLogs(server, before + 1);
      const lines = server.logs.slice(before);
      assert.equal(lines.length, 1, lines.join("\n"));
      assert.match(lines[0], /GET \/fail 500 \d+ms error: boom$/);
    });

    it("answers 500 for any thrown value", async () => {
      const res = await fetch(`${server.url}/throw-symbol`);
      assert.equal(res.status, 500);
      assert.equal((await errorOf(res)).status_code, 500);
    });

    it("answers 500 for a reply body that isn't serializable", async () => {
      const res = await fetch(`${server.url}/unserializable`);
      assert.equal(res.status, 500);
      assert.equal((await errorOf(res)).status_code, 500);
    });

    it("sends no body for 204", async () => {
      const res = await fetch(`${server.url}/things/fixture-1`, {
        method: "DELETE",
      });
      assert.equal(res.status, 204);
      assert.equal(await res.text(), "");
    });

    it("answers invalid JSON with 400", async () => {
      const res = await fetch(`${server.url}/things`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{not json",
      });
      assert.equal(res.status, 400);
      assert.equal((await errorOf(res)).status_code, 400);
    });
  });

  describe("logging", () => {
    it("writes one line per request", async () => {
      const before = server.logs.length;
      await fetch(`${server.url}/healthz?token=secret`);
      // The line is written when the response is finished
      await new Promise((resolve) => setImmediate(resolve));
      const lines = server.logs.slice(before);
      assert.equal(lines.length, 1);
      assert.match(lines[0], /GET \/healthz 200 \d+ms$/);
      assert.doesNotMatch(lines[0], /secret/);
    });
  });

  describe("aborted requests", () => {
    it("logs them as aborted, not as server errors", async () => {
      const before = server.logs.length;
      const { port } = new URL(server.url);
      await new Promise<void>((resolve) => {
        const socket = connect(Number(port), "127.0.0.1", () => {
          socket.write(
            "POST /things HTTP/1.1\r\nHost: x\r\nContent-Length: 500\r\n\r\nabc"
          );
          setTimeout(() => socket.destroy(), 50);
        });
        socket.on("close", () => resolve());
      });
      // The line is written when the server has seen the connection close
      await waitForLogs(server, before + 1);
      const lines = server.logs.slice(before);
      assert.equal(lines.length, 1, lines.join("\n"));
      assert.match(lines[0], /POST \/things aborted \d+ms$/);
    });
  });

  describe("body limit", () => {
    it("survives a client that leaves while an oversized body is drained", async () => {
      const limited = await startServer({ maxBodyBytes: 1024 });
      try {
        const { port } = new URL(limited.url);
        await new Promise<void>((resolve) => {
          const socket = connect(Number(port), "127.0.0.1", () => {
            socket.write(
              "POST /healthz HTTP/1.1\r\nHost: x\r\nContent-Length: 4096\r\n\r\nabc"
            );
            setTimeout(() => socket.destroy(), 50);
          });
          socket.on("error", () => undefined);
          socket.on("close", () => resolve());
        });
        await waitForLogs(limited, 1);
        const res = await fetch(`${limited.url}/healthz`);
        assert.equal(res.status, 200);
      } finally {
        await limited.close();
      }
    });

    it("applies to preflight requests, too", async () => {
      const limited = await startServer({ maxBodyBytes: 1024 });
      try {
        const res = await fetch(`${limited.url}/any`, {
          method: "OPTIONS",
          body: Buffer.alloc(2048, "a"),
        });
        assert.equal(res.status, 413);
      } finally {
        await limited.close();
      }
    });

    it("rejects a body above the limit by its Content-Length", async () => {
      const limited = await startServer({ maxBodyBytes: 1024 });
      try {
        const res = await fetch(`${limited.url}/healthz`, {
          method: "POST",
          body: Buffer.alloc(2048, "a"),
        });
        assert.equal(res.status, 413);
        assert.equal((await errorOf(res)).status_code, 413);
      } finally {
        await limited.close();
      }
    });

    it("rejects a chunked body once it exceeds the limit", async () => {
      const limited = await startServer({ maxBodyBytes: 1024 });
      try {
        const res = await postChunked(
          `${limited.url}/things`,
          Buffer.alloc(512, "a"),
          8
        );
        assert.equal(res.status, 413);
        assert.equal(JSON.parse(res.body).status_code, 413);
      } finally {
        await limited.close();
      }
    });

    it("accepts a body at the limit", async () => {
      const limited = await startServer({
        routes: [testRoutes],
        maxBodyBytes: 1024,
      });
      try {
        const name = "a".repeat(1024 - '{"name":""}'.length);
        const res = await fetch(`${limited.url}/things`, {
          method: "POST",
          body: JSON.stringify({ name }),
        });
        assert.equal(res.status, 201);
      } finally {
        await limited.close();
      }
    });

    it("defaults to 1 MiB", async () => {
      const res = await fetch(`${server.url}/healthz`, {
        method: "POST",
        body: Buffer.alloc(1024 * 1024 + 1, "a"),
      });
      assert.equal(res.status, 413);
    });
  });

  describe("connections", () => {
    it("defaults to at most 100 at a time", async () => {
      const server = createServer({ store: Store.load(fixturesDir) });
      assert.equal(server.maxConnections, 100);
    });
  });

  describe("store", () => {
    it("serves the fixtures", async () => {
      const res = await fetch(`${server.url}/things`);
      assert.deepEqual(await idsOf(res), ["fixture-1", "fixture-2"]);
    });

    it("drops the oldest created item above the cap, never fixtures", async () => {
      for (const id of ["new-1", "new-2", "new-3", "new-4"]) {
        const res = await fetch(`${server.url}/things`, {
          method: "POST",
          body: JSON.stringify({ id }),
        });
        assert.equal(res.status, 201);
      }
      const res = await fetch(`${server.url}/things`);
      assert.deepEqual(await idsOf(res), [
        "fixture-1",
        "fixture-2",
        "new-2",
        "new-3",
        "new-4",
      ]);
    });

    it("resets on restart", async () => {
      const first = await startServer({ routes: [testRoutes] });
      await fetch(`${first.url}/things`, {
        method: "POST",
        body: JSON.stringify({ id: "created" }),
      });
      await first.close();

      const second = await startServer({
        routes: [testRoutes],
        store: Store.load(fixturesDir),
      });
      try {
        const res = await fetch(`${second.url}/things`);
        assert.deepEqual(await idsOf(res), ["fixture-1", "fixture-2"]);
      } finally {
        await second.close();
      }
    });
  });
});
