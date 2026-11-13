/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientElixirTrsToolCreate } from "../tool-create.js";
import type { TrsFilerProvider } from "../../../providers/index.js";

const BASE_URL = "https://trs.example.org/ga4gh/trs/v2";

/**
 * A provider whose tool class list is a stub; the form loads nothing else
 * before a submit.
 */
const stubProvider = () => {
  const stubs = {
    getToolClasses: sinon
      .stub()
      .resolves([{ id: "workflow", name: "Workflow" }]),
  };
  return { stubs, provider: stubs as unknown as TrsFilerProvider };
};

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
    await waitUntil(() => stubs.getToolClasses.callCount === 1);

    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider();
    const el = await fixture<ECCClientElixirTrsToolCreate>(
      html`<ecc-client-elixir-trs-tool-create
        .provider=${first.provider}
      ></ecc-client-elixir-trs-tool-create>`
    );
    await waitUntil(() => first.stubs.getToolClasses.callCount === 1);

    el.provider = second.provider;
    await waitUntil(() => second.stubs.getToolClasses.callCount === 1);

    expect(first.stubs.getToolClasses.callCount).to.equal(1);
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
});
