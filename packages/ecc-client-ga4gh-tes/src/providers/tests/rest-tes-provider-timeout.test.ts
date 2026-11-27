/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import {
  DEFAULT_REQUEST_TIMEOUT,
  RequestTimeoutError,
} from "@elixir-cloud/design/utils";
import { RestTesProvider } from "../rest-tes-provider.js";

const BASE_URL = "https://tes.example.org/ga4gh/tes/v1";

/** Provider that adds a bearer token to every request, as in the docs. */
class TokenProvider extends RestTesProvider {
  protected fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Authorization", "Bearer test-token");
    return super.fetch(input, { ...init, headers });
  }
}

/** Provider methods, one of each kind of request. */
const CALLS: [string, (p: RestTesProvider) => Promise<unknown>][] = [
  ["listTasks", (p) => p.listTasks()],
  ["cancelTask", (p) => p.cancelTask("task-1")],
];

/** A `fetch` that settles only when its signal aborts, like a silent server. */
const neverAnswer = (_input: RequestInfo | URL, init: RequestInit = {}) =>
  new Promise<Response>((_resolve, reject) => {
    init.signal?.addEventListener("abort", () => reject(init.signal?.reason));
  });

/** The error that a call rejects with. */
const rejection = async (call: () => Promise<unknown>): Promise<unknown> => {
  try {
    await call();
  } catch (err) {
    return err;
  }
  throw new Error("Expected the call to reject");
};

describe("RestTesProvider request timeout", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(neverAnswer);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("defaults to 30 s", () => {
    expect(new RestTesProvider(BASE_URL).timeout).to.equal(
      DEFAULT_REQUEST_TIMEOUT
    );
  });

  it("rejects an invalid timeout", () => {
    expect(() => new RestTesProvider(BASE_URL, { timeout: -1 })).to.throw(
      RangeError
    );
  });

  CALLS.forEach(([name, call]) => {
    it(`${name} rejects when the server doesn't answer in time`, async () => {
      const provider = new RestTesProvider(BASE_URL, { timeout: 20 });

      const error = await rejection(() => call(provider));

      expect(error).to.be.instanceOf(RequestTimeoutError);
      expect((error as Error).message).to.equal(
        "Request timed out after 20 ms"
      );
    });
  });

  it("keeps the timeout with an overridden fetch", async () => {
    const provider = new TokenProvider(BASE_URL, { timeout: 20 });

    const error = await rejection(() => CALLS[0][1](provider));

    expect(error).to.be.instanceOf(RequestTimeoutError);
    const headers = new Headers(fetchStub.firstCall.args[1]?.headers);
    expect(headers.get("Authorization")).to.equal("Bearer test-token");
  });

  it("sends requests without a deadline with a timeout of 0", async () => {
    fetchStub.callsFake(async () => new Response("{}", { status: 200 }));

    await CALLS[0][1](new RestTesProvider(BASE_URL, { timeout: 0 }));

    expect(fetchStub.firstCall.args[1]?.signal).to.equal(undefined);
  });
});
