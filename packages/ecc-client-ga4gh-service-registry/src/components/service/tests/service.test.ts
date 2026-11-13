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

describe("ecc-client-ga4gh-service-registry-service provider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify(SERVICE), {
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
        serviceId="service-1"
      ></ecc-client-ga4gh-service-registry-service>`
    );
    const provider = stubProvider();

    el.provider = provider;
    await waitUntil(() => provider.getServiceById.callCount === 1);

    expect(provider.getServiceById.firstCall.args[0]).to.equal("service-1");
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads from a provider that replaces the first one", async () => {
    const first = stubProvider();
    const second = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="service-1"
        .provider=${first}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => first.getServiceById.callCount > 0);

    el.provider = second;
    await waitUntil(() => second.getServiceById.callCount === 1);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="service-1"
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => provider.getServiceById.callCount > 0);

    el.baseUrl = BASE_URL;
    await el.updateComplete;

    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads another service from the same provider", async () => {
    const provider = stubProvider();
    const el = await fixture<ECCClientGa4ghServiceRegistryService>(
      html`<ecc-client-ga4gh-service-registry-service
        serviceId="service-1"
        .provider=${provider}
      ></ecc-client-ga4gh-service-registry-service>`
    );
    await waitUntil(() => provider.getServiceById.callCount > 0);

    el.serviceId = "service-2";
    await waitUntil(
      () => provider.getServiceById.lastCall.args[0] === "service-2"
    );
  });
});
