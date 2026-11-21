/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type ECCClientElixirCloudRegistryServiceVerificationBadge from "../service-verification-badge.js";

const VERIFICATION = {
  url: "https://tes.example.org/ga4gh/tes/v1",
  type: { group: "org.ga4gh", artifact: "tes", version: "1.1.0" },
  verifiedAt: "2026-10-20T12:34:56.789Z",
};

type El = ECCClientElixirCloudRegistryServiceVerificationBadge;

const badge = (el: El) =>
  el.shadowRoot?.querySelector('[part="badge"]') as HTMLElement | null;

describe("ecc-client-elixir-cloud-registry-service-verification-badge", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("shows a badge with the date for a verification", async () => {
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification-badge
        .verification=${VERIFICATION}
      ></ecc-client-elixir-cloud-registry-service-verification-badge>
    `);

    expect(badge(el)?.textContent?.trim()).to.equal("Verified");
    expect(badge(el)?.getAttribute("title")).to.match(/^Verified on .*2026/);
  });

  it("shows the date as sent if it isn't a date", async () => {
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification-badge
        .verification=${{ ...VERIFICATION, verifiedAt: "yesterday" }}
      ></ecc-client-elixir-cloud-registry-service-verification-badge>
    `);

    expect(badge(el)?.getAttribute("title")).to.equal("Verified on yesterday");
  });

  it("says only Verified without a date", async () => {
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification-badge
        .verification=${{ ...VERIFICATION, verifiedAt: "" }}
      ></ecc-client-elixir-cloud-registry-service-verification-badge>
    `);

    expect(badge(el)?.getAttribute("title")).to.equal("Verified");
  });

  it("shows nothing without a verification, and sends no request", async () => {
    const fetchStub = sinon.stub(window, "fetch");
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification-badge></ecc-client-elixir-cloud-registry-service-verification-badge>
    `);
    expect(badge(el)).to.equal(null);

    el.verification = null;
    await el.updateComplete;
    expect(badge(el)).to.equal(null);
    expect(fetchStub.called).to.equal(false);
  });

  it("shows Not verified with `show-unverified`", async () => {
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification-badge
        show-unverified
        .verification=${null}
      ></ecc-client-elixir-cloud-registry-service-verification-badge>
    `);

    expect(el.showUnverified).to.equal(true);
    expect(badge(el)?.textContent?.trim()).to.equal("Not verified");
  });

  it("follows the verification that the app sets", async () => {
    const el = await fixture<El>(html`
      <ecc-client-elixir-cloud-registry-service-verification-badge
        show-unverified
      ></ecc-client-elixir-cloud-registry-service-verification-badge>
    `);
    expect(badge(el)?.textContent?.trim()).to.equal("Not verified");

    el.verification = VERIFICATION;
    await el.updateComplete;
    expect(badge(el)?.textContent?.trim()).to.equal("Verified");

    el.verification = null;
    await el.updateComplete;
    expect(badge(el)?.textContent?.trim()).to.equal("Not verified");
  });
});
