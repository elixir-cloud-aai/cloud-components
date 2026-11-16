/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import { RestServiceRegistryProvider } from "../rest-sr-provider.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

/** Provider that adds a bearer token to every request, as in the docs. */
class TokenServiceRegistryProvider extends RestServiceRegistryProvider {
  protected fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Authorization", "Bearer test-token");
    return super.fetch(input, { ...init, headers });
  }
}

type Call = [
  string,
  (provider: RestServiceRegistryProvider) => Promise<unknown>,
  string
];

/** Every provider method, with the URL it requests. */
const CALLS: Call[] = [
  ["getServices", (p) => p.getServices(), `${BASE_URL}/services`],
  [
    "getServiceById",
    (p) => p.getServiceById("org/service 1"),
    `${BASE_URL}/services/org%2Fservice%201`,
  ],
  ["getServiceTypes", (p) => p.getServiceTypes(), `${BASE_URL}/services/types`],
  ["getServiceInfo", (p) => p.getServiceInfo(), `${BASE_URL}/service-info`],
];

describe("RestServiceRegistryProvider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon
      .stub(window, "fetch")
      .callsFake(async () => new Response("{}", { status: 200 }));
  });

  afterEach(() => {
    sinon.restore();
  });

  CALLS.forEach(([name, call, url]) => {
    it(`${name} requests ${url.slice(BASE_URL.length)}`, async () => {
      fetchStub.callsFake(
        async () => new Response(JSON.stringify({ name }), { status: 200 })
      );

      const result = await call(new RestServiceRegistryProvider(BASE_URL));

      expect(fetchStub.callCount).to.equal(1);
      expect(fetchStub.firstCall.args[0]).to.equal(url);
      expect(result).to.deep.equal({ name });
    });

    it(`${name} throws on an error response`, async () => {
      fetchStub.callsFake(
        async () => new Response("{}", { status: 500, statusText: "Oops" })
      );

      let error: Error | undefined;
      try {
        await call(new RestServiceRegistryProvider(BASE_URL));
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.match(/^Failed to fetch .*: Oops$/);
    });

    it(`${name} sends its request through an overridden fetch`, async () => {
      await call(new TokenServiceRegistryProvider(BASE_URL));

      const headers = new Headers(fetchStub.firstCall.args[1]?.headers);
      expect(headers.get("Authorization")).to.equal("Bearer test-token");
    });
  });
});
