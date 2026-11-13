/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghTrsTools } from "../tools.js";
import type { ToolClass, TrsProvider } from "../../../providers/index.js";

const BASE_URL = "https://trs.example.org/ga4gh/trs/v2";

const TOOL_CLASS: ToolClass = { id: "workflow", name: "Workflow" };

/**
 * A provider whose list methods are stubs; the tools list uses no other
 * methods.
 */
const stubProvider = () => {
  const stubs = {
    getToolClasses: sinon.stub().resolves([TOOL_CLASS]),
    getToolsList: sinon.stub().resolves([]),
  };
  return { stubs, provider: stubs as unknown as TrsProvider };
};

describe("ecc-client-ga4gh-trs-tools provider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify([]), {
          headers: { "Content-Type": "application/json" },
        })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("loads from a provider set after the first update", async () => {
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools></ecc-client-ga4gh-trs-tools>`
    );
    const { stubs, provider } = stubProvider();

    el.provider = provider;
    await waitUntil(() => stubs.getToolClasses.callCount === 1);

    expect(stubs.getToolsList.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider();
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => first.stubs.getToolClasses.callCount === 1);

    el.provider = second.provider;
    await waitUntil(() => second.stubs.getToolClasses.callCount === 1);

    expect(second.stubs.getToolsList.callCount).to.equal(1);
    expect(first.stubs.getToolClasses.callCount).to.equal(1);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const { stubs, provider } = stubProvider();
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => stubs.getToolClasses.callCount === 1);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(stubs.getToolClasses.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });
});
