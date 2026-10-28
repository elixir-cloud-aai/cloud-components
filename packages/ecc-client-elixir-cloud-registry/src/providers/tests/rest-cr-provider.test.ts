/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import {
  CloudRegistryError,
  ExternalServiceRegister,
  RestCloudRegistryProvider,
} from "../index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

const SERVICE: ExternalServiceRegister = {
  name: "My TES",
  url: "https://tes.example.org/ga4gh/tes/v1",
  organization: { name: "Example", url: "https://example.org" },
  type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
  version: "1.0.0",
};

/** Every provider method, so that none can skip the error handling. */
const METHODS: [string, (provider: RestCloudRegistryProvider) => unknown][] = [
  ["getServices", (p) => p.getServices()],
  ["getServiceById", (p) => p.getServiceById("service-1")],
  ["getServiceTypes", (p) => p.getServiceTypes()],
  ["getServiceInfo", (p) => p.getServiceInfo()],
  ["createService", (p) => p.createService(SERVICE)],
  ["createServiceWithId", (p) => p.createServiceWithId("service-1", SERVICE)],
  ["updateService", (p) => p.updateService("service-1", SERVICE)],
  ["deleteService", (p) => p.deleteService("service-1")],
  [
    "createOrUpdateServiceInfo",
    (p) => p.createOrUpdateServiceInfo({ ...SERVICE, id: "registry" }),
  ],
];

/** The error that a call rejects with. */
const rejection = async (call: () => unknown): Promise<unknown> => {
  try {
    await call();
  } catch (err) {
    return err;
  }
  throw new Error("The call did not fail.");
};

describe("RestCloudRegistryProvider errors", () => {
  let fetchStub: sinon.SinonStub;
  const provider = new RestCloudRegistryProvider(BASE_URL);

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch");
  });

  afterEach(() => {
    sinon.restore();
  });

  METHODS.forEach(([name, call]) => {
    it(`${name} throws the problem details`, async () => {
      fetchStub.callsFake(
        async () =>
          new Response(
            JSON.stringify({
              type: "about:blank",
              title: "Conflict",
              status: 409,
              detail: "A service with this URL exists.",
              serviceId: "service-2",
            }),
            {
              status: 409,
              headers: { "Content-Type": "application/problem+json" },
            }
          )
      );

      const err = await rejection(() => call(provider));

      expect(err).to.be.instanceOf(CloudRegistryError);
      expect(err).to.be.instanceOf(Error);
      const error = err as CloudRegistryError;
      expect(error.name).to.equal("CloudRegistryError");
      expect(error.message).to.equal("A service with this URL exists.");
      expect(error.status).to.equal(409);
      expect(error.title).to.equal("Conflict");
      expect(error.detail).to.equal("A service with this URL exists.");
      expect(error.serviceId).to.equal("service-2");
      expect(error.problem?.type).to.equal("about:blank");
    });
  });

  it("tells 401 from 403", async () => {
    fetchStub
      .onFirstCall()
      .callsFake(async () => new Response(null, { status: 401 }));
    fetchStub
      .onSecondCall()
      .callsFake(async () => new Response(null, { status: 403 }));

    const unauthorized = await rejection(() => provider.getServices());
    const forbidden = await rejection(() => provider.deleteService("s"));

    expect((unauthorized as CloudRegistryError).status).to.equal(401);
    expect((forbidden as CloudRegistryError).status).to.equal(403);
  });

  it("uses `message` if there is no `detail`", async () => {
    fetchStub.callsFake(
      async () =>
        new Response(JSON.stringify({ message: "Bad input", code: 400 }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
    );

    const err = (await rejection(() =>
      provider.createService(SERVICE)
    )) as CloudRegistryError;

    expect(err.message).to.equal("Bad input");
    expect(err.detail).to.equal(undefined);
  });

  it("names the status if the body has no JSON", async () => {
    fetchStub.callsFake(
      async () =>
        new Response("<html>Bad gateway</html>", {
          status: 502,
          headers: { "Content-Type": "text/html" },
        })
    );

    const err = (await rejection(() =>
      provider.createService(SERVICE)
    )) as CloudRegistryError;

    expect(err.message).to.equal("Failed to create service (502)");
    expect(err.status).to.equal(502);
    expect(err.title).to.equal(undefined);
    expect(err.problem).to.equal(undefined);
  });

  it("ignores fields of the wrong type", async () => {
    fetchStub.callsFake(
      async () =>
        new Response(JSON.stringify({ detail: 42, title: {}, serviceId: [] }), {
          status: 400,
        })
    );

    const err = (await rejection(() =>
      provider.getServices()
    )) as CloudRegistryError;

    expect(err.message).to.equal("Failed to fetch services (400)");
    expect(err.detail).to.equal(undefined);
    expect(err.title).to.equal(undefined);
    expect(err.serviceId).to.equal(undefined);
  });
});
