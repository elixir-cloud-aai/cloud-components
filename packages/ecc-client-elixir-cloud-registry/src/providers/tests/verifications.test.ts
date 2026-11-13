/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "@open-wc/testing";
import sinon from "sinon";
import {
  CloudRegistryError,
  ExternalService,
  RestCloudRegistryProvider,
  ServiceVerification,
  matchesVerification,
  verifiedServices,
} from "../index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

const VERIFICATION = {
  url: "https://tes.example.org/ga4gh/tes/v1",
  type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
  verifiedAt: "2026-10-20T12:34:56.789Z",
};

const SERVICE: ExternalService = {
  id: "service-1",
  name: "My TES",
  url: VERIFICATION.url,
  type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
  organization: { name: "Example", url: "https://example.org" },
  version: "1.0.0",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** The error that a call rejects with. */
const rejection = async (call: () => unknown): Promise<unknown> => {
  try {
    await call();
  } catch (err) {
    return err;
  }
  throw new Error("The call did not fail.");
};

describe("RestCloudRegistryProvider verifications", () => {
  let fetchStub: sinon.SinonStub;
  const provider = new RestCloudRegistryProvider(BASE_URL);

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("lists the verified services", async () => {
    const list = [{ serviceId: "service-1", ...VERIFICATION }];
    fetchStub.resolves(json(list));

    const result = await provider.getVerifications();

    expect(result).to.deep.equal(list);
    expect(fetchStub.firstCall.args[0]).to.equal(`${BASE_URL}/verifications`);
  });

  it("gets the verification of a service by its encoded ID", async () => {
    fetchStub.resolves(json(VERIFICATION));

    const result = await provider.getServiceVerification("a/b c");

    expect(result).to.deep.equal(VERIFICATION);
    expect(fetchStub.firstCall.args[0]).to.equal(
      `${BASE_URL}/services/a%2Fb%20c/verification`
    );
  });

  it("rejects with status 404 for unverified services", async () => {
    fetchStub.resolves(json({ status: 404, title: "Not Found" }, 404));

    const err = await rejection(() =>
      provider.getServiceVerification("service-1")
    );

    expect(err).to.be.instanceOf(CloudRegistryError);
    expect((err as CloudRegistryError).status).to.equal(404);
  });

  it("verifies a service with the checked URL and API type", async () => {
    fetchStub.resolves(json(VERIFICATION));
    const checked = {
      url: VERIFICATION.url,
      type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
    };

    const result = await provider.verifyService("service-1", checked);

    expect(result).to.deep.equal(VERIFICATION);
    const [url, init] = fetchStub.firstCall.args;
    expect(url).to.equal(`${BASE_URL}/services/service-1/verification`);
    expect(init.method).to.equal("PUT");
    expect(init.headers).to.deep.equal({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).to.deep.equal(checked);
  });

  it("verifies a service as registered without a body", async () => {
    fetchStub.resolves(json(VERIFICATION));

    await provider.verifyService("service-1");

    const [, init] = fetchStub.firstCall.args;
    expect(init.method).to.equal("PUT");
    expect(init.body).to.equal(undefined);
    expect(init.headers).to.equal(undefined);
  });

  it("keeps the conflict code of a mismatch", async () => {
    fetchStub.resolves(
      json(
        {
          status: 409,
          title: "Conflict",
          detail: "The service has another URL.",
          code: "verification-mismatch",
        },
        409
      )
    );

    const err = (await rejection(() =>
      provider.verifyService("service-1", {
        url: "https://other.example.org",
        type: SERVICE.type,
      })
    )) as CloudRegistryError;

    expect(err.status).to.equal(409);
    expect(err.code).to.equal("verification-mismatch");
    expect(err.message).to.equal("The service has another URL.");
  });

  it("removes the verification of a service", async () => {
    fetchStub.resolves(json("service-1"));

    const result = await provider.deleteServiceVerification("service-1");

    expect(result).to.equal("service-1");
    const [url, init] = fetchStub.firstCall.args;
    expect(url).to.equal(`${BASE_URL}/services/service-1/verification`);
    expect(init.method).to.equal("DELETE");
  });
});

describe("matchesVerification", () => {
  it("matches the same URL and API type", () => {
    expect(matchesVerification(SERVICE, VERIFICATION)).to.equal(true);
  });

  it("ignores the version of the type", () => {
    const service = {
      ...SERVICE,
      type: { ...SERVICE.type, version: "2.0.0" },
    };
    expect(matchesVerification(service, VERIFICATION)).to.equal(true);
  });

  it("compares group and artifact trimmed and case-insensitive", () => {
    const service = {
      ...SERVICE,
      type: {
        group: " ORG.GA4GH\u00a0\u0085",
        artifact: "\u001cTES",
        version: "1",
      },
    };
    expect(matchesVerification(service, VERIFICATION)).to.equal(true);
  });

  it("folds the case of special characters", () => {
    const service = {
      ...SERVICE,
      type: { group: "straße", artifact: "tes", version: "1" },
    };
    const verification = {
      ...VERIFICATION,
      type: { group: "STRASSE", artifact: "tes", version: "1" },
    };
    expect(matchesVerification(service, verification)).to.equal(true);
  });

  it("doesn't trim a byte order mark, as the registry doesn't", () => {
    const service = {
      ...SERVICE,
      type: { ...SERVICE.type, artifact: "tes\uFEFF" },
    };
    expect(matchesVerification(service, VERIFICATION)).to.equal(false);
  });

  it("compares the URL exactly as written", () => {
    const service = { ...SERVICE, url: `${VERIFICATION.url}/` };
    expect(matchesVerification(service, VERIFICATION)).to.equal(false);
  });

  it("rejects another artifact", () => {
    const service = {
      ...SERVICE,
      type: { ...SERVICE.type, artifact: "wes" },
    };
    expect(matchesVerification(service, VERIFICATION)).to.equal(false);
  });
});

describe("verifiedServices", () => {
  it("keeps the verifications that match their services, by ID", () => {
    const other: ExternalService = {
      ...SERVICE,
      id: "service-2",
      url: "https://wes.example.org",
    };
    const verifications: ServiceVerification[] = [
      { serviceId: "service-1", ...VERIFICATION },
      { serviceId: "service-2", ...VERIFICATION },
      { serviceId: "unknown", ...VERIFICATION },
    ];

    const result = verifiedServices([SERVICE, other], verifications);

    expect([...result.keys()]).to.deep.equal(["service-1"]);
    expect(result.get("service-1")).to.equal(verifications[0]);
  });
});
