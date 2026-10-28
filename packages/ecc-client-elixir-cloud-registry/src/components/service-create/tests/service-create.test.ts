/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServiceCreate from "../service-create.js";
import type {
  CloudRegistryProvider,
  ServiceType,
} from "../../../providers/index.js";

const TYPE_A: ServiceType = {
  group: "org.ga4gh",
  artifact: "tes",
  version: "1.1.0",
};
const TYPE_B: ServiceType = {
  group: "org.ga4gh",
  artifact: "wes",
  version: "1.2.0",
};

/** A provider whose methods are stubs. */
const stubProvider = (types: ServiceType[] | Promise<ServiceType[]>) =>
  ({
    getServices: sinon.stub().resolves([]),
    getServiceById: sinon.stub().rejects(new Error("not used")),
    getServiceTypes: sinon.stub().callsFake(async () => types),
    getServiceInfo: sinon.stub().rejects(new Error("not used")),
    createService: sinon.stub().resolves("service-1"),
    createServiceWithId: sinon.stub().resolves("service-1"),
    updateService: sinon.stub().resolves("service-1"),
  } satisfies CloudRegistryProvider);

type Internals = {
  serviceTypes: ServiceType[];
  formData: Record<string, unknown>;
  handleSubmit(): Promise<void>;
};

/** The component's private state, for the tests only. */
const internals = (el: ECCClientElixirCloudRegistryServiceCreate) =>
  el as unknown as Internals;

/** Fills in the required fields, so that a submit reaches the provider. */
const fillForm = (el: ECCClientElixirCloudRegistryServiceCreate) => {
  const state = internals(el);
  state.formData = {
    ...state.formData,
    name: "My TES",
    url: "https://tes.example.org/ga4gh/tes/v1",
    organization: { name: "Example", url: "https://example.org" },
    type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
    version: "1.0.0",
  };
};

describe("ecc-client-elixir-cloud-registry-service-create provider", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("uses a provider that replaces the first one", async () => {
    const first = stubProvider([TYPE_A]);
    const second = stubProvider([TYPE_B]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => internals(el).serviceTypes.length === 1);

    el.provider = second;
    await el.updateComplete;
    await waitUntil(() => internals(el).serviceTypes[0] === TYPE_B);

    fillForm(el);
    await internals(el).handleSubmit();

    expect(second.getServiceTypes.callCount).to.equal(1);
    expect(second.createService.callCount).to.equal(1);
    expect(first.createService.callCount).to.equal(0);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const fetchStub = sinon
      .stub(window, "fetch")
      .callsFake(async () => new Response("[]"));
    const provider = stubProvider([TYPE_A]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .baseUrl=${"https://registry.example.org/ga4gh/registry/v1"}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    el.baseUrl = "https://other.example.org/ga4gh/registry/v1";
    await el.updateComplete;

    fillForm(el);
    await internals(el).handleSubmit();

    expect(provider.createService.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("keeps the types of the current provider", async () => {
    let resolveFirst: (types: ServiceType[]) => void = () => undefined;
    const first = stubProvider(
      new Promise<ServiceType[]>((resolve) => {
        resolveFirst = resolve;
      })
    );
    const second = stubProvider([TYPE_B]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );

    el.provider = second;
    await el.updateComplete;
    await waitUntil(() => internals(el).serviceTypes[0] === TYPE_B);
    resolveFirst([TYPE_A]);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(internals(el).serviceTypes).to.deep.equal([TYPE_B]);
  });

  it("loads the service types once", async () => {
    const provider = stubProvider([TYPE_A]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .baseUrl=${"https://registry.example.org/ga4gh/registry/v1"}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => internals(el).serviceTypes.length === 1);

    expect(provider.getServiceTypes.callCount).to.equal(1);
  });
});
