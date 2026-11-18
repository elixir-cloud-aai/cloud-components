/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import {
  DEFAULT_REQUEST_TIMEOUT,
  MAX_REQUEST_TIMEOUT,
  RequestTimeoutError,
  fetchWithTimeout,
  resolveRequestTimeout,
} from "./index.js";

/** A `fetch` that settles only when its signal aborts, like a silent server. */
function neverAnswer(_input: RequestInfo | URL, init: RequestInit = {}) {
  return new Promise<Response>((_resolve, reject) => {
    init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });
}

/** Resolves with the rejection reason of a promise, fails if it fulfils. */
async function rejectionOf(promise: Promise<unknown>): Promise<unknown> {
  try {
    await promise;
  } catch (error) {
    return error;
  }
  throw new Error("Expected the promise to reject");
}

describe("resolveRequestTimeout()", () => {
  it("defaults to 30 s", () => {
    expect(DEFAULT_REQUEST_TIMEOUT).to.equal(30_000);
    expect(resolveRequestTimeout()).to.equal(DEFAULT_REQUEST_TIMEOUT);
    expect(resolveRequestTimeout({})).to.equal(DEFAULT_REQUEST_TIMEOUT);
  });

  it("returns a valid timeout as given", () => {
    expect(resolveRequestTimeout({ timeout: 0 })).to.equal(0);
    expect(resolveRequestTimeout({ timeout: 5000 })).to.equal(5000);
    expect(resolveRequestTimeout({ timeout: MAX_REQUEST_TIMEOUT })).to.equal(
      MAX_REQUEST_TIMEOUT
    );
  });

  [-1, 1.5, Number.NaN, Infinity, MAX_REQUEST_TIMEOUT + 1].forEach(
    (timeout) => {
      it(`rejects ${timeout}`, () => {
        expect(() => resolveRequestTimeout({ timeout })).to.throw(RangeError);
      });
    }
  );
});

describe("fetchWithTimeout()", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(neverAnswer);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("passes the request and its options on", async () => {
    fetchStub.callsFake(async () => new Response("ok"));

    const response = await fetchWithTimeout(
      "https://api.example.org/things",
      { method: "POST", headers: { "X-Test": "1" } },
      1000
    );

    expect(await response.text()).to.equal("ok");
    const [input, init] = fetchStub.firstCall.args;
    expect(input).to.equal("https://api.example.org/things");
    expect(init.method).to.equal("POST");
    expect(init.headers).to.deep.equal({ "X-Test": "1" });
    expect(init.signal).to.be.instanceOf(AbortSignal);
  });

  it("rejects with a RequestTimeoutError once the deadline expires", async () => {
    const error = await rejectionOf(
      fetchWithTimeout("https://api.example.org/things", {}, 20)
    );

    expect(error).to.be.instanceOf(RequestTimeoutError);
    expect((error as RequestTimeoutError).name).to.equal("RequestTimeoutError");
    expect((error as RequestTimeoutError).timeout).to.equal(20);
    expect((error as Error).message).to.equal("Request timed out after 20 ms");
  });

  it("keeps the deadline after the response arrived", async () => {
    // `fetch` aborts reading the body with the reason of its signal
    fetchStub.callsFake(async () => new Response("ok"));

    await fetchWithTimeout("https://api.example.org/things", {}, 20);
    const { signal } = fetchStub.firstCall.args[1] as RequestInit;
    expect(signal?.aborted).to.equal(false);
    await new Promise((resolve) => {
      signal?.addEventListener("abort", resolve);
    });

    expect(signal?.reason).to.be.instanceOf(RequestTimeoutError);
  });

  it("sets no deadline for a timeout of 0", async () => {
    fetchStub.callsFake(async () => new Response("ok"));

    await fetchWithTimeout("https://api.example.org/things", {}, 0);

    expect(fetchStub.firstCall.args[1].signal).to.equal(undefined);
  });

  it("defaults to 30 s", async () => {
    const clock = sinon.useFakeTimers({ toFake: ["setTimeout"] });
    const request = rejectionOf(
      fetchWithTimeout("https://api.example.org/things")
    );

    clock.tick(DEFAULT_REQUEST_TIMEOUT - 1);
    let settled = false;
    request.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).to.equal(false);

    clock.tick(1);
    expect(await request).to.be.instanceOf(RequestTimeoutError);
  });

  it("aborts with the reason of the caller's signal", async () => {
    const caller = new AbortController();
    const request = rejectionOf(
      fetchWithTimeout(
        "https://api.example.org/things",
        { signal: caller.signal },
        1000
      )
    );

    caller.abort(new Error("cancelled"));

    expect(((await request) as Error).message).to.equal("cancelled");
  });

  it("aborts at once with a signal that is already aborted", async () => {
    const caller = new AbortController();
    caller.abort(new Error("cancelled"));
    fetchStub.callsFake(async (_input, init: RequestInit) => {
      if (init.signal?.aborted) {
        throw init.signal.reason;
      }
      return new Response("ok");
    });

    const error = await rejectionOf(
      fetchWithTimeout(
        "https://api.example.org/things",
        { signal: caller.signal },
        1000
      )
    );

    expect((error as Error).message).to.equal("cancelled");
  });

  it("follows the signal of a Request", async () => {
    const caller = new AbortController();
    const request = rejectionOf(
      fetchWithTimeout(
        new Request("https://api.example.org/things", {
          signal: caller.signal,
        }),
        {},
        1000
      )
    );

    caller.abort(new Error("cancelled"));

    expect(((await request) as Error).message).to.equal("cancelled");
  });

  it("rejects with the timeout error for a plain AbortError", async () => {
    // Like fetch implementations that ignore the abort reason
    fetchStub.callsFake(
      (_input, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError"))
          );
        })
    );

    const error = await rejectionOf(
      fetchWithTimeout("https://api.example.org/things", {}, 20)
    );

    expect(error).to.be.instanceOf(RequestTimeoutError);
  });

  it("rejects with the timeout error where signals drop the abort reason", async () => {
    // Like browsers without abort reasons: `abort()` ignores its argument
    const { abort } = AbortController.prototype;
    sinon
      .stub(AbortController.prototype, "abort")
      .callsFake(function abortWithoutReason(this: AbortController) {
        abort.call(this);
      });
    fetchStub.callsFake(
      (_input, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError"))
          );
        })
    );

    const error = await rejectionOf(
      fetchWithTimeout("https://api.example.org/things", {}, 20)
    );

    expect(error).to.be.instanceOf(RequestTimeoutError);
  });

  it("passes other errors on", async () => {
    fetchStub.rejects(new TypeError("Failed to fetch"));

    const error = await rejectionOf(
      fetchWithTimeout("https://api.example.org/things", {}, 1000)
    );

    expect(error).to.be.instanceOf(TypeError);
  });

  it("stops following the caller's signal once the deadline expires", async () => {
    const caller = new AbortController();
    const removed = sinon.spy(caller.signal, "removeEventListener");

    await rejectionOf(
      fetchWithTimeout(
        "https://api.example.org/things",
        { signal: caller.signal },
        20
      )
    );

    expect(removed.calledWith("abort")).to.equal(true);
  });
});
