/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import { RestWesProvider } from "../rest-wes-provider.js";

const BASE_URL = "https://wes.example.org/ga4gh/wes/v1";

/** Provider that adds a bearer token to every request, as in the docs. */
class TokenWesProvider extends RestWesProvider {
  protected fetch(input: RequestInfo | URL, init: RequestInit = {}) {
    const headers = new Headers(init.headers);
    headers.set("Authorization", "Bearer test-token");
    return super.fetch(input, { ...init, headers });
  }
}

const requestWorkflow = (provider: RestWesProvider) =>
  provider.runWorkflow({
    workflow_params: {},
    workflow_type: "CWL",
    workflow_type_version: "v1.0",
    workflow_url: "workflow.cwl",
  });

/** Every provider method, so a new method can't bypass `fetch`. */
const callAllMethods = async (provider: RestWesProvider) => {
  await provider.getServiceInfo();
  await provider.listRuns(10, "next");
  await requestWorkflow(provider);
  await provider.getRunLog("run-1");
  await provider.getRunStatus("run-1");
  await provider.cancelRun("run-1");
};

describe("RestWesProvider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon
      .stub(window, "fetch")
      .callsFake(async () => new Response("{}", { status: 200 }));
  });

  afterEach(() => {
    sinon.restore();
  });

  it("sends requests without headers by default", async () => {
    await callAllMethods(new RestWesProvider(BASE_URL));

    expect(fetchStub.callCount).to.equal(6);
    fetchStub.getCalls().forEach((call) => {
      expect(call.args[1]?.headers).to.equal(undefined);
    });
  });

  it("sends every request through an overridden fetch", async () => {
    await callAllMethods(new TokenWesProvider(BASE_URL));

    expect(fetchStub.callCount).to.equal(6);
    fetchStub.getCalls().forEach((call) => {
      const headers = new Headers(call.args[1]?.headers);
      expect(headers.get("Authorization")).to.equal("Bearer test-token");
    });
  });

  it("keeps the workflow upload multipart when adding headers", async () => {
    await requestWorkflow(new TokenWesProvider(BASE_URL));

    const [url, init] = fetchStub.firstCall.args;
    expect(url).to.equal(`${BASE_URL}/runs`);
    expect(init.body).to.be.instanceOf(FormData);
    // The browser sets the multipart boundary only if Content-Type is unset
    expect(new Headers(init.headers).has("Content-Type")).to.equal(false);
  });
});
