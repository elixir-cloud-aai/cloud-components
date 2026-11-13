/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghServiceRegistryServices } from "../services.js";
import type {
  ExternalService,
  ServiceRegistryProvider,
} from "../../../providers/index.js";
import { RestServiceRegistryProvider } from "../../../providers/rest-sr-provider.js";

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

/** A provider whose methods are stubs. */
const stubProvider = (
  services: ExternalService[] | Promise<ExternalService[]> = [service("a")]
) =>
  ({
    getServices: sinon.stub().callsFake(async () => services),
    getServiceById: sinon.stub().rejects(new Error("not used")),
    getServiceTypes: sinon.stub().resolves([]),
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

/** The services the component shows. */
const shown = (el: ECCClientGa4ghServiceRegistryServices) =>
  (el as unknown as { services: ExternalService[] }).services;

describe("ecc-client-ga4gh-service-registry-services provider", () => {
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
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services></ecc-client-ga4gh-service-registry-services>`
    );
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    const provider = stubProvider();

    el.provider = provider;
    await waitUntil(() => shown(el).length === 1);
    await el.updateComplete;

    expect(provider.getServices.callCount).to.equal(1);
    expect(provider.getServiceTypes.callCount).to.equal(1);
    expect(el.shadowRoot?.textContent).not.to.contain(MISSING);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider([service("b")]);
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => shown(el)[0]?.id === "a");

    el.provider = second;
    await waitUntil(() => shown(el)[0]?.id === "b");

    expect(second.getServices.callCount).to.equal(1);
    expect(first.getServices.callCount).to.equal(1);
  });

  it("drops a slower load from a replaced provider", async () => {
    const slow = deferred<ExternalService[]>();
    const first = stubProvider(slow.promise);
    const second = stubProvider([service("b")]);
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-services>`
    );

    el.provider = second;
    await waitUntil(() => shown(el)[0]?.id === "b");
    slow.resolve([service("a")]);
    await slow.promise;
    await el.updateComplete;

    expect(shown(el)[0].id).to.equal("b");
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${provider}
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => shown(el).length === 1);

    el.baseUrl = OTHER_URL;
    await el.updateComplete;

    expect(provider.getServices.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from the base URL and reloads when it changes", async () => {
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => fetchStub.callCount === 2);

    el.baseUrl = OTHER_URL;
    await waitUntil(() => fetchStub.callCount === 4);

    const urls = fetchStub.getCalls().map((call) => call.args[0]);
    expect(urls).to.include(`${BASE_URL}/services`);
    expect(urls).to.include(`${OTHER_URL}/services`);
  });

  it("uses the base URL once the provider is removed", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${provider}
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => shown(el).length === 1);

    el.provider = undefined;
    await waitUntil(() => fetchStub.callCount === 2);

    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/services`);
    expect(provider.getServices.callCount).to.equal(1);
  });

  it("uses a REST provider of its own once a custom REST provider is removed", async () => {
    // a custom provider that is a REST provider for the same base URL
    class CustomProvider extends RestServiceRegistryProvider {
      requests = 0;

      protected fetch(input: RequestInfo | URL, init?: RequestInit) {
        this.requests += 1;
        return super.fetch(input, init);
      }
    }
    const provider = new CustomProvider(BASE_URL);
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${provider}
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => fetchStub.callCount === 2);
    const { requests } = provider;

    el.provider = undefined;
    await waitUntil(() => fetchStub.callCount === 4);

    expect(provider.requests).to.equal(requests);
  });

  it("shows an error once the provider is removed without a base URL", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => shown(el).length === 1);
    const changed = oneEvent(el, "ecc-services-changed");

    el.provider = undefined;
    await el.updateComplete;
    await el.updateComplete;

    expect(shown(el)).to.deep.equal([]);
    expect(el.shadowRoot?.textContent).to.contain(MISSING);
    expect((await changed).detail.services).to.deep.equal([]);
  });

  it("shows no services of a replaced provider when the new one fails", async () => {
    const first = stubProvider();
    const second = stubProvider();
    second.getServices.callsFake(async () => {
      throw new Error("Unavailable");
    });
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => shown(el).length === 1);

    el.provider = second;
    await waitUntil(() => el.shadowRoot?.textContent?.includes("Unavailable"));

    expect(shown(el)).to.deep.equal([]);
  });
});
