/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServiceCreate from "../service-create.js";
import type { EccServiceCreateFailedEvent } from "../../../events/index.js";
import { RestCloudRegistryProvider } from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

type Internals = {
  typeChoice: string;
  formData: Record<string, unknown>;
  handleSubmit(): Promise<void>;
};

/**
 * Fills in the required fields of the component's private form state, so
 * that a submit reaches the provider; the type as a new one ("Add new
 * service type"), whichever types are listed.
 */
const fillForm = (el: ECCClientElixirCloudRegistryServiceCreate) => {
  const state = el as unknown as Internals;
  state.typeChoice = "new";
  state.formData = {
    ...state.formData,
    name: "My TES",
    url: "https://tes.example.org/ga4gh/tes/v1",
    organization: { name: "Example", url: "https://example.org" },
    type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
    version: "1.0.0",
  };
};

const problem = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify({ status, ...body }), {
    status,
    headers: { "Content-Type": "application/problem+json" },
  });

describe("ecc-client-elixir-cloud-registry-service-create errors", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("reports the status and problem details of a failed registration", async () => {
    fetchStub.callsFake(async (input: RequestInfo | URL) =>
      String(input).endsWith("/services/types")
        ? new Response("[]", {
            headers: { "Content-Type": "application/json" },
          })
        : problem(409, {
            title: "Conflict",
            detail: "A service with this URL exists.",
            serviceId: "service-2",
          })
    );
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${new RestCloudRegistryProvider(BASE_URL)}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    fillForm(el);

    const failed = oneEvent(el, "ecc-service-create-failed");
    (el as unknown as Internals).handleSubmit();
    const { detail } = (await failed) as EccServiceCreateFailedEvent;

    expect(detail.error).to.equal("A service with this URL exists.");
    expect(detail.status).to.equal(409);
    expect(detail.title).to.equal("Conflict");
    expect(detail.detail).to.equal("A service with this URL exists.");
    expect(detail.serviceId).to.equal("service-2");
    expect(detail.cause).to.be.instanceOf(Error);
  });

  it("reports the status if the service types can't be loaded", async () => {
    fetchStub.callsFake(async () =>
      problem(401, { title: "Unauthorized", detail: "Log in." })
    );
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-service-create"
    );
    el.provider = new RestCloudRegistryProvider(BASE_URL);

    const failed = oneEvent(el, "ecc-service-create-failed");
    document.body.appendChild(el);
    try {
      const { detail } = (await failed) as EccServiceCreateFailedEvent;

      expect(detail.error).to.equal("Failed to load service types: Log in.");
      expect(detail.status).to.equal(401);
      expect(detail.detail).to.equal("Log in.");
    } finally {
      el.remove();
    }
  });

  it("reports errors of custom providers by their fields", async () => {
    const err = Object.assign(new Error("No role on this service."), {
      status: 403,
      detail: "No role on this service.",
    });
    const provider = new RestCloudRegistryProvider(BASE_URL);
    sinon.stub(provider, "getServiceTypes").resolves([]);
    sinon.stub(provider, "createService").rejects(err);
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    fillForm(el);

    const failed = oneEvent(el, "ecc-service-create-failed");
    (el as unknown as Internals).handleSubmit();
    const { detail } = (await failed) as EccServiceCreateFailedEvent;

    expect(detail.error).to.equal("No role on this service.");
    expect(detail.status).to.equal(403);
    expect(detail.title).to.equal(undefined);
    expect(detail.serviceId).to.equal(undefined);
    expect(detail.cause).to.equal(err);
  });

  /** The detail of the failed event for a provider that rejects with `err`. */
  const detailFor = async (
    err: unknown
  ): Promise<EccServiceCreateFailedEvent["detail"]> => {
    const provider = new RestCloudRegistryProvider(BASE_URL);
    sinon.stub(provider, "getServiceTypes").resolves([]);
    sinon.stub(provider, "createService").callsFake(() => Promise.reject(err)); // as thrown, not wrapped
    const el = await fixture<ECCClientElixirCloudRegistryServiceCreate>(
      html`<ecc-client-elixir-cloud-registry-service-create
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-create>`
    );
    fillForm(el);
    const failed = oneEvent(el, "ecc-service-create-failed");
    (el as unknown as Internals).handleSubmit();
    return ((await failed) as EccServiceCreateFailedEvent).detail;
  };

  it("reports the detail of a plain object", async () => {
    const detail = await detailFor({ status: 403, detail: "No role." });

    expect(detail.error).to.equal("No role.");
    expect(detail.status).to.equal(403);
  });

  it("reports a thrown string", async () => {
    const detail = await detailFor("Registry down");

    expect(detail.error).to.equal("Registry down");
    expect(detail.status).to.equal(undefined);
    expect(detail.cause).to.equal("Registry down");
  });

  it("ignores a status that isn't a number", async () => {
    const detail = await detailFor({ status: "403" });

    expect(detail.error).to.equal("Failed to create service");
    expect(detail.status).to.equal(undefined);
  });
});
