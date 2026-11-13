/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServiceVerification from "../service-verification.js";
import type {
  EccServiceVerificationChangedEvent,
  EccServiceVerificationFailedEvent,
} from "../../../events/index.js";
import {
  CloudRegistryError,
  CloudRegistryProvider,
  ExternalService,
  RestCloudRegistryProvider,
} from "../../../providers/index.js";

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

type El = ECCClientElixirCloudRegistryServiceVerification;

const part = (el: El, name: string) =>
  el.shadowRoot?.querySelector(`[part="${name}"]`) as HTMLElement | null;

/** Clicks the native button inside a design button, as a user would. */
const click = (button: HTMLElement | null) => {
  const inner = button?.shadowRoot?.querySelector("button");
  if (!inner) throw new Error("No button to click.");
  inner.click();
};

/** Waits until the component has finished loading. */
const settled = async (el: El) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
  await el.updateComplete;
};

const conflict = () =>
  new CloudRegistryError("The service has another URL.", 409, {
    status: 409,
    title: "Conflict",
    detail: "The service has another URL.",
    code: "verification-mismatch",
  });

const notFound = () => new CloudRegistryError("Not found", 404, {});

/** A provider with stubbed verification methods. */
const stubProvider = () => {
  const provider = new RestCloudRegistryProvider(BASE_URL);
  return {
    provider,
    get: sinon.stub(provider, "getServiceVerification"),
    verify: sinon.stub(provider, "verifyService"),
    remove: sinon.stub(provider, "deleteServiceVerification"),
  };
};

describe("ecc-client-elixir-cloud-registry-service-verification", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("shows a badge for a verified service, without actions", async () => {
    const { provider, get } = stubProvider();
    get.resolves(VERIFICATION);

    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        service-id="service-1"
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    expect(get.calledOnceWithExactly("service-1")).to.equal(true);
    const badge = part(el, "badge");
    expect(badge?.textContent?.trim()).to.equal("Verified");
    expect(badge?.getAttribute("title")).to.match(/^Verified on .*2026/);
    expect(part(el, "verify-button")).to.equal(null);
    expect(part(el, "remove-button")).to.equal(null);
  });

  it("loads with a base URL", async () => {
    const fetchStub = sinon.stub(window, "fetch").resolves(
      new Response(JSON.stringify(VERIFICATION), {
        headers: { "Content-Type": "application/json" },
      })
    );

    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        service-id="a/b"
        .baseUrl=${BASE_URL}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await waitUntil(() => part(el, "badge"));

    expect(fetchStub.firstCall.args[0]).to.equal(
      `${BASE_URL}/services/a%2Fb/verification`
    );
  });

  it("shows nothing for an unverified service, without an error", async () => {
    const { provider, get } = stubProvider();
    get.rejects(notFound());
    const failed = sinon.spy();

    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        service-id="service-1"
        .provider=${provider}
        @ecc-service-verification-failed=${failed}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    expect(part(el, "badge")).to.equal(null);
    expect(failed.called).to.equal(false);
  });

  it("uses a verification that the app loaded, without a request", async () => {
    const { provider, get } = stubProvider();

    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        .service=${SERVICE}
        .verification=${VERIFICATION}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    expect(get.called).to.equal(false);
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Verified");

    el.verification = null;
    await settled(el);

    expect(get.called).to.equal(false);
    expect(part(el, "badge")).to.equal(null);
  });

  it("doesn't count a verification of another URL", async () => {
    const { provider, get } = stubProvider();
    get.resolves(VERIFICATION);

    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        .service=${{ ...SERVICE, url: "https://tes.example.org/v2" }}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    expect(get.calledOnceWithExactly("service-1")).to.equal(true);
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Not verified");
    expect(part(el, "verify-button")).to.not.equal(null);
  });

  it("needs no new request for a new object of the same service", async () => {
    const { provider, get } = stubProvider();
    get.resolves(VERIFICATION);
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        .service=${SERVICE}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    el.service = { ...SERVICE, url: "https://tes.example.org/v2" };
    await settled(el);

    expect(get.calledOnce).to.equal(true);
    expect(part(el, "badge")).to.equal(null);
  });

  it("lets admins verify a service with its URL and API type", async () => {
    const { provider, get, verify } = stubProvider();
    get.rejects(notFound());
    verify.resolves(VERIFICATION);
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        .service=${{ ...SERVICE, description: "Not sent" }}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Not verified");

    const changed = oneEvent(el, "ecc-service-verification-changed");
    click(part(el, "verify-button"));
    const { detail } = (await changed) as EccServiceVerificationChangedEvent;
    await el.updateComplete;

    expect(
      verify.calledOnceWithExactly("service-1", {
        url: SERVICE.url,
        type: SERVICE.type,
      })
    ).to.equal(true);
    expect(detail).to.deep.equal({
      serviceId: "service-1",
      verification: VERIFICATION,
    });
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Verified");
    expect(part(el, "remove-button")).to.not.equal(null);
  });

  it("verifies a service as registered without `service`", async () => {
    const { provider, get, verify } = stubProvider();
    get.rejects(notFound());
    verify.resolves(VERIFICATION);
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        service-id="service-1"
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    const changed = oneEvent(el, "ecc-service-verification-changed");
    click(part(el, "verify-button"));
    await changed;

    expect(verify.calledOnceWithExactly("service-1", undefined)).to.equal(true);
  });

  it("reports a mismatch and loads the verification again", async () => {
    const { provider, get, verify } = stubProvider();
    get.rejects(notFound());
    verify.rejects(conflict());
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        .service=${SERVICE}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    const failed = oneEvent(el, "ecc-service-verification-failed");
    click(part(el, "verify-button"));
    const { detail } = (await failed) as EccServiceVerificationFailedEvent;
    await settled(el);

    expect(detail.serviceId).to.equal("service-1");
    expect(detail.action).to.equal("verify");
    expect(detail.error).to.equal("The service has another URL.");
    expect(detail.status).to.equal(409);
    expect(detail.title).to.equal("Conflict");
    expect(detail.code).to.equal("verification-mismatch");
    expect(detail.cause).to.be.instanceOf(CloudRegistryError);
    expect(get.calledTwice).to.equal(true);
  });

  it("lets admins remove a verification", async () => {
    const { provider, get, remove } = stubProvider();
    get.resolves(VERIFICATION);
    remove.resolves("service-1");
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        .service=${SERVICE}
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    const changed = oneEvent(el, "ecc-service-verification-changed");
    click(part(el, "remove-button"));
    const { detail } = (await changed) as EccServiceVerificationChangedEvent;
    await el.updateComplete;

    expect(remove.calledOnceWithExactly("service-1")).to.equal(true);
    expect(detail).to.deep.equal({
      serviceId: "service-1",
      verification: null,
    });
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Not verified");
    expect(part(el, "verify-button")).to.not.equal(null);
  });

  it("counts a verification that is gone already as removed", async () => {
    const { provider, get, remove } = stubProvider();
    get.resolves(VERIFICATION);
    remove.rejects(notFound());
    const failed = sinon.spy();
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        service-id="service-1"
        .provider=${provider}
        @ecc-service-verification-failed=${failed}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    const changed = oneEvent(el, "ecc-service-verification-changed");
    click(part(el, "remove-button"));
    const { detail } = (await changed) as EccServiceVerificationChangedEvent;

    expect(detail.verification).to.equal(null);
    expect(failed.called).to.equal(false);
  });

  it("reports a failed removal and keeps the verification", async () => {
    const { provider, get, remove } = stubProvider();
    get.resolves(VERIFICATION);
    remove.rejects(new CloudRegistryError("Admins only.", 403, {}));
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        admin
        service-id="service-1"
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);

    const failed = oneEvent(el, "ecc-service-verification-failed");
    click(part(el, "remove-button"));
    const { detail } = (await failed) as EccServiceVerificationFailedEvent;
    await el.updateComplete;

    expect(detail.action).to.equal("remove");
    expect(detail.status).to.equal(403);
    expect(detail.error).to.equal("Admins only.");
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Verified");
  });

  it("reports a failed load", async () => {
    const { provider, get } = stubProvider();
    get.rejects(new CloudRegistryError("Server error", 500, {}));
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-service-verification"
    );
    el.serviceId = "service-1";
    el.provider = provider;

    const failed = oneEvent(el, "ecc-service-verification-failed");
    document.body.appendChild(el);
    try {
      const { detail } = (await failed) as EccServiceVerificationFailedEvent;

      expect(detail.action).to.equal("load");
      expect(detail.status).to.equal(500);
      expect(detail.error).to.equal("Server error");
      expect(part(el, "badge")).to.equal(null);
    } finally {
      el.remove();
    }
  });

  it("reports providers without verifications", async () => {
    const provider = {
      getServiceInfo: sinon.stub(),
    } as unknown as CloudRegistryProvider;
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-service-verification"
    );
    el.serviceId = "service-1";
    el.provider = provider;

    const failed = oneEvent(el, "ecc-service-verification-failed");
    document.body.appendChild(el);
    try {
      const { detail } = (await failed) as EccServiceVerificationFailedEvent;

      expect(detail.error).to.equal(
        "The provider doesn't support verifications."
      );
    } finally {
      el.remove();
    }
  });

  it("loads once a provider is set after the first update", async () => {
    const { provider, get } = stubProvider();
    get.resolves(VERIFICATION);
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        service-id="service-1"
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);
    await settled(el);
    expect(part(el, "badge")).to.equal(null);

    el.provider = provider;
    await settled(el);

    expect(get.calledOnceWithExactly("service-1")).to.equal(true);
    expect(part(el, "badge")?.textContent?.trim()).to.equal("Verified");
  });

  it("ignores the answer for a previous service", async () => {
    const { provider, get } = stubProvider();
    let answerFirst = (value: typeof VERIFICATION): void => {
      throw new Error(`No request waits for ${value.url}`);
    };
    get.onFirstCall().returns(
      new Promise((resolve) => {
        answerFirst = resolve;
      })
    );
    get.onSecondCall().rejects(notFound());
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification
        service-id="service-1"
        .provider=${provider}
      ></ecc-client-elixir-cloud-registry-service-verification>
    `);

    el.serviceId = "service-2";
    await settled(el);
    answerFirst(VERIFICATION);
    await settled(el);

    expect(get.secondCall.args[0]).to.equal("service-2");
    expect(part(el, "badge")).to.equal(null);
  });
});
