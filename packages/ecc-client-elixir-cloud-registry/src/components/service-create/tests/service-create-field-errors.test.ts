/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServiceCreate from "../service-create.js";
import type { EccServiceCreateFailedEvent } from "../../../events/index.js";
import {
  RestCloudRegistryProvider,
  ServiceType,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

const TYPE: ServiceType = {
  group: "org.ga4gh",
  artifact: "tes",
  version: "1.1.0",
};

/*
 * The tests set the component's private form state, as the other tests of
 * the form do, and read the errors that its controls show.
 */
type Internals = {
  serviceTypes: ServiceType[];
  typeChoice: string;
  formData: Record<string, unknown>;
  handleSubmit(): Promise<void>;
  resetForm(): void;
};

const internals = (el: ECCClientElixirCloudRegistryServiceCreate) =>
  el as unknown as Internals;

/**
 * Fills in the required fields; the type as a new one ("Add new service
 * type") unless `typeChoice` is given.
 */
const fillForm = (
  el: ECCClientElixirCloudRegistryServiceCreate,
  extra: Record<string, unknown> = {},
  typeChoice = "new"
) => {
  const state = internals(el);
  state.typeChoice = typeChoice;
  state.formData = {
    ...state.formData,
    name: "My TES",
    url: "https://tes.example.org/ga4gh/tes/v1",
    organization: { name: "Example", url: "https://example.org" },
    type: { ...TYPE },
    version: "1.0.0",
    ...extra,
  };
};

/** A `400` with field errors, as Cloud Registry 1.0.0rc2 sends it. */
const invalid = (errors: Record<string, unknown>[], detail = "Invalid.") =>
  new Response(
    JSON.stringify({
      type: "https://foca.readthedocs.io/en/latest/problems/invalid-request/",
      title: "Bad Request",
      status: 400,
      detail,
      code: "invalid-request",
      errors,
    }),
    { status: 400, headers: { "Content-Type": "application/problem+json" } }
  );

/** The control of the form with the given ID. */
const control = (el: ECCClientElixirCloudRegistryServiceCreate, id: string) =>
  el.shadowRoot!.querySelector(`#${id}`) as HTMLElement & {
    error: string;
    value: string;
  };

describe("ecc-client-elixir-cloud-registry-service-create field errors", () => {
  let fetchStub: sinon.SinonStub;
  let answer: () => Response;
  let types: ServiceType[];

  beforeEach(() => {
    types = [];
    fetchStub = sinon.stub(window, "fetch");
    fetchStub.callsFake(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/services/types")) {
        return new Response(JSON.stringify(types), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.endsWith("/service-info")) {
        return new Response("{}", {
          headers: { "Content-Type": "application/json" },
        });
      }
      return answer();
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  const create = async () => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${new RestCloudRegistryProvider(BASE_URL)}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    // the types load
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    await el.updateComplete;
    return el;
  };

  /** Submits the form and returns the detail of the failure event. */
  const submit = async (el: ECCClientElixirCloudRegistryServiceCreate) => {
    await el.updateComplete;
    const failed = oneEvent(el, "ecc-service-create-failed");
    internals(el).handleSubmit();
    const { detail } = (await failed) as EccServiceCreateFailedEvent;
    await el.updateComplete;
    return detail;
  };

  it("shows the registry's field errors at the fields", async () => {
    answer = () =>
      invalid([
        { detail: "Must be at most 3 characters long.", pointer: "#/name" },
        { detail: "Must be a valid URI.", pointer: "#/organization/url" },
        { detail: "Must not contain user info.", pointer: "#/url" },
        { detail: "Not allowed.", pointer: "#/environment" },
        { detail: "Must be a URL.", pointer: "#/contactUrl" },
        { detail: "Must be a URL.", pointer: "#/documentationUrl" },
        { detail: "Too long.", pointer: "#/description" },
        { detail: "Too long.", pointer: "#/version" },
        { detail: "Too long.", pointer: "#/organization/name" },
      ]);
    const el = await create();
    fillForm(el);

    const detail = await submit(el);

    expect(control(el, "service-name").error).to.equal(
      "Must be at most 3 characters long."
    );
    expect(control(el, "org-url").error).to.equal("Must be a valid URI.");
    expect(control(el, "service-url").error).to.equal(
      "Must not contain user info."
    );
    expect(control(el, "environment").error).to.equal("Not allowed.");
    expect(control(el, "contact-url").error).to.equal("Must be a URL.");
    expect(control(el, "documentation-url").error).to.equal("Must be a URL.");
    expect(control(el, "description").error).to.equal("Too long.");
    expect(control(el, "service-version").error).to.equal("Too long.");
    expect(control(el, "org-name").error).to.equal("Too long.");
    expect(detail.fieldErrors).to.deep.equal({
      name: "Must be at most 3 characters long.",
      "organization.url": "Must be a valid URI.",
      url: "Must not contain user info.",
      environment: "Not allowed.",
      contactUrl: "Must be a URL.",
      documentationUrl: "Must be a URL.",
      description: "Too long.",
      version: "Too long.",
      "organization.name": "Too long.",
    });
    expect(detail.generalError).to.equal(undefined);
    // unchanged for apps that show `error`
    expect(detail.error).to.equal("Invalid.");
    expect(detail.status).to.equal(400);
  });

  it("gives errors that match no field as the general error", async () => {
    answer = () =>
      invalid([
        { detail: "Must be a valid URI.", pointer: "#/url" },
        { detail: "Is required.", pointer: "#/organization" },
        { detail: "Unknown.", pointer: "#/extra" },
      ]);
    const el = await create();
    fillForm(el);

    const detail = await submit(el);

    expect(control(el, "service-url").error).to.equal("Must be a valid URI.");
    expect(detail.fieldErrors).to.deep.equal({ url: "Must be a valid URI." });
    expect(detail.generalError).to.equal(
      "organization: Is required. extra: Unknown."
    );
  });

  it("keeps the general error for responses without field errors", async () => {
    answer = () =>
      new Response(
        JSON.stringify({
          status: 409,
          detail: "A service with this URL exists.",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/problem+json" },
        }
      );
    const el = await create();
    fillForm(el);

    const detail = await submit(el);

    expect(detail.fieldErrors).to.deep.equal({});
    expect(detail.generalError).to.equal("A service with this URL exists.");
    expect(detail.error).to.equal("A service with this URL exists.");
    expect(control(el, "service-url").error).to.equal("");
  });

  it("keeps the general error for bodies that aren't problem details", async () => {
    answer = () => new Response("<html>Bad gateway</html>", { status: 502 });
    const el = await create();
    fillForm(el);

    const detail = await submit(el);

    expect(detail.fieldErrors).to.deep.equal({});
    expect(detail.generalError).to.equal("Failed to create service (502)");
    expect(detail.error).to.equal("Failed to create service (502)");
  });

  it("shows errors of a new type at its fields", async () => {
    answer = () =>
      invalid([
        { detail: "Too long.", pointer: "#/type/artifact" },
        { detail: "Not registered.", pointer: "#/type" },
      ]);
    const el = await create();
    fillForm(el);

    const detail = await submit(el);

    expect(control(el, "type-artifact").error).to.equal("Too long.");
    expect(control(el, "type-group").error).to.equal("");
    expect(control(el, "service-type").error).to.equal("Not registered.");
    expect(detail.fieldErrors).to.deep.equal({
      "type.artifact": "Too long.",
      type: "Not registered.",
    });
  });

  it("shows errors of a listed type at the type list", async () => {
    types = [TYPE];
    answer = () =>
      invalid([{ detail: "Too long.", pointer: "#/type/version" }]);
    const el = await create();
    await waitUntil(() => internals(el).serviceTypes.length === 1);
    fillForm(el, {}, JSON.stringify([TYPE.group, TYPE.artifact, TYPE.version]));

    const detail = await submit(el);

    expect(control(el, "type-version")).to.equal(null);
    expect(control(el, "service-type").error).to.equal("Too long.");
    expect(detail.fieldErrors).to.deep.equal({ type: "Too long." });
  });

  it("shows errors of the admin fields and opens their section", async () => {
    answer = () =>
      invalid([
        { detail: "Must be an RFC 3339 date-time.", pointer: "#/createdAt" },
        { detail: "Can't be stored.", parameter: "serviceId" },
      ]);
    const el = await create();
    fillForm(el, {
      createdAt: "yesterday",
      customServiceId: "my id",
      useCustomId: true,
    });
    const collapsible = el.shadowRoot!.querySelector(
      "ecc-utils-design-collapsible"
    ) as HTMLElement & { open: boolean };
    expect(collapsible.open).to.equal(false);

    const detail = await submit(el);

    expect(control(el, "created-at").error).to.equal(
      "Must be an RFC 3339 date-time."
    );
    expect(control(el, "custom-service-id").error).to.equal("Can't be stored.");
    expect(detail.fieldErrors).to.deep.equal({
      createdAt: "Must be an RFC 3339 date-time.",
      serviceId: "Can't be stored.",
    });
    expect(collapsible.open).to.equal(true);

    // the trigger announces the section as expanded
    await (collapsible as HTMLElement & { updateComplete: Promise<unknown> })
      .updateComplete;
    const trigger = collapsible.querySelector(
      "ecc-utils-design-collapsible-trigger"
    ) as HTMLElement & { updateComplete: Promise<unknown> };
    await trigger.updateComplete;
    expect(
      trigger
        .shadowRoot!.querySelector('[role="button"]')!
        .getAttribute("aria-expanded")
    ).to.equal("true");
  });

  it("doesn't map errors of fields that the form didn't send", async () => {
    answer = () =>
      invalid([
        { detail: "Must be an RFC 3339 date-time.", pointer: "#/createdAt" },
        { detail: "Can't be stored.", parameter: "serviceId" },
      ]);
    const el = await create();
    el.admin = false;
    fillForm(el);

    const detail = await submit(el);

    expect(detail.fieldErrors).to.deep.equal({});
    expect(detail.generalError).to.equal(
      "createdAt: Must be an RFC 3339 date-time. serviceId: Can't be stored."
    );
  });

  it("clears the error of a field when it is edited", async () => {
    answer = () =>
      invalid([
        { detail: "Too long.", pointer: "#/name" },
        { detail: "Must be a valid URI.", pointer: "#/organization/url" },
        { detail: "Too long.", pointer: "#/type/artifact" },
        { detail: "Not registered.", pointer: "#/type" },
      ]);
    const el = await create();
    fillForm(el);
    await submit(el);

    control(el, "service-name").dispatchEvent(
      new CustomEvent("ecc-input-changed", { detail: { value: "TES" } })
    );
    control(el, "type-artifact").dispatchEvent(
      new CustomEvent("ecc-input-changed", { detail: { value: "wes" } })
    );
    await el.updateComplete;

    expect(control(el, "service-name").error).to.equal("");
    expect(control(el, "type-artifact").error).to.equal("");
    // a change of the type is a change of what `/type` refers to
    expect(control(el, "service-type").error).to.equal("");
    expect(control(el, "org-url").error).to.equal("Must be a valid URI.");
  });

  it("clears the type's error when another type is chosen", async () => {
    const other: ServiceType = { ...TYPE, version: "1.0.0" };
    types = [TYPE, other];
    answer = () =>
      invalid([{ detail: "Not registered.", pointer: "#/type/version" }]);
    const el = await create();
    await waitUntil(() => internals(el).serviceTypes.length === 2);
    fillForm(el, {}, JSON.stringify([TYPE.group, TYPE.artifact, TYPE.version]));
    await submit(el);
    expect(control(el, "service-type").error).to.equal("Not registered.");

    control(el, "service-type").dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: {
          value: JSON.stringify([other.group, other.artifact, other.version]),
        },
      })
    );
    await el.updateComplete;

    expect(control(el, "service-type").error).to.equal("");
  });

  it("clears the field errors on a new submit and on reset", async () => {
    answer = () => invalid([{ detail: "Too long.", pointer: "#/name" }]);
    const el = await create();
    fillForm(el);
    await submit(el);
    expect(control(el, "service-name").error).to.equal("Too long.");

    // a failure without field errors, so that only the submit clears them
    answer = () =>
      new Response(JSON.stringify({ status: 409, detail: "Exists." }), {
        status: 409,
        headers: { "Content-Type": "application/problem+json" },
      });
    await submit(el);
    expect(control(el, "service-name").error).to.equal("");

    answer = () => invalid([{ detail: "Too long.", pointer: "#/name" }]);
    fillForm(el);
    await submit(el);
    expect(control(el, "service-name").error).to.equal("Too long.");
    internals(el).resetForm();
    await el.updateComplete;
    expect(control(el, "service-name").error).to.equal("");
  });

  it("clears the field errors after a successful create", async () => {
    answer = () => invalid([{ detail: "Too long.", pointer: "#/name" }]);
    const el = await create();
    fillForm(el);
    await submit(el);
    expect(control(el, "service-name").error).to.equal("Too long.");

    answer = () =>
      new Response(JSON.stringify("service-1"), {
        headers: { "Content-Type": "application/json" },
      });
    const created = oneEvent(el, "ecc-service-created");
    internals(el).handleSubmit();
    await created;
    await el.updateComplete;
    expect(control(el, "service-name").error).to.equal("");
  });

  /** An error of a custom provider with the given field errors. */
  const invalidError = (errors: Record<string, unknown>[]) =>
    Object.assign(new Error("Invalid."), {
      status: 400,
      problem: { status: 400, errors },
    });

  /** A custom provider whose creates fail with the given field errors. */
  const failingProvider = (errors: Record<string, unknown>[]) => {
    const provider = new RestCloudRegistryProvider(BASE_URL);
    sinon.stub(provider, "getServiceTypes").resolves([]);
    const createService = sinon
      .stub(provider, "createService")
      .rejects(invalidError(errors));
    return { provider, createService };
  };

  /**
   * A custom provider whose create fails with the given field errors when
   * `fail` is called, so that the form can change while it runs.
   */
  const pendingProvider = (errors: Record<string, unknown>[]) => {
    const { provider, createService } = failingProvider(errors);
    let fail: (() => void) | undefined;
    createService.callsFake(
      () =>
        new Promise((_resolve, reject) => {
          fail = () => reject(invalidError(errors));
        })
    );
    return { provider, fail: () => fail?.() };
  };

  const createWith = async (provider: RestCloudRegistryProvider) => {
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    await el.updateComplete;
    return el;
  };

  it("clears the field errors when the provider can't create", async () => {
    const { provider } = failingProvider([
      { detail: "Too long.", pointer: "/name" },
    ]);
    const el = await createWith(provider);
    fillForm(el);
    await submit(el);
    expect(control(el, "service-name").error).to.equal("Too long.");

    (provider as { createService?: unknown }).createService = undefined;
    const detail = await submit(el);

    expect(detail.fieldErrors).to.deep.equal({});
    expect(control(el, "service-name").error).to.equal("");
  });

  it("doesn't show errors of fields edited while the create ran", async () => {
    const { provider, fail } = pendingProvider([
      { detail: "Too long.", pointer: "/name" },
      { detail: "Must be a valid URI.", pointer: "/organization/url" },
      { detail: "Too long.", pointer: "/type/artifact" },
    ]);
    const el = await createWith(provider);
    fillForm(el);
    await el.updateComplete;

    const failed = oneEvent(el, "ecc-service-create-failed");
    internals(el).handleSubmit();
    await el.updateComplete;
    control(el, "service-name").dispatchEvent(
      new CustomEvent("ecc-input-changed", { detail: { value: "TES" } })
    );
    control(el, "type-artifact").dispatchEvent(
      new CustomEvent("ecc-input-changed", { detail: { value: "wes" } })
    );
    fail();
    const { detail } = (await failed) as EccServiceCreateFailedEvent;
    await el.updateComplete;

    // the event reports what the registry said about the request
    expect(detail.fieldErrors).to.deep.equal({
      name: "Too long.",
      "organization.url": "Must be a valid URI.",
      "type.artifact": "Too long.",
    });
    expect(control(el, "service-name").error).to.equal("");
    expect(control(el, "type-artifact").error).to.equal("");
    expect(control(el, "org-url").error).to.equal("Must be a valid URI.");
  });

  it("doesn't show field errors after a reset while the create ran", async () => {
    const { provider, fail } = pendingProvider([
      { detail: "Must be a valid URI.", pointer: "/url" },
    ]);
    const el = await createWith(provider);
    fillForm(el);
    await el.updateComplete;

    const failed = oneEvent(el, "ecc-service-create-failed");
    internals(el).handleSubmit();
    await el.updateComplete;
    internals(el).resetForm();
    fail();
    const { detail } = (await failed) as EccServiceCreateFailedEvent;
    await el.updateComplete;

    expect(detail.fieldErrors).to.deep.equal({ url: "Must be a valid URI." });
    expect(control(el, "service-url").error).to.equal("");
  });

  it("drops the admin fields' errors when admin is turned off", async () => {
    const { provider } = failingProvider([
      { detail: "Must be an RFC 3339 date-time.", pointer: "/createdAt" },
    ]);
    const el = await createWith(provider);
    fillForm(el, { createdAt: "yesterday" });
    await submit(el);
    expect(control(el, "created-at").error).to.equal(
      "Must be an RFC 3339 date-time."
    );

    el.admin = false;
    await el.updateComplete;
    el.admin = true;
    await el.updateComplete;

    expect(control(el, "created-at").error).to.equal("");
  });

  it("drops the environment's error with an environment no longer offered", async () => {
    const { provider } = failingProvider([
      { detail: "Not allowed.", pointer: "/environment" },
    ]);
    const el = await createWith(provider);
    fillForm(el, { environment: "test" });
    await submit(el);
    expect(control(el, "environment").error).to.equal("Not allowed.");

    el.environments = ["prod"];
    await el.updateComplete;

    expect(internals(el).formData.environment).to.equal("");
    expect(control(el, "environment").error).to.equal("");
  });

  it("reads the problem details of errors of custom providers", async () => {
    const provider = new RestCloudRegistryProvider(BASE_URL);
    sinon.stub(provider, "getServiceTypes").resolves([]);
    sinon.stub(provider, "createService").rejects(
      Object.assign(new Error("Invalid."), {
        status: 400,
        problem: {
          status: 400,
          errors: [{ detail: "Too long.", pointer: "/name" }],
        },
      })
    );
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    fillForm(el);

    const detail = await submit(el);

    expect(detail.fieldErrors).to.deep.equal({ name: "Too long." });
    expect(control(el, "service-name").error).to.equal("Too long.");
  });

  it("gives the general error for checks of the form", async () => {
    const el = await create();
    fillForm(el, { name: "" });

    const detail = await submit(el);

    expect(detail.fieldErrors).to.deep.equal({});
    expect(detail.generalError).to.equal("Service name is required");
  });
});
