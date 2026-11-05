/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServiceCreate from "../service-create.js";
import type {
  CloudRegistryProvider,
  RegistrationRules,
  RegistryServiceInfo,
  Service,
  ServiceType,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";
const OTHER_URL = "https://other.example.org/ga4gh/registry/v1";

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

/** A promise and the function that resolves it. */
const deferred = <T>() => {
  let settleWith: (value: T) => void = () => undefined;
  const promise = new Promise<T>((resolve) => {
    settleWith = resolve;
  });
  return { promise, resolve: settleWith };
};

/** Lets pending promise callbacks and a resulting update run. */
const settle = async (el: ECCClientElixirCloudRegistryServiceCreate) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
  await el.updateComplete;
};

/*
 * The tests read and set the component's private state, because the form
 * doesn't show the service types yet and filling in all its inputs would
 * test the form rather than the provider handling.
 */
type Internals = {
  serviceTypes: ServiceType[];
  typeChoice: string;
  formData: Record<string, unknown>;
  handleSubmit(): Promise<void>;
};

const internals = (el: ECCClientElixirCloudRegistryServiceCreate) =>
  el as unknown as Internals;

/**
 * Fills in the required fields, so that a submit reaches the provider; the
 * type as a new one ("Add new service type"), whichever types are listed.
 */
const fillForm = (el: ECCClientElixirCloudRegistryServiceCreate) => {
  const state = internals(el);
  state.typeChoice = "new";
  state.formData = {
    ...state.formData,
    name: "My TES",
    url: "https://tes.example.org/ga4gh/tes/v1",
    organization: { name: "Example", url: "https://example.org" },
    type: { ...TYPE_A },
    version: "1.0.0",
  };
};

/** Requests of the stubbed `fetch` for the service types. */
const typeRequests = (fetchStub: sinon.SinonStub) =>
  fetchStub
    .getCalls()
    .filter((call) => String(call.args[0]).endsWith("/types"));

describe("ecc-client-elixir-cloud-registry-service-create provider", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch").callsFake(
      async () =>
        new Response(JSON.stringify([TYPE_A]), {
          headers: { "Content-Type": "application/json" },
        })
    );
  });

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
    await waitUntil(() => internals(el).serviceTypes[0] === TYPE_A);

    el.provider = second;
    await el.updateComplete;
    await waitUntil(() => internals(el).serviceTypes[0] === TYPE_B);

    expect(second.getServiceTypes.callCount).to.equal(1);
    fillForm(el);
    await internals(el).handleSubmit();

    // reloaded after the create, to list a type that the service added
    expect(second.getServiceTypes.callCount).to.equal(2);
    expect(second.createService.callCount).to.equal(1);
    expect(first.createService.callCount).to.equal(0);
  });

  it("keeps a provider when the base URL is set too", async () => {
    const provider = stubProvider([TYPE_A]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .baseUrl=${BASE_URL}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    el.baseUrl = OTHER_URL;
    await el.updateComplete;

    expect(provider.getServiceTypes.callCount).to.equal(1);
    fillForm(el);
    await internals(el).handleSubmit();

    // reloaded after the create, to list a type that the service added
    expect(provider.getServiceTypes.callCount).to.equal(2);
    expect(provider.createService.callCount).to.equal(1);
    expect(fetchStub.callCount).to.equal(0);
  });

  it("loads the types for a base URL once", async () => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .baseUrl=${BASE_URL}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => internals(el).serviceTypes.length === 1);
    await settle(el);

    expect(typeRequests(fetchStub).map((call) => call.args[0])).to.deep.equal([
      `${BASE_URL}/services/types`,
    ]);
  });

  it("loads the types again for a new base URL", async () => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .baseUrl=${BASE_URL}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    el.baseUrl = OTHER_URL;
    await settle(el);

    expect(typeRequests(fetchStub).map((call) => call.args[0])).to.deep.equal([
      `${BASE_URL}/services/types`,
      `${OTHER_URL}/services/types`,
    ]);
  });

  it("uses the base URL once the provider is removed", async () => {
    const provider = stubProvider([TYPE_B]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .baseUrl=${BASE_URL}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    el.provider = undefined;
    await el.updateComplete;
    await waitUntil(() => internals(el).serviceTypes[0]?.artifact === "tes");

    expect(typeRequests(fetchStub).map((call) => call.args[0])).to.deep.equal([
      `${BASE_URL}/services/types`,
    ]);
  });

  it("submits with a provider set just before", async () => {
    const first = stubProvider([TYPE_A]);
    const second = stubProvider([TYPE_A]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    fillForm(el);

    el.provider = second;
    await internals(el).handleSubmit();

    expect(second.createService.callCount).to.equal(1);
    expect(first.createService.callCount).to.equal(0);
  });

  it("drops a late answer of a provider that came back", async () => {
    const late = deferred<ServiceType[]>();
    const first = stubProvider([]);
    first.getServiceTypes.onFirstCall().callsFake(() => late.promise);
    first.getServiceTypes.onSecondCall().resolves([TYPE_B]);
    const second = stubProvider([TYPE_A]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );

    el.provider = second;
    await el.updateComplete;
    el.provider = first;
    await el.updateComplete;
    await waitUntil(() => internals(el).serviceTypes[0] === TYPE_B);
    late.resolve([TYPE_A]);
    await settle(el);

    expect(internals(el).serviceTypes).to.deep.equal([TYPE_B]);
  });

  it("keeps the types of the current provider", async () => {
    const late = deferred<ServiceType[]>();
    const first = stubProvider(late.promise);
    const second = stubProvider([TYPE_B]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );

    el.provider = second;
    await el.updateComplete;
    await waitUntil(() => internals(el).serviceTypes[0] === TYPE_B);
    late.resolve([TYPE_A]);
    await settle(el);

    expect(internals(el).serviceTypes).to.deep.equal([TYPE_B]);
  });

  it("reports only failures of the current provider", async () => {
    const late = deferred<void>();
    const first = stubProvider([]);
    first.getServiceTypes.callsFake(async () => {
      await late.promise;
      throw new Error("old token");
    });
    const second = stubProvider([TYPE_B]);
    const failed = sinon.spy();
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
        @ecc-service-create-failed=${failed}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );

    el.provider = second;
    await el.updateComplete;
    late.resolve();
    await settle(el);

    expect(failed.callCount).to.equal(0);
    expect(internals(el).serviceTypes).to.deep.equal([TYPE_B]);
  });

  it("drops the old types if the new provider fails", async () => {
    const first = stubProvider([TYPE_A]);
    const second = stubProvider([]);
    second.getServiceTypes.rejects(new Error("unauthorized"));
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${first}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => internals(el).serviceTypes.length === 1);

    const failed = oneEvent(el, "ecc-service-create-failed");
    el.provider = second;
    const { detail } = await failed;

    expect(detail.error).to.equal("Failed to load service types: unauthorized");
    expect(internals(el).serviceTypes).to.deep.equal([]);
  });

  it("asks for a provider or a base URL", async () => {
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-service-create"
    );
    const failed = oneEvent(el, "ecc-service-create-validation-failed");
    document.body.appendChild(el);
    const { detail } = await failed;
    el.remove();

    expect(detail.error).to.contain("base URL");
    expect(fetchStub.callCount).to.equal(0);
  });
});

/** Entries of the type list as shown: labels of items, `---` for separators */
const typeListEntries = (el: ECCClientElixirCloudRegistryServiceCreate) =>
  Array.from(
    el.shadowRoot?.querySelector(
      "#service-type ecc-utils-design-select-content"
    )?.children ?? []
  ).map((entry) =>
    entry.localName === "ecc-utils-design-select-separator"
      ? "---"
      : entry.textContent?.replace(/\s+/g, " ").trim()
  );

describe("ecc-client-elixir-cloud-registry-service-create type list", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("offers a new type first, apart from the registered types", async () => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${stubProvider([TYPE_A, TYPE_B])}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => internals(el).serviceTypes.length === 2);
    await el.updateComplete;

    expect(typeListEntries(el)).to.deep.equal([
      "Add new service type",
      "---",
      "org.ga4gh · tes · 1.1.0",
      "org.ga4gh · wes · 1.2.0",
    ]);
  });

  it("offers only the registered types if adding is off", async () => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${stubProvider([TYPE_A])}
        .allowNewType=${false}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => internals(el).serviceTypes.length === 1);
    await el.updateComplete;

    expect(typeListEntries(el)).to.deep.equal(["org.ga4gh · tes · 1.1.0"]);
  });

  it("sets nothing apart while no types are listed", async () => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${stubProvider([])}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await el.updateComplete;

    expect(typeListEntries(el)).to.deep.equal(["Add new service type"]);
  });
});

describe("ecc-client-elixir-cloud-registry-service-create registration rules", () => {
  /** Service info of a registry, without its rules. */
  const SERVICE_INFO: Service = {
    id: "org.example.registry",
    name: "Example registry",
    type: {
      group: "org.ga4gh",
      artifact: "service-registry",
      version: "1.0.0",
    },
    organization: { name: "Example", url: "https://example.org" },
    version: "1.0.0",
  };

  /** Environments that the form offers by default. */
  const DEFAULTS = ["prod", "test", "dev", "staging"];

  const RULES: RegistrationRules = {
    environments: ["prod", "beta"],
    urlSchemes: ["https"],
    serviceTypes: "open",
    maxUnusedServiceTypes: 10,
    maxServicesPerUser: 50,
  };

  const rulesInternals = (el: ECCClientElixirCloudRegistryServiceCreate) =>
    el as unknown as {
      anyEnvironment: boolean;
      environmentOptions: { value: string }[];
    };

  /** The form, once it has handled the given service info. */
  const formWithInfo = async (info: unknown) => {
    const provider = stubProvider([TYPE_A]);
    provider.getServiceInfo.resolves(info);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => provider.getServiceInfo.callCount === 1);
    await settle(el);
    return rulesInternals(el);
  };

  const values = (state: { environmentOptions: { value: string }[] }) =>
    state.environmentOptions.map(({ value }) => value);

  afterEach(() => {
    sinon.restore();
  });

  it("offers the environments of `registrationRules`", async () => {
    const info: RegistryServiceInfo = {
      ...SERVICE_INFO,
      registrationRules: RULES,
    };

    expect(values(await formWithInfo(info))).to.deep.equal(["prod", "beta"]);
  });

  it("allows any environment if the registry's list is empty", async () => {
    const info: RegistryServiceInfo = {
      ...SERVICE_INFO,
      registrationRules: { ...RULES, environments: [] },
    };

    expect((await formWithInfo(info)).anyEnvironment).to.equal(true);
  });

  it("offers its defaults without rules", async () => {
    expect(values(await formWithInfo(SERVICE_INFO))).to.deep.equal(DEFAULTS);
  });

  it("warns of the former name `registration_rules`, unread", async () => {
    const warn = sinon.stub(console, "warn");
    const info = { ...SERVICE_INFO, registration_rules: RULES };

    expect(values(await formWithInfo(info))).to.deep.equal(DEFAULTS);
    expect(warn.calledWithMatch("registration_rules")).to.equal(true);
  });

  it("doesn't warn if the new name is there too", async () => {
    const warn = sinon.stub(console, "warn");
    const info = {
      ...SERVICE_INFO,
      registrationRules: RULES,
      registration_rules: RULES,
    };

    expect(values(await formWithInfo(info))).to.deep.equal(["prod", "beta"]);
    expect(warn.called).to.equal(false);
  });

  [undefined, null].forEach((former) => {
    it(`doesn't warn of a former name that is ${former}`, async () => {
      const warn = sinon.stub(console, "warn");
      const info = { ...SERVICE_INFO, registration_rules: former };

      expect(values(await formWithInfo(info))).to.deep.equal(DEFAULTS);
      expect(warn.called).to.equal(false);
    });
  });

  it("drops the rules if the next provider's service info fails", async () => {
    const warn = sinon.stub(console, "warn");
    const withRules = stubProvider([TYPE_A]);
    withRules.getServiceInfo.resolves({
      ...SERVICE_INFO,
      registrationRules: RULES,
    });
    const failing = stubProvider([TYPE_A]);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${withRules}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await waitUntil(() => withRules.getServiceInfo.callCount === 1);
    await settle(el);
    expect(values(rulesInternals(el))).to.deep.equal(["prod", "beta"]);

    el.provider = failing;
    await el.updateComplete;
    await waitUntil(() => failing.getServiceInfo.callCount === 1);
    await settle(el);

    expect(values(rulesInternals(el))).to.deep.equal(DEFAULTS);
    expect(
      warn.calledWithMatch("Failed to load the registration rules")
    ).to.equal(true);
  });
});
