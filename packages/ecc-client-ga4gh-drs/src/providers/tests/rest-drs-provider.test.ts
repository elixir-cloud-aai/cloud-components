/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import { RestDrsProvider } from "../rest-drs-provider.js";

const BASE_URL = "https://drs.example.org/ga4gh/drs/v1";

/** Provider that adds a bearer token to every request, as in the docs. */
class TokenDrsProvider extends RestDrsProvider {
  protected fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Authorization", "Bearer test-token");
    return super.fetch(input, { ...init, headers });
  }
}

type Call = [string, (provider: RestDrsProvider) => Promise<unknown>, string];

/** Every provider method, with the URL it requests. */
const CALLS: Call[] = [
  ["getObjects", (p) => p.getObjects(), `${BASE_URL}/objects`],
  ["getObject", (p) => p.getObject("obj 1"), `${BASE_URL}/objects/obj%201`],
  [
    "getAccessURL",
    (p) => p.getAccessURL("obj 1", "s3/a"),
    `${BASE_URL}/objects/obj%201/access/s3%2Fa`,
  ],
  ["getServiceInfo", (p) => p.getServiceInfo(), `${BASE_URL}/service-info`],
];

const ok = (body: unknown = {}) =>
  new Response(JSON.stringify(body), { status: 200 });

describe("RestDrsProvider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(async () => ok());
  });

  afterEach(() => {
    sinon.restore();
  });

  CALLS.forEach(([name, call, url]) => {
    it(`${name} requests ${url.slice(BASE_URL.length)}`, async () => {
      await call(new RestDrsProvider(BASE_URL));

      expect(fetchStub.callCount).to.equal(1);
      expect(fetchStub.firstCall.args[0]).to.equal(url);
    });

    it(`${name} throws on an error response`, async () => {
      fetchStub.callsFake(
        async () => new Response("{}", { status: 500, statusText: "Oops" })
      );

      let error: Error | undefined;
      try {
        await call(new RestDrsProvider(BASE_URL));
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.match(/^Failed to fetch .*: Oops$/);
    });

    it(`${name} sends its request through an overridden fetch`, async () => {
      await call(new TokenDrsProvider(BASE_URL));

      const headers = new Headers(fetchStub.firstCall.args[1]?.headers);
      expect(headers.get("Authorization")).to.equal("Bearer test-token");
    });
  });

  it("getObjects adds paging and returns objects and pagination", async () => {
    const pagination = { offset: 20, limit: 10, total: 42 };
    fetchStub.callsFake(async () =>
      ok({ objects: [{ id: "obj-1" }], pagination })
    );

    const result = await new RestDrsProvider(BASE_URL).getObjects(10, 20);

    expect(fetchStub.firstCall.args[0]).to.equal(
      `${BASE_URL}/objects?offset=20&limit=10`
    );
    expect(result).to.deep.equal({ objects: [{ id: "obj-1" }], pagination });
  });

  it("getObjects returns no objects for a response without any", async () => {
    const result = await new RestDrsProvider(BASE_URL).getObjects();

    expect(result).to.deep.equal({ objects: [], pagination: undefined });
  });

  it("getObject asks for expanded bundles", async () => {
    await new RestDrsProvider(BASE_URL).getObject("obj-1", true);

    expect(fetchStub.firstCall.args[0]).to.equal(
      `${BASE_URL}/objects/obj-1?expand=true`
    );
  });
});
