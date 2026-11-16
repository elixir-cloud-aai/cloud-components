/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import { RestTrsProvider } from "../rest-trs-provider.js";

const BASE_URL = "https://trs.example.org/ga4gh/trs/v2";
const TOOL = `${BASE_URL}/tools/tool%201`;

/** Provider that adds a bearer token to every request, as in the docs. */
class TokenTrsProvider extends RestTrsProvider {
  protected fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Authorization", "Bearer test-token");
    return super.fetch(input, { ...init, headers });
  }
}

type Call = [string, (provider: RestTrsProvider) => Promise<unknown>, string];

/** Every provider method, with the URL it requests and its error message. */
const CALLS: Call[] = [
  ["getToolClasses", (p) => p.getToolClasses(), `${BASE_URL}/toolClasses`],
  ["getTool", (p) => p.getTool(BASE_URL, "tool 1"), TOOL],
  [
    "getToolVersions",
    (p) => p.getToolVersions(BASE_URL, "tool 1"),
    `${TOOL}/versions`,
  ],
  [
    "getToolVersion",
    (p) => p.getToolVersion(BASE_URL, "tool 1", "tool 1:v1"),
    `${TOOL}/versions/v1`,
  ],
  [
    "getToolFiles",
    (p) => p.getToolFiles(BASE_URL, "tool 1", "v1", "CWL"),
    `${TOOL}/versions/v1/CWL/files`,
  ],
  [
    "getToolDescriptor",
    (p) => p.getToolDescriptor(BASE_URL, "tool 1", "tool 1:v1", "WDL"),
    `${TOOL}/versions/v1/WDL/descriptor`,
  ],
  [
    "getContainerfile",
    (p) => p.getContainerfile(BASE_URL, "tool 1", "v1"),
    `${TOOL}/versions/v1/containerfile`,
  ],
  [
    "getToolTests",
    (p) => p.getToolTests(BASE_URL, "tool 1", "tool 1:v1", "NFL"),
    `${TOOL}/versions/v1/NFL/tests`,
  ],
];

const ok = (body: unknown = {}) =>
  new Response(JSON.stringify(body), { status: 200 });
const failed = () =>
  new Response("{}", { status: 404, statusText: "Not Found" });

describe("RestTrsProvider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(async () => ok());
  });

  afterEach(() => {
    sinon.restore();
  });

  CALLS.forEach(([name, call, url]) => {
    it(`${name} requests ${url.slice(BASE_URL.length)}`, async () => {
      fetchStub.callsFake(async () => ok({ name }));

      const result = await call(new RestTrsProvider(BASE_URL));

      expect(fetchStub.callCount).to.equal(1);
      expect(fetchStub.firstCall.args[0]).to.equal(url);
      expect(result).to.deep.equal({ name });
    });

    it(`${name} throws on an error response`, async () => {
      fetchStub.callsFake(async () => failed());

      let error: Error | undefined;
      try {
        await call(new RestTrsProvider(BASE_URL));
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.match(/^Failed to fetch .*: Not Found$/);
    });

    it(`${name} sends its request through an overridden fetch`, async () => {
      await call(new TokenTrsProvider(BASE_URL));

      const headers = new Headers(fetchStub.firstCall.args[1]?.headers);
      expect(headers.get("Authorization")).to.equal("Bearer test-token");
    });
  });

  it("getToolFiles asks for a ZIP archive", async () => {
    await new RestTrsProvider(BASE_URL).getToolFiles(
      BASE_URL,
      "tool 1",
      "v1",
      "CWL",
      "zip"
    );

    expect(fetchStub.firstCall.args[0]).to.equal(
      `${TOOL}/versions/v1/CWL/files?format=zip`
    );
  });

  describe("getToolsList", () => {
    it("requests the first page without parameters", async () => {
      await new RestTrsProvider(BASE_URL).getToolsList(0, 0, {}, "");

      expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/tools?`);
    });

    it("adds paging, the query and set filters", async () => {
      await new RestTrsProvider(BASE_URL).getToolsList(
        10,
        20,
        {
          offset: "5",
          toolClass: "Workflow",
          checker: false,
          author: "",
          organization: undefined,
        },
        "my tool"
      );

      expect(fetchStub.firstCall.args[0]).to.equal(
        `${BASE_URL}/tools?limit=10&offset=20&` +
          "&name=my%20tool&toolClass=Workflow&checker=false"
      );
    });

    it("throws on an error response", async () => {
      fetchStub.callsFake(async () => failed());

      let error: Error | undefined;
      try {
        await new RestTrsProvider(BASE_URL).getToolsList(10, 0, {}, "");
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.equal("Failed to fetch tools: Not Found");
    });
  });

  describe("getToolDescriptorByPath", () => {
    const DESCRIPTOR = `${TOOL}/versions/v1/CWL/descriptor`;
    const byPath = (provider: RestTrsProvider) =>
      provider.getToolDescriptorByPath(
        BASE_URL,
        "tool 1",
        "tool 1:v1",
        "CWL",
        "dir/main.cwl"
      );

    it("requests the unencoded path first", async () => {
      fetchStub.callsFake(async () => ok({ content: "plain" }));

      const result = await byPath(new RestTrsProvider(BASE_URL));

      expect(fetchStub.callCount).to.equal(1);
      expect(fetchStub.firstCall.args[0]).to.equal(
        `${DESCRIPTOR}/dir/main.cwl`
      );
      expect(result).to.deep.equal({ content: "plain" });
    });

    it("falls back to the encoded path after an error response", async () => {
      fetchStub.onFirstCall().callsFake(async () => failed());
      fetchStub.onSecondCall().callsFake(async () => ok({ content: "enc" }));

      const result = await byPath(new RestTrsProvider(BASE_URL));

      expect(fetchStub.callCount).to.equal(2);
      expect(fetchStub.secondCall.args[0]).to.equal(
        `${DESCRIPTOR}/dir%2Fmain.cwl`
      );
      expect(result).to.deep.equal({ content: "enc" });
    });

    it("falls back to the encoded path after a network error", async () => {
      fetchStub.onFirstCall().rejects(new TypeError("Network down"));
      fetchStub.onSecondCall().callsFake(async () => ok({ content: "enc" }));

      const result = await byPath(new RestTrsProvider(BASE_URL));

      expect(fetchStub.secondCall.args[0]).to.equal(
        `${DESCRIPTOR}/dir%2Fmain.cwl`
      );
      expect(result).to.deep.equal({ content: "enc" });
    });

    it("throws the first error if both paths fail", async () => {
      fetchStub.callsFake(async () => failed());

      let error: Error | undefined;
      try {
        await byPath(new RestTrsProvider(BASE_URL));
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.equal(
        "Failed to fetch tool descriptor by path: Not Found"
      );
    });

    it("throws the network error if the encoded path fails too", async () => {
      fetchStub.onFirstCall().rejects(new TypeError("Network down"));
      fetchStub.onSecondCall().callsFake(async () => failed());

      let error: Error | undefined;
      try {
        await byPath(new RestTrsProvider(BASE_URL));
      } catch (e) {
        error = e as Error;
      }

      expect(error?.message).to.equal("Network down");
    });
  });
});
