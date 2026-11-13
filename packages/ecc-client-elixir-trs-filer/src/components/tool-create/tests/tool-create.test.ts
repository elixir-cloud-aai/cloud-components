/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientElixirTrsToolCreate } from "../tool-create.js";
import type { TrsFilerProvider } from "../../../providers/index.js";

const BASE_URL = "https://trs.example.org/ga4gh/trs/v2";
const OTHER_URL = "https://other.example.org/ga4gh/trs/v2";

type ToolClass = { id: string; name: string };

/**
 * A provider whose tool class list is a stub; the form loads nothing else
 * before a submit.
 */
const stubProvider = (
  classes: ToolClass[] | Promise<ToolClass[]> = [
    { id: "workflow", name: "Workflow" },
  ]
) => {
  const stubs = {
    getToolClasses: sinon.stub().callsFake(async () => classes),
  };
  return { stubs, provider: stubs as unknown as TrsFilerProvider };
};

/** A promise and the function that resolves it. */
const deferred = <T>() => {
  let settleWith: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    settleWith = resolve;
  });
  return { promise, resolve: settleWith };
};

/** The tool classes the form offers. */
const offered = (el: ECCClientElixirTrsToolCreate) =>
  (el as unknown as { toolClasses: ToolClass[] }).toolClasses;

describe("ecc-client-elixir-trs-tool-create provider", () => {
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
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create></ecc-client-elixir-trs-tool-create>`
    );
    const { stubs, provider } = stubProvider();

    el.provider = provider;
    await waitUntil(() => offered(el)[0]?.id === "workflow");

    expect(stubs.getToolClasses.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider([{ id: "tool", name: "Tool" }]);
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create
        .provider=${first.provider}
      ></ecc-client-elixir-trs-tool-create>`
    );
    await waitUntil(() => offered(el)[0]?.id === "workflow");

    el.provider = second.provider;
    await waitUntil(() => offered(el)[0]?.id === "tool");

    expect(first.stubs.getToolClasses.callCount).to.equal(1);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<ToolClass[]>();
    const first = stubProvider(slow.promise);
    const second = stubProvider([{ id: "tool", name: "Tool" }]);
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create
        .provider=${first.provider}
      ></ecc-client-elixir-trs-tool-create>`
    );

    el.provider = second.provider;
    await waitUntil(() => offered(el)[0]?.id === "tool");
    slow.resolve([{ id: "workflow", name: "Workflow" }]);
    await slow.promise;
    await el.updateComplete;

    expect(offered(el)[0].id).to.equal("tool");
  });

  it("keeps a provider when the base URL is set too", async () => {
    const { stubs, provider } = stubProvider();
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create
        .provider=${provider}
      ></ecc-client-elixir-trs-tool-create>`
    );
    await waitUntil(() => stubs.getToolClasses.callCount === 1);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(stubs.getToolClasses.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create
        .baseUrl=${BASE_URL}
      ></ecc-client-elixir-trs-tool-create>`
    );
    await waitUntil(() => fetchStub.callCount === 1);

    el.baseUrl = OTHER_URL;
    await waitUntil(() => fetchStub.callCount === 2);

    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/toolClasses`);
    expect(fetchStub.secondCall.args[0]).to.equal(`${OTHER_URL}/toolClasses`);
  });

  it("offers no tool classes once the provider is removed without a base URL", async () => {
    const { provider } = stubProvider();
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create
        .provider=${provider}
      ></ecc-client-elixir-trs-tool-create>`
    );
    await waitUntil(() => offered(el).length === 1);

    el.provider = undefined;
    await el.updateComplete;

    expect(offered(el)).to.deep.equal([]);
  });
});
