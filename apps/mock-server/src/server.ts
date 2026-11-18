// HTTP server: CORS for any origin, a body limit, one log line per request,
// JSON replies and errors, and the routes registered on its router

import {
  createServer as createHttpServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";

import { HttpError, type Reply } from "./http.ts";
import { Router } from "./router.ts";
import { routes as defaultRoutes } from "./routes/index.ts";
import type { Store } from "./store.ts";

export type RegisterRoutes = (router: Router) => void;

export interface ServerOptions {
  store: Store;
  // Functions that add the API stubs to the router (default: all of them,
  // see `routes/index.ts`). `GET /healthz` is always there
  routes?: RegisterRoutes[];
  // Largest accepted request body (default 1 MiB); larger ones get 413
  maxBodyBytes?: number;
  // Receives one line per request (default: `console.log`)
  log?: (line: string) => void;
}

export const DEFAULT_MAX_BODY_BYTES = 1024 * 1024;

// The methods of the `Router` helpers; add any other method that a stub
// uses here, too
const ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS";

// Reads the body up to `limit` bytes. Above it, the rest is read and
// dropped (so that the client gets the 413 instead of a reset connection)
// and the promise is rejected
const readBody = (req: IncomingMessage, limit: number): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const tooLarge = () =>
      new HttpError(413, `The request body exceeds ${limit} bytes`);
    if (Number(req.headers["content-length"]) > limit) {
      req.resume();
      reject(tooLarge());
      return;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    let failed = false;
    req.on("data", (chunk: Buffer) => {
      if (failed) {
        return;
      }
      size += chunk.length;
      if (size > limit) {
        failed = true;
        chunks.length = 0;
        reject(tooLarge());
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

const errorReply = (status: number, msg: string): Reply => ({
  status,
  body: { msg, status_code: status },
});

const send = (res: ServerResponse, reply: Reply): void => {
  if (res.headersSent || res.destroyed) {
    return;
  }
  for (const [name, value] of Object.entries(reply.headers ?? {})) {
    res.setHeader(name, value);
  }
  if (reply.body === undefined || reply.status === 204) {
    res.writeHead(reply.status).end();
    return;
  }
  res
    .writeHead(reply.status, {
      "Content-Type": "application/json; charset=utf-8",
    })
    .end(JSON.stringify(reply.body));
};

export const createServer = ({
  store,
  routes = defaultRoutes,
  maxBodyBytes = DEFAULT_MAX_BODY_BYTES,
  log = console.log,
}: ServerOptions): Server => {
  const router = new Router();
  router.get("/healthz", () => ({ status: 200, body: { status: "ok" } }));
  for (const register of routes) {
    register(router);
  }

  const handle = async (
    req: IncomingMessage,
    res: ServerResponse,
    path: string,
    queryString: string
  ): Promise<Reply> => {
    const method = req.method ?? "GET";
    if (method === "OPTIONS") {
      // Preflight: allow whatever headers the client asks for, for a day
      const requested = req.headers["access-control-request-headers"];
      res.setHeader("Vary", "Access-Control-Request-Headers");
      return {
        status: 204,
        headers: {
          "Access-Control-Allow-Methods": ALLOWED_METHODS,
          "Access-Control-Max-Age": "86400",
          ...(requested ? { "Access-Control-Allow-Headers": requested } : {}),
        },
      };
    }
    let body: Buffer;
    try {
      body = await readBody(req, maxBodyBytes);
    } catch (error) {
      // The client may still be sending: close the connection afterwards
      res.setHeader("Connection", "close");
      throw error;
    }
    const match = router.match(method, path);
    if (!match) {
      return errorReply(404, `Not found: ${method} ${path}`);
    }
    return match.handler({
      method,
      path,
      params: match.params,
      query: new URLSearchParams(queryString),
      headers: req.headers,
      body,
      store,
    });
  };

  const server = createHttpServer((req, res) => {
    const start = Date.now();
    // Split by hand: `new URL()` would read a path starting with `//` as a
    // host
    const url = req.url ?? "/";
    const queryStart = url.indexOf("?");
    const path = queryStart === -1 ? url : url.slice(0, queryStart);
    const queryString = queryStart === -1 ? "" : url.slice(queryStart + 1);

    // Without the query string, which may hold anything; "aborted" if the
    // client closed the connection before the response was sent
    res.on("close", () => {
      const status = res.writableFinished ? res.statusCode : "aborted";
      log(
        `${new Date().toISOString()} ${req.method} ${path} ${status} ${
          Date.now() - start
        }ms`
      );
    });
    res.setHeader("Access-Control-Allow-Origin", "*");

    handle(req, res, path, queryString)
      .then((reply) => send(res, reply))
      .catch((error: unknown) => {
        // The client is gone (e.g. closed the connection while sending the
        // body): nothing to answer, and not an error of the server
        if (res.destroyed || req.socket.destroyed) {
          return;
        }
        if (error instanceof HttpError) {
          send(res, errorReply(error.status, error.message));
          return;
        }
        log(`Unexpected error: ${error}`);
        send(res, errorReply(500, "Internal server error"));
      });
  });
  // A slow client can't hold a connection for long
  server.requestTimeout = 30_000;
  return server;
};
