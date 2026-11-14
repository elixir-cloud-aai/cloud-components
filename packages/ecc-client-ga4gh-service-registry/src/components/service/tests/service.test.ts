/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghServiceRegistryService } from "../service.js";
import type {
  ExternalService,
  ServiceRegistryProvider,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";
const OTHER_URL = "https://other.example.org/ga4gh/registry/v1";
const MISSING = "Please provide either a base URL";

const service = (id: string): ExternalService => ({
  id,
  name: `Service ${id}`,
  type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
  organization: { name: "Example", url: "https://example.org" },
  version: "1.0.0",
  url: "https://tes.example.org",
});

/**
 * A provider whose methods are stubs; `getServiceById` returns the given
 * service, or one with the requested ID.
 */
const stubProvider = (result?: Promise<ExternalService>) =>
  ({
    getServices: sinon.stub().rejects(new Error("not used")),
    getServiceById: sinon
      .stub()
      .callsFake(async (id: string) => result ?? service(id)),
    getServiceTypes: sinon.stub().rejects(new Error("not used")),
    getServiceInfo: sinon.stub().rejects(new Error("not used")),
  } satisfies ServiceRegistryProvider);

/** A promise and the function that resolves it. */
const deferred = <T>() => {
  let settleWith: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    settleWith = resolve;
  });
  return { promise, resolve: settleWith };
};

/** The service the component shows. */
const shown = (el: ECCClientGa4ghServiceRegistryService) =>
  (el as unknown as { service: ExternalService | null }).service;

describe("ecc-client-ga4gh-service-registry-service provider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify(service("a")), {
          headers: { "Content-Type": "application/json" },
        })
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("loads from a provider set after the first update", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="a"
      ></ecc-client-ga4gh-service-registry-service>`
    );
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    const provider = stubProvider();

    el.provider = provider;
    await waitUntil(() => shown(el)?.id === "a");
    await el.updateComplete;

    expect(provider.getServiceById.callCount).to.equal(1);
    expect(el.shadowRoot?.textContent).not.to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const replacement = { ...service("a"), name: "Replacement" };
    const second = stubProvider(Promise.resolve(replacement));
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="a"
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => shown(el)?.id === "a");
    const firstCalls = first.getServiceById.callCount;

    el.provider = second;
    await waitUntil(() => shown(el)?.name === "Replacement");

    expect(second.getServiceById.callCount).to.equal(1);
    expect(first.getServiceById.callCount).to.equal(firstCalls);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<ExternalService>();
    const first = stubProvider(slow.promise);
    const second = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="b"
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-service>`
    );

    el.provider = second;
    await waitUntil(() => shown(el)?.id === "b");
    slow.resolve(service("stale"));
    await slow.promise;
    await el.updateComplete;

    expect(shown(el)?.id).to.equal("b");
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="a"
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => shown(el)?.id === "a");
    const calls = provider.getServiceById.callCount;

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(provider.getServiceById.callCount).to.equal(calls);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="a"
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => fetchStub.callCount > 0);

    el.baseUrl = OTHER_URL;
    await waitUntil(() =>
      fetchStub
        .getCalls()
        .some((call) => call.args[0] === `${OTHER_URL}/services/a`)
    );

    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/services/a`);
  });

  it("loads another service from the same provider", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="a"
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => shown(el)?.id === "a");

    el.serviceId = "b";
    await waitUntil(() => shown(el)?.id === "b");
  });

  it("shows an error once the provider is removed without a base URL", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="a"
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => shown(el)?.id === "a");

    el.provider = undefined;
    await el.updateComplete;
    await el.updateComplete;

    expect(shown(el)).to.equal(null);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
  });
});
