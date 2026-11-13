/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghTrsTools } from "../tools.js";
import type { Tool, ToolClass, TrsProvider } from "../../../providers/index.js";

const BASE_URL = "https://trs.example.org/ga4gh/trs/v2";
const OTHER_URL = "https://other.example.org/ga4gh/trs/v2";
const MISSING = "Please provide either a base URL";

const TOOL_CLASS: ToolClass = { id: "workflow", name: "Workflow" };

const tool = (id: string): Tool => ({
  id,
  url: `${BASE_URL}/tools/${id}`,
  organization: "Example",
  toolclass: TOOL_CLASS,
  versions: [],
});

/**
 * A provider whose list methods are stubs; the tools list uses no other
 * methods.
 */
const stubProvider = (tools: Tool[] | Promise<Tool[]> = [tool("a")]) => {
  const stubs = {
    getToolClasses: sinon.stub().resolves([TOOL_CLASS]),
    getToolsList: sinon.stub().callsFake(async () => tools),
  };
  return { stubs, provider: stubs as unknown as TrsProvider };
};

/** A promise and the function that resolves it. */
const deferred = <T>() => {
  let settleWith: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    settleWith = resolve;
  });
  return { promise, resolve: settleWith };
};

/** The component's private state that the tests read and set. */
const internals = (el: ECCClientGa4ghTrsTools) =>
  el as unknown as {
    tools: Tool[];
    currentPage: number;
    lastPage: number;
    loading: boolean;
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
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    const { stubs, provider } = stubProvider();

    el.provider = provider;
    await waitUntil(() => internals(el).tools.length === 1);
    await el.updateComplete;

    expect(stubs.getToolsList.callCount).to.equal(1);
    expect(stubs.getToolClasses.callCount).to.equal(1);
    expect(el.shadowRoot?.textContent).not.to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads the first page from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider([tool("b")]);
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => internals(el).tools[0]?.id === "a");
    internals(el).currentPage = 3;
    internals(el).lastPage = 3;
    const firstCalls = first.stubs.getToolsList.callCount;

    el.provider = second.provider;
    await waitUntil(() => internals(el).tools[0]?.id === "b");

    expect(internals(el).currentPage).to.equal(1);
    expect(second.stubs.getToolsList.firstCall.args[1]).to.equal(0);
    expect(first.stubs.getToolsList.callCount).to.equal(firstCalls);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<Tool[]>();
    const first = stubProvider(slow.promise);
    const second = stubProvider([tool("b")]);
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );

    el.provider = second.provider;
    await waitUntil(() => internals(el).tools[0]?.id === "b");
    slow.resolve([tool("a")]);
    await slow.promise;
    await el.updateComplete;

    expect(internals(el).tools[0].id).to.equal("b");
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

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() =>
      fetchStub
        .getCalls()
        .some((call) => call.args[0] === `${BASE_URL}/toolClasses`)
    );

    el.baseUrl = OTHER_URL;
    await waitUntil(() =>
      fetchStub
        .getCalls()
        .some((call) => call.args[0] === `${OTHER_URL}/toolClasses`)
    );
  });

  it("shows an error once the provider is removed without a base URL", async () => {
    const { provider } = stubProvider();
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => internals(el).tools.length === 1);

    el.provider = undefined;
    await el.updateComplete;
    await el.updateComplete;

    expect(internals(el).tools).to.deep.equal([]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });

  it("stops loading once the provider is removed during a load", async () => {
    const slow = deferred<Tool[]>();
    const { provider } = stubProvider(slow.promise);
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    expect(internals(el).loading).to.equal(true);

    el.provider = undefined;
    await el.updateComplete;
    slow.resolve([tool("a")]);
    await slow.promise;
    await el.updateComplete;

    expect(internals(el).loading).to.equal(false);
    expect(internals(el).tools).to.deep.equal([]);
  });
});
