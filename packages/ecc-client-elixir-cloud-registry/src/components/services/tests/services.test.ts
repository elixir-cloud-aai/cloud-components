/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import { html as litHtml } from "lit";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServices from "../services.js";
import type ECCClientElixirCloudRegistryServiceVerification from "../../service-verification/service-verification.js";
import type { EccServiceVerificationFailedEvent } from "../../../events/index.js";
import {
  CloudRegistryProvider,
  ExternalService,
  RestCloudRegistryProvider,
  ServiceVerification,
} from "../../../providers/index.js";

const BASE_URL = "https://registry.example.org/ga4gh/registry/v1";

const TES = { group: "org.ga4gh", artifact: "tes", version: "1.1.0" };

/** A service with the given ID. */
const service = (id: string): ExternalService => ({
  id,
  name: `Service ${id}`,
  url: `https://${id}.example.org/ga4gh/tes/v1`,
  type: TES,
  organization: { name: "Example", url: "https://example.org" },
  version: "1.0.0",
});

const SERVICES = [service("s1"), service("s2"), service("s3")];

/** A verification of a service as it is registered. */
const verificationOf = (svc: ExternalService): ServiceVerification => ({
  serviceId: svc.id,
  url: svc.url,
  type: svc.type,
  verifiedAt: "2026-10-20T12:34:56.789Z",
});

/** A provider with stubbed list and verification methods. */
const stubProvider = (
  verifications: ServiceVerification[] = [verificationOf(SERVICES[0])]
) => {
  const provider = new RestCloudRegistryProvider(BASE_URL);
  return {
    provider: provider as CloudRegistryProvider,
    services: sinon.stub(provider, "getServices").resolves(SERVICES),
    types: sinon.stub(provider, "getServiceTypes").resolves([TES]),
    verifications: sinon
      .stub(provider, "getVerifications")
      .resolves(verifications),
    get: sinon.stub(provider, "getServiceVerification").rejects(),
    verify: sinon.stub(provider, "verifyService"),
  };
};

type El = ECCClientElixirCloudRegistryServices;
type Badge = ECCClientElixirCloudRegistryServiceVerification;

/** The services list inside the component. */
const list = (el: El) =>
  el.shadowRoot?.querySelector(
    "ecc-client-ga4gh-service-registry-services"
  ) as HTMLElement & { provider?: unknown; filter: boolean; pageSize: number };

/** The row of a service in the list. */
const row = (el: El, id: string) =>
  list(el)?.shadowRoot?.querySelector(
    `ecc-utils-design-table-row[data-service-id="${id}"]`
  ) as HTMLElement | null;

/** The verification component in the row of a service. */
const badge = (el: El, id: string) =>
  row(el, id)?.querySelector(
    "ecc-client-elixir-cloud-registry-service-verification"
  ) as Badge | null;

/** Whether the row of a service shows the "Verified" badge. */
const shownVerified = (el: El, id: string) => {
  const part = badge(el, id)?.shadowRoot?.querySelector('[part="badge"]');
  return !!part && part.textContent?.includes("Verified") === true;
};

/** Renders the component and waits until the verifications are shown. */
const renderLoaded = async (provider: CloudRegistryProvider): Promise<El> => {
  const el = await fixture<El>(
    html`<ecc-client-elixir-cloud-registry-services
      .provider=${provider}
    ></ecc-client-elixir-cloud-registry-services>`
  );
  await waitUntil(() => !!badge(el, "s3"), "verifications not shown");
  await badge(el, "s1")?.updateComplete;
  return el;
};

describe("ecc-client-elixir-cloud-registry-services", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("shows the verified badge with one request for all services", async () => {
    const stubs = stubProvider();
    const el = await renderLoaded(stubs.provider);

    expect(shownVerified(el, "s1")).to.equal(true);
    expect(shownVerified(el, "s2")).to.equal(false);
    expect(badge(el, "s2")?.verification).to.equal(null);
    expect(stubs.verifications.callCount).to.equal(1);
    expect(stubs.get.callCount).to.equal(0);
  });

  it("doesn't count a verification of another URL", async () => {
    const stale = { ...verificationOf(SERVICES[1]), url: "https://old.org" };
    const el = await renderLoaded(stubProvider([stale]).provider);

    expect(badge(el, "s2")?.verification).to.equal(null);
  });

  it("passes its provider and list properties to the list", async () => {
    const stubs = stubProvider();
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services
        .provider=${stubs.provider}
        .filter=${false}
        page-size="2"
      ></ecc-client-elixir-cloud-registry-services>`
    );

    expect(list(el).provider).to.equal(stubs.provider);
    expect(list(el).filter).to.equal(false);
    expect(list(el).pageSize).to.equal(2);
  });

  it("creates a provider for baseUrl", async () => {
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services
        baseUrl=${BASE_URL}
      ></ecc-client-elixir-cloud-registry-services>`
    );

    const provider = list(el).provider as RestCloudRegistryProvider;
    expect(provider).to.be.instanceOf(RestCloudRegistryProvider);
    expect(provider.baseUrl).to.equal(BASE_URL);
  });

  it("passes admin to the badges", async () => {
    const stubs = stubProvider();
    const el = await renderLoaded(stubs.provider);
    el.admin = true;
    await el.updateComplete;
    await list(el).updateComplete;

    expect(badge(el, "s2")?.admin).to.equal(true);
  });

  it("follows a verification by an admin", async () => {
    const stubs = stubProvider([]);
    const fresh = verificationOf(SERVICES[1]);
    stubs.verify.resolves(fresh);
    const el = await renderLoaded(stubs.provider);
    el.admin = true;
    await el.updateComplete;

    badge(el, "s2")?.dispatchEvent(
      new CustomEvent("ecc-service-verification-changed", {
        detail: { serviceId: "s2", verification: fresh },
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;
    await list(el).updateComplete;

    expect(badge(el, "s2")?.verification).to.deep.include({
      url: fresh.url,
      verifiedAt: fresh.verifiedAt,
    });
  });

  it("follows a removed verification", async () => {
    const el = await renderLoaded(stubProvider().provider);

    badge(el, "s1")?.dispatchEvent(
      new CustomEvent("ecc-service-verification-changed", {
        detail: { serviceId: "s1", verification: null },
        bubbles: true,
        composed: true,
      })
    );
    await el.updateComplete;
    await list(el).updateComplete;

    expect(badge(el, "s1")?.verification).to.equal(null);
  });

  it("renders the app's row actions after the badge", async () => {
    const stubs = stubProvider();
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services
        .provider=${stubs.provider}
        .rowActions=${(svc: ExternalService) =>
          litHtml`<button data-edit=${svc.id}>Edit</button>`}
      ></ecc-client-elixir-cloud-registry-services>`
    );
    await waitUntil(() => !!badge(el, "s1"), "verifications not shown");

    const edit = row(el, "s1")?.querySelector('[data-edit="s1"]');
    expect(edit).to.not.equal(null);
    expect(row(el, "s1")?.querySelector("[data-view-details]")).to.equal(null);
    // the badge comes first
    const cells = Array.from(edit?.parentElement?.children ?? []);
    expect(cells.indexOf(badge(el, "s1") as Element)).to.equal(0);
    expect(cells.indexOf(edit as Element)).to.equal(1);
  });

  it("keeps the View Details button without row actions", async () => {
    const el = await renderLoaded(stubProvider().provider);
    const button = row(el, "s2")?.querySelector(
      "[data-view-details]"
    ) as HTMLElement;
    const selected = oneEvent(el, "ecc-service-selected");

    button.click();

    expect((await selected).detail).to.deep.equal({ serviceId: "s2" });
  });

  it("shows no badges and fires an event if loading fails", async () => {
    const stubs = stubProvider();
    stubs.verifications.rejects(new Error("Forbidden"));
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-services"
    );
    const failed = oneEvent(
      el,
      "ecc-service-verification-failed"
    ) as Promise<EccServiceVerificationFailedEvent>;
    el.provider = stubs.provider;
    document.body.append(el);

    const { detail } = await failed;
    expect(detail).to.include({ serviceId: "", action: "load" });
    expect(detail.error).to.equal("Forbidden");
    await waitUntil(() => !!row(el, "s1"), "services not listed");
    expect(badge(el, "s1")).to.equal(null);
    expect(stubs.get.callCount).to.equal(0);
    el.remove();
  });

  it("renders row actions that the app sets later", async () => {
    const el = await renderLoaded(stubProvider().provider);
    el.rowActions = (svc: ExternalService) =>
      litHtml`<button data-edit=${svc.id}>Edit</button>`;
    await el.updateComplete;
    await list(el).updateComplete;

    expect(row(el, "s2")?.querySelector('[data-edit="s2"]')).to.not.equal(null);
  });

  it("explains a failure without a message", async () => {
    const stubs = stubProvider();
    stubs.verifications.callsFake(() => Promise.reject(new Error("")));
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-services"
    );
    const failed = oneEvent(
      el,
      "ecc-service-verification-failed"
    ) as Promise<EccServiceVerificationFailedEvent>;
    el.provider = stubs.provider;
    document.body.append(el);

    expect((await failed).detail.error).to.equal(
      "Failed to load the verifications."
    );
    el.remove();
  });

  it("fires an event for a provider without verifications", async () => {
    const stubs = stubProvider();
    const provider = {
      ...stubs.provider,
      getServices: stubs.services,
      getServiceTypes: stubs.types,
      getVerifications: undefined,
    } as unknown as CloudRegistryProvider;
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-services"
    );
    const failed = oneEvent(el, "ecc-service-verification-failed");
    el.provider = provider;
    document.body.append(el);

    expect((await failed).detail).to.include({ action: "load" });
    el.remove();
  });

  it("ignores verifications of a replaced provider", async () => {
    const slow = stubProvider();
    let answer: ((value: ServiceVerification[]) => void) | undefined;
    slow.verifications.returns(
      new Promise((resolve) => {
        answer = resolve;
      })
    );
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services
        .provider=${slow.provider}
      ></ecc-client-elixir-cloud-registry-services>`
    );
    const next = stubProvider([]);
    el.provider = next.provider;
    await waitUntil(() => !!badge(el, "s1"), "verifications not shown");
    answer?.([verificationOf(SERVICES[0])]);
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    await el.updateComplete;
    await list(el).updateComplete;

    expect(list(el).provider).to.equal(next.provider);
    expect(badge(el, "s1")?.verification).to.equal(null);
  });

  it("shows an error without provider or base URL", async () => {
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services></ecc-client-elixir-cloud-registry-services>`
    );
    await list(el).updateComplete;

    expect(list(el).shadowRoot?.textContent).to.include(
      "Please provide either a base URL"
    );
  });

  it("ignores services of a replaced list", async () => {
    const el = await renderLoaded(stubProvider().provider);
    const old = list(el);
    el.provider = stubProvider([]).provider;
    await el.updateComplete;
    await waitUntil(() => !!badge(el, "s1"), "verifications not shown");

    old.dispatchEvent(
      new CustomEvent("ecc-services-changed", {
        detail: { services: [service("other")] },
      })
    );
    await el.updateComplete;

    expect(list(el)).to.not.equal(old);
    const internals = el as unknown as { services: ExternalService[] };
    expect(internals.services.map((svc) => svc.id)).to.deep.equal([
      "s1",
      "s2",
      "s3",
    ]);
  });

  it("ignores verification changes of a replaced list", async () => {
    const el = await renderLoaded(stubProvider().provider);
    const old = badge(el, "s1");
    el.provider = stubProvider([]).provider;
    await el.updateComplete;
    await waitUntil(() => !!badge(el, "s1"), "verifications not shown");

    old?.dispatchEvent(
      new CustomEvent("ecc-service-verification-changed", {
        detail: { serviceId: "s2", verification: verificationOf(SERVICES[1]) },
      })
    );
    await el.updateComplete;
    await list(el).updateComplete;

    expect(badge(el, "s2")?.verification).to.equal(null);
  });

  it("follows a change of a row that is no longer shown", async () => {
    const el = await renderLoaded(stubProvider([]).provider);
    const offPage = badge(el, "s3");
    el.pageSize = 1;
    await el.updateComplete;
    await list(el).updateComplete;
    expect(row(el, "s3")).to.equal(null);

    offPage?.dispatchEvent(
      new CustomEvent("ecc-service-verification-changed", {
        detail: { serviceId: "s3", verification: verificationOf(SERVICES[2]) },
      })
    );
    el.pageSize = 10;
    await el.updateComplete;
    await list(el).updateComplete;

    expect(badge(el, "s3")?.verification).to.not.equal(null);
  });

  it("loads the verifications again after a failed verify", async () => {
    const stubs = stubProvider();
    const el = await renderLoaded(stubs.provider);

    badge(el, "s2")?.dispatchEvent(
      new CustomEvent("ecc-service-verification-failed", {
        detail: { serviceId: "s2", action: "verify", error: "Lost" },
      })
    );
    badge(el, "s2")?.dispatchEvent(
      new CustomEvent("ecc-service-verification-failed", {
        detail: { serviceId: "s2", action: "load", error: "Lost" },
      })
    );

    expect(stubs.verifications.callCount).to.equal(2);
  });

  it("uses the default page size for an empty attribute", async () => {
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services
        page-size=""
      ></ecc-client-elixir-cloud-registry-services>`
    );

    expect(el.pageSize).to.equal(10);
  });

  it("creates a new provider when baseUrl changes", async () => {
    const el = await fixture<El>(
      html`<ecc-client-elixir-cloud-registry-services
        baseUrl=${BASE_URL}
      ></ecc-client-elixir-cloud-registry-services>`
    );
    const first = list(el).provider;
    el.baseUrl = `${BASE_URL}/other`;
    await el.updateComplete;

    const provider = list(el).provider as RestCloudRegistryProvider;
    expect(provider).to.not.equal(first);
    expect(provider.baseUrl).to.equal(`${BASE_URL}/other`);
    el.baseUrl = "";
    await el.updateComplete;
    expect(list(el).provider).to.equal(undefined);
  });

  it("passes the status of a failed load on", async () => {
    const stubs = stubProvider();
    const error = Object.assign(new Error("Forbidden"), { status: 403 });
    stubs.verifications.rejects(error);
    const el = document.createElement(
      "ecc-client-elixir-cloud-registry-services"
    );
    const failed = oneEvent(
      el,
      "ecc-service-verification-failed"
    ) as Promise<EccServiceVerificationFailedEvent>;
    el.provider = stubs.provider;
    document.body.append(el);

    const { detail } = await failed;
    expect(detail.status).to.equal(403);
    expect(detail.cause).to.equal(error);
    el.remove();
  });
});
