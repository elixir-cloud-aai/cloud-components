/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghDrsObjects } from "../objects.js";
import type { DrsProvider } from "../../../providers/drs-provider.js";

const BASE_URL = "https://drs.example.org/ga4gh/drs/v1";

/**
 * A provider whose object list is a stub; the list uses no other method
 * before an object is selected.
 */
const stubProvider = () => {
  const stubs = {
    getObjects: sinon.stub().resolves({ objects: [] }),
  };
  return { stubs, provider: stubs as unknown as DrsProvider };
};

describe("ecc-client-ga4gh-drs-objects provider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify({ objects: [] }), {
          headers: { "Content-Type": "application/json" },
        })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("loads from a provider set after the first update", async () => {
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects></ecc-client-ga4gh-drs-objects>`
    );
    const { stubs, provider } = stubProvider();

    el.provider = provider;
    await waitUntil(() => stubs.getObjects.callCount === 1);

    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider();
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .provider=${first.provider}
      ></ecc-client-ga4gh-drs-objects>`
    );
    await waitUntil(() => first.stubs.getObjects.callCount > 0);
    const firstCalls = first.stubs.getObjects.callCount;

    el.provider = second.provider;
    await waitUntil(() => second.stubs.getObjects.callCount === 1);

    expect(first.stubs.getObjects.callCount).to.equal(firstCalls);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const { stubs, provider } = stubProvider();
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .provider=${provider}
      ></ecc-client-ga4gh-drs-objects>`
    );
    await waitUntil(() => stubs.getObjects.callCount > 0);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(fetchStub.callCount).to.equal(0);
  });
});
