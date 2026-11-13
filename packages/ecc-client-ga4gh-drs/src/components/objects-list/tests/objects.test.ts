/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghDrsObjects } from "../objects.js";
import type {
  DrsObject,
  DrsProvider,
} from "../../../providers/drs-provider.js";

const BASE_URL = "https://drs.example.org/ga4gh/drs/v1";
const OTHER_URL = "https://other.example.org/ga4gh/drs/v1";
const MISSING = "Please provide either a base URL";

const object = (id: string) => ({ id } as unknown as DrsObject);

type Page = { objects: DrsObject[] };

/**
 * A provider whose object list is a stub; the list uses no other method
 * before an object is selected.
 */
const stubProvider = (
  page: Page | Promise<Page> = { objects: [object("a")] }
) => {
  const stubs = {
    getObjects: sinon.stub().callsFake(async () => page),
  };
  return { stubs, provider: stubs as unknown as DrsProvider };
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
const internals = (el: ECCClientGa4ghDrsObjects) =>
  el as unknown as { objects: DrsObject[]; currentPage: number };

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
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    const { stubs, provider } = stubProvider();

    el.provider = provider;
    await waitUntil(() => internals(el).objects.length === 1);
    await el.updateComplete;

    expect(stubs.getObjects.callCount).to.equal(1);
    expect(el.shadowRoot?.textContent).not.to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads the first page from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider({ objects: [object("b")] });
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .provider=${first.provider}
      ></ecc-client-ga4gh-drs-objects>`
    );
    await waitUntil(() => internals(el).objects[0]?.id === "a");
    internals(el).currentPage = 3;
    const firstCalls = first.stubs.getObjects.callCount;

    el.provider = second.provider;
    await waitUntil(() => internals(el).objects[0]?.id === "b");

    expect(internals(el).currentPage).to.equal(1);
    expect(second.stubs.getObjects.firstCall.args[1]).to.equal(0);
    expect(first.stubs.getObjects.callCount).to.equal(firstCalls);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<Page>();
    const first = stubProvider(slow.promise);
    const second = stubProvider({ objects: [object("b")] });
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .provider=${first.provider}
      ></ecc-client-ga4gh-drs-objects>`
    );

    el.provider = second.provider;
    await waitUntil(() => internals(el).objects[0]?.id === "b");
    slow.resolve({ objects: [object("a")] });
    await slow.promise;
    await el.updateComplete;

    expect(internals(el).objects[0].id).to.equal("b");
  });

  it("keeps a provider when the base URL is set too", async () => {
    const { stubs, provider } = stubProvider();
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .provider=${provider}
      ></ecc-client-ga4gh-drs-objects>`
    );
    await waitUntil(() => internals(el).objects.length === 1);
    const calls = stubs.getObjects.callCount;

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(stubs.getObjects.callCount).to.equal(calls);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-drs-objects>`
    );
    await waitUntil(() =>
      fetchStub
        .getCalls()
        .some((call) => String(call.args[0]).startsWith(`${BASE_URL}/objects`))
    );

    el.baseUrl = OTHER_URL;
    await waitUntil(() =>
      fetchStub
        .getCalls()
        .some((call) => String(call.args[0]).startsWith(`${OTHER_URL}/objects`))
    );
  });

  it("shows an error once the provider is removed without a base URL", async () => {
    const { provider } = stubProvider();
    const el = await fixture<ECCClientGa4ghDrsObjects>(
      html`<ecc-client-ga4gh-drs-objects
        .provider=${provider}
      ></ecc-client-ga4gh-drs-objects>`
    );
    await waitUntil(() => internals(el).objects.length === 1);

    el.provider = undefined;
    await el.updateComplete;
    await el.updateComplete;

    expect(internals(el).objects).to.deep.equal([]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });
});
