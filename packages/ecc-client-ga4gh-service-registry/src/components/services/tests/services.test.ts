/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type { ECCClientGa4ghServiceRegistryServices } from "../services.js";
import type {
  ExternalService,
  ServiceRegistryProvider,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

const SERVICE: ExternalService = {
  id: "service-1",
  name: "Service 1",
  type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
  organization: { name: "Example", url: "https://example.org" },
  version: "1.0.0",
  url: "https://tes.example.org",
};

/** A provider whose methods are stubs. */
const stubProvider = () =>
  ({
    getServices: sinon.stub().resolves([SERVICE]),
    getServiceById: sinon.stub().resolves(SERVICE),
    getServiceTypes: sinon.stub().resolves([SERVICE.type]),
    getServiceInfo: sinon.stub().resolves(SERVICE),
  } satisfies ServiceRegistryProvider);

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
    const provider = stubProvider();

    el.provider = provider;
    await waitUntil(() => provider.getServiceTypes.callCount === 1);

    expect(provider.getServices.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => first.getServiceTypes.callCount === 1);

    el.provider = second;
    await waitUntil(() => second.getServiceTypes.callCount === 1);

    expect(second.getServices.callCount).to.equal(1);
    expect(first.getServices.callCount).to.equal(1);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => provider.getServiceTypes.callCount === 1);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(provider.getServices.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("uses the base URL once the provider is removed", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryServices>(
      html`<ecc-client-ga4gh-service-registry-services
        .provider=${provider}
        .baseUrl=${BASE_URL}
      ></ecc-client-ga4gh-service-registry-services>`
    );
    await waitUntil(() => provider.getServiceTypes.callCount === 1);

    el.provider = undefined;
    await waitUntil(() => fetchStub.callCount === 2);

    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/services`);
    expect(provider.getServices.callCount).to.equal(1);
  });
});
