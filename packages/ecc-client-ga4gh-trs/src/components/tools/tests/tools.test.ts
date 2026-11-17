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
    toolClasses: ToolClass[];
    toolClassMap: Record<string, string>;
    filterParams: Record<string, string | undefined | boolean>;
  };

/** The tool class select of the filters. */
const toolClassSelect = (el: ECCClientGa4ghTrsTools) =>
  el.shadowRoot?.querySelector("ecc-utils-design-select") as
    | (HTMLElement & { value: string })
    | null;

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

    const urls = fetchStub.getCalls().map((call) => String(call.args[0]));
    expect(urls.some((url) => url.startsWith(`${BASE_URL}/tools?`))).to.equal(
      true
    );
    expect(urls.some((url) => url.startsWith(`${OTHER_URL}/tools?`))).to.equal(
      true
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

  it("reports no tools when a replacing provider fails", async () => {
    const first = stubProvider();
    const second = stubProvider();
    second.stubs.getToolsList.callsFake(async () => {
      throw new Error("Unavailable");
    });
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => internals(el).tools.length === 1);
    const reported: Tool[][] = [];
    el.addEventListener("ecc-tools-changed", (e) =>
      reported.push((e as CustomEvent).detail.tools)
    );

    el.provider = second.provider;
    await waitUntil(() => el.shadowRoot?.textContent?.includes("Unavailable"));

    expect(internals(el).tools).to.deep.equal([]);
    expect(reported).to.deep.equal([[]]);
  });

  it("drops a late failure of an older load from a provider used again", async () => {
    let failFirst: (error: Error) => void = () => undefined;
    const first = stubProvider();
    first.stubs.getToolsList.onFirstCall().returns(
      new Promise<Tool[]>((_resolve, reject) => {
        failFirst = reject;
      })
    );
    const second = stubProvider([tool("b")]);
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    el.provider = second.provider;
    await waitUntil(() => internals(el).tools[0]?.id === "b");
    el.provider = first.provider;
    await waitUntil(() => internals(el).tools[0]?.id === "a");
    const reported: Tool[][] = [];
    el.addEventListener("ecc-tools-changed", (e) =>
      reported.push((e as CustomEvent).detail.tools)
    );

    failFirst(new Error("Unavailable"));
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    await el.updateComplete;

    expect(internals(el).tools[0]?.id).to.equal("a");
    expect(el.shadowRoot?.textContent).not.to.contain("Unavailable");
    expect(reported).to.deep.equal([]);
  });

  it("drops the tool class filter of a replaced provider", async () => {
    const first = stubProvider();
    first.stubs.getToolClasses.resolves([{ id: "notebook", name: "Notebook" }]);
    const second = stubProvider([tool("b")]);
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => internals(el).toolClasses.length === 1);
    const select = toolClassSelect(el);
    if (!select) throw new Error("No tool class select");
    select.value = "Notebook";
    select.dispatchEvent(
      new CustomEvent("ecc-input-changed", { detail: { value: "Notebook" } })
    );
    await waitUntil(() =>
      first.stubs.getToolsList
        .getCalls()
        .some((call) => call.args[2].toolClass === "Notebook")
    );

    el.provider = second.provider;
    await waitUntil(() => internals(el).tools[0]?.id === "b");
    await el.updateComplete;

    expect(second.stubs.getToolsList.firstCall.args[2].toolClass).to.equal("");
    expect(internals(el).filterParams.toolClass).to.equal("");
    expect(toolClassSelect(el)?.value).to.equal("");
  });

  it("offers no tool classes of a replaced provider while the new ones load", async () => {
    const first = stubProvider();
    first.stubs.getToolClasses.resolves([{ id: "notebook", name: "Notebook" }]);
    const slow = deferred<ToolClass[]>();
    const second = stubProvider([tool("b")]);
    second.stubs.getToolClasses.returns(slow.promise);
    const el = await fixture<ECCClientGa4ghTrsTools>(
      html`<ecc-client-ga4gh-trs-tools
        .provider=${first.provider}
      ></ecc-client-ga4gh-trs-tools>`
    );
    await waitUntil(() => internals(el).toolClasses.length === 1);

    el.provider = second.provider;
    await waitUntil(() => internals(el).tools[0]?.id === "b");
    await el.updateComplete;

    expect(internals(el).toolClasses).to.deep.equal([]);
    expect(internals(el).toolClassMap).to.deep.equal({});
    expect(el.shadowRoot?.textContent).not.to.contain("Notebook");

    slow.resolve([TOOL_CLASS]);
    await waitUntil(() => internals(el).toolClasses.length === 1);
    expect(internals(el).toolClassMap).to.deep.equal({ Workflow: "workflow" });
  });
});
