/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import type EccUtilsDesignCookieConsent from "../cookie-consent.js";
import {
  CONSENT_CHANGED_EVENT,
  ComplianceConfig,
  CookieConsentConfig,
  DEFAULT_STORAGE_KEY,
  consentSignature,
  cookieCategories,
  hasConsent,
  onConsentChange,
  openCookiePreferences,
  readConsent,
  saveConsent,
} from "../consent.js";

const COOKIES: CookieConsentConfig = {
  version: "1",
  categories: [
    { id: "necessary", label: "Necessary", required: true },
    { id: "analytics", label: "Analytics", description: "Usage statistics" },
  ],
};
const CONFIG: ComplianceConfig = { cookies: COOKIES };

const banner = (el: EccUtilsDesignCookieConsent) =>
  el.shadowRoot?.querySelector("[part=banner]") ?? null;

const dialog = (el: EccUtilsDesignCookieConsent) =>
  el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;

const button = (root: ParentNode, action: string) =>
  root.querySelector(`[data-action=${action}]`) as HTMLElement;

describe("cookie consent store", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds a required category if none is", () => {
    const categories = cookieCategories({
      categories: [{ id: "analytics", label: "Analytics" }],
    });

    expect(categories.map((c) => c.id)).to.deep.equal([
      "necessary",
      "analytics",
    ]);
    expect(categories[0].required).to.equal(true);
  });

  it("has no consent before users chose", () => {
    expect(readConsent(COOKIES)).to.equal(null);
    expect(hasConsent("analytics", COOKIES)).to.equal(false);
    expect(hasConsent("necessary", COOKIES)).to.equal(true);
  });

  it("stores consent and tells listeners", () => {
    const listener = sinon.spy();
    const stop = onConsentChange(listener);

    saveConsent(COOKIES, { analytics: true, unknown: true, necessary: false });
    stop();
    saveConsent(COOKIES, { analytics: false });

    expect(listener.callCount).to.equal(1);
    expect(listener.firstCall.args[0].categories).to.deep.equal({
      necessary: true,
      analytics: true,
    });
    expect(hasConsent("analytics", COOKIES)).to.equal(false);
    expect(hasConsent("unknown", COOKIES)).to.equal(false);
  });

  it("asks again when the categories or the version change", () => {
    saveConsent(COOKIES, { analytics: true });

    expect(readConsent(COOKIES)).not.to.equal(null);
    expect(readConsent({ ...COOKIES, version: "2" })).to.equal(null);
    expect(
      readConsent({
        ...COOKIES,
        categories: [
          ...(COOKIES.categories ?? []),
          { id: "ads", label: "Ads" },
        ],
      })
    ).to.equal(null);
    // texts don't count
    expect(
      readConsent({ ...COOKIES, texts: { bannerTitle: "Cookies!" } })
    ).not.to.equal(null);
  });

  it("ignores stored values it can't use", () => {
    window.localStorage.setItem(DEFAULT_STORAGE_KEY, "not JSON");
    expect(readConsent(COOKIES)).to.equal(null);

    window.localStorage.setItem(
      DEFAULT_STORAGE_KEY,
      JSON.stringify({ signature: consentSignature(COOKIES), categories: 1 })
    );
    expect(readConsent(COOKIES)).to.equal(null);

    window.localStorage.setItem(
      DEFAULT_STORAGE_KEY,
      JSON.stringify({
        signature: consentSignature(COOKIES),
        categories: { analytics: "yes" },
      })
    );
    expect(hasConsent("analytics", COOKIES)).to.equal(false);
  });

  it("uses the configured storage key", () => {
    saveConsent({ ...COOKIES, storageKey: "my-consent" }, { analytics: true });

    expect(window.localStorage.getItem("my-consent")).to.contain("analytics");
    expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).to.equal(null);
  });

  it("keeps consent for the page if storage fails", () => {
    sinon.stub(Storage.prototype, "setItem").throws(new Error("blocked"));
    sinon.stub(Storage.prototype, "getItem").throws(new Error("blocked"));
    try {
      saveConsent({ ...COOKIES, storageKey: "blocked" }, { analytics: true });

      expect(
        hasConsent("analytics", { ...COOKIES, storageKey: "blocked" })
      ).to.equal(true);
    } finally {
      sinon.restore();
    }
  });
});

describe("cookie consent store, edge cases", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("asks again when a required category becomes optional", () => {
    const forced: CookieConsentConfig = {
      categories: [
        { id: "necessary", label: "Necessary", required: true },
        { id: "analytics", label: "Analytics", required: true },
      ],
    };
    saveConsent(forced, {});
    const optional: CookieConsentConfig = {
      categories: [
        { id: "necessary", label: "Necessary", required: true },
        { id: "analytics", label: "Analytics" },
      ],
    };

    expect(readConsent(optional)).to.equal(null);
    expect(hasConsent("analytics", optional)).to.equal(false);
  });

  it("revokes consent if storage can be read but not written", () => {
    saveConsent(COOKIES, { analytics: true });
    sinon.stub(Storage.prototype, "setItem").throws(new Error("full"));

    saveConsent(COOKIES, { analytics: false });

    expect(hasConsent("analytics", COOKIES)).to.equal(false);
    sinon.restore();
    // the older choice doesn't stay behind for other pages
    expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).to.equal(null);

    // once storage works again, it is used again
    saveConsent(COOKIES, { analytics: false });
    expect(window.localStorage.getItem(DEFAULT_STORAGE_KEY)).to.contain(
      "analytics"
    );
  });

  it("tells listeners about consent saved in other tabs", () => {
    const listener = sinon.spy();
    const stop = onConsentChange(listener, COOKIES);
    window.localStorage.setItem(
      DEFAULT_STORAGE_KEY,
      JSON.stringify({
        categories: { necessary: true, analytics: true },
        signature: consentSignature(COOKIES),
        updatedAt: "2026-10-29T00:00:00Z",
      })
    );

    window.dispatchEvent(new StorageEvent("storage", { key: "other" }));
    window.dispatchEvent(
      new StorageEvent("storage", { key: DEFAULT_STORAGE_KEY })
    );
    stop();
    window.dispatchEvent(
      new StorageEvent("storage", { key: DEFAULT_STORAGE_KEY })
    );

    expect(listener.callCount).to.equal(1);
    expect(listener.firstCall.args[0].categories.analytics).to.equal(true);
  });
});

describe("ecc-utils-design-cookie-consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("shows the banner until users chose", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );
    expect(banner(el)).not.to.equal(null);

    const changed = oneEvent(el, "ecc-cookie-consent-changed");
    button(banner(el) as Element, "accept").click();
    const { detail } = await changed;
    await el.updateComplete;

    expect(detail.consent.categories.analytics).to.equal(true);
    expect(banner(el)).to.equal(null);
    expect(hasConsent("analytics", COOKIES)).to.equal(true);
  });

  it("lets users reject optional cookies as easily", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );
    const onWindow = sinon.spy();
    window.addEventListener(CONSENT_CHANGED_EVENT, onWindow);

    button(banner(el) as Element, "reject").click();
    await el.updateComplete;
    window.removeEventListener(CONSENT_CHANGED_EVENT, onWindow);

    expect(hasConsent("analytics", COOKIES)).to.equal(false);
    expect(readConsent(COOKIES)).not.to.equal(null);
    expect(onWindow.callCount).to.equal(1);
    expect(banner(el)).to.equal(null);
  });

  it("doesn't show the banner after a choice", async () => {
    saveConsent(COOKIES, { analytics: false });
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );

    expect(banner(el)).to.equal(null);
  });

  it("needs no banner without optional categories", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${{}}
      ></ecc-utils-design-cookie-consent>`
    );
    expect(banner(el)).to.equal(null);

    el.config = { cookies: { notice: true } };
    await el.updateComplete;
    expect(banner(el)).not.to.equal(null);
  });

  it("saves the choices of the preferences", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );

    openCookiePreferences();
    await waitUntil(() => dialog(el).open);
    const boxes = dialog(el).querySelectorAll<HTMLInputElement>(
      "input[type=checkbox]"
    );
    expect(boxes).to.have.length(2);
    expect(boxes[0].disabled).to.equal(true);
    expect(boxes[0].checked).to.equal(true);
    boxes[1].click();
    await el.updateComplete;
    button(dialog(el), "save").click();
    await el.updateComplete;

    expect(dialog(el).open).to.equal(false);
    expect(hasConsent("analytics", COOKIES)).to.equal(true);
    expect(banner(el)).to.equal(null);

    // reopened, it shows the stored choice
    await el.openPreferences();
    const reopened = dialog(el).querySelectorAll<HTMLInputElement>(
      "input[type=checkbox]"
    );
    expect(reopened[1].checked).to.equal(true);
    dialog(el).close();
  });

  it("links only safe policy URLs", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${{
          cookies: {
            ...COOKIES,
            // eslint-disable-next-line no-script-url
            policyUrl: "javascript:alert(1)",
          },
        }}
      ></ecc-utils-design-cookie-consent>`
    );
    expect(banner(el)?.querySelector("a")).to.equal(null);

    el.config = { cookies: { ...COOKIES, policyUrl: "/cookies" } };
    await el.updateComplete;
    expect(banner(el)?.querySelector("a")?.getAttribute("href")).to.equal(
      "/cookies"
    );
  });

  it("uses configured texts", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${{ cookies: { ...COOKIES, texts: { acceptAll: "Alle" } } }}
      ></ecc-utils-design-cookie-consent>`
    );

    expect(button(banner(el) as Element, "accept").textContent).to.contain(
      "Alle"
    );
  });

  it("keeps unsaved choices when an equal config is passed", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );
    await el.openPreferences();
    const box = () =>
      dialog(el).querySelectorAll<HTMLInputElement>("input[type=checkbox]")[1];
    box().click();
    await el.updateComplete;

    // e.g. a React render with an inline object
    el.config = { cookies: { ...COOKIES } };
    await el.updateComplete;

    expect(dialog(el).open).to.equal(true);
    expect(box().checked).to.equal(true);
    expect(banner(el)).not.to.equal(null);
    dialog(el).close();
  });

  it("follows consent saved in another tab", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );
    expect(banner(el)).not.to.equal(null);
    window.localStorage.setItem(
      DEFAULT_STORAGE_KEY,
      JSON.stringify({
        categories: { necessary: true, analytics: false },
        signature: consentSignature(COOKIES),
        updatedAt: "2026-10-29T00:00:00Z",
      })
    );

    window.dispatchEvent(
      new StorageEvent("storage", { key: DEFAULT_STORAGE_KEY })
    );
    await el.updateComplete;

    expect(banner(el)).to.equal(null);
  });

  it("stops listening once removed", async () => {
    const el = await fixture<EccUtilsDesignCookieConsent>(
      html`<ecc-utils-design-cookie-consent
        .config=${CONFIG}
      ></ecc-utils-design-cookie-consent>`
    );
    const open = sinon.spy(el, "openPreferences");
    el.remove();

    openCookiePreferences();
    saveConsent(COOKIES, { analytics: true });

    expect(open.callCount).to.equal(0);
  });
});
