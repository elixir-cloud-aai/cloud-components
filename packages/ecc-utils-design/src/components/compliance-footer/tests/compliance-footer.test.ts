/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import { render } from "lit";
import sinon from "sinon";
import "../index.js";
import type EccUtilsDesignComplianceFooter from "../compliance-footer.js";
import {
  ComplianceConfig,
  PREFERENCES_REQUESTED_EVENT,
  footerItems,
  saveConsent,
} from "../../cookie-consent/consent.js";
import { renderMarkdown } from "../markdown.js";

const items = (el: EccUtilsDesignComplianceFooter) =>
  Array.from(el.shadowRoot?.querySelectorAll("[part=item]") ?? []);

const item = (el: EccUtilsDesignComplianceFooter, label: string) =>
  items(el)
    .map((li) => li.querySelector("a, button") as HTMLElement)
    .find((node) => node.textContent?.trim() === label) as HTMLElement;

const dialog = (el: EccUtilsDesignComplianceFooter) =>
  el.shadowRoot?.querySelector("dialog") as HTMLDialogElement;

const COOKIES = {
  categories: [{ id: "embeds", label: "Embedded content" }],
};

describe("footer items", () => {
  it("shows only the defaults that have an action", () => {
    expect(footerItems().map((i) => i.id)).to.deep.equal([
      "cookie-preferences",
    ]);
  });

  it("changes, hides and adds items", () => {
    const result = footerItems({
      items: [
        {
          id: "privacy-policy",
          action: { type: "link", href: "https://example.org/privacy" },
        },
        { id: "cookie-preferences", hidden: true },
        {
          id: "status",
          label: "Status",
          action: { type: "link", href: "/status" },
        },
        {
          id: "imprint",
          label: "Impressum",
          action: { type: "page", markdown: "# Impressum" },
        },
      ],
    });

    expect(result.map((i) => [i.id, i.label])).to.deep.equal([
      ["privacy-policy", "Privacy Policy"],
      ["imprint", "Impressum"],
      ["status", "Status"],
    ]);
  });

  it("uses only configured items when asked", () => {
    const result = footerItems({
      replaceDefaults: true,
      items: [
        { id: "a", label: "A", action: { type: "preferences" } },
        { id: "b", label: "B" },
      ],
    });

    expect(result.map((i) => i.id)).to.deep.equal(["a"]);
  });
});

describe("markdown pages", () => {
  const rendered = (markdown: string) => {
    const container = document.createElement("div");
    render(renderMarkdown(markdown), container);
    return container;
  };

  it("renders headings, paragraphs, lists and links", () => {
    const container = rendered(
      "# Privacy\n\nWe keep **little** data,\nfor *you*.\n\n- one\n- two\n\n1. first\n\nMail [us](mailto:dpo@example.org)."
    );

    expect(container.querySelector("h3")?.textContent).to.equal("Privacy");
    expect(container.querySelector("p strong")?.textContent).to.equal("little");
    expect(container.querySelector("p em")?.textContent).to.equal("you");
    expect(container.querySelectorAll("ul li")).to.have.length(2);
    expect(container.querySelectorAll("ol li")).to.have.length(1);
    expect(container.querySelector("a")?.getAttribute("href")).to.equal(
      "mailto:dpo@example.org"
    );
  });

  it("opens only links to other origins in a new tab", () => {
    const container = rendered(
      "[ours](/terms) and [theirs](https://other.example.org/)"
    );
    const [ours, theirs] = Array.from(container.querySelectorAll("a"));

    expect(ours.hasAttribute("target")).to.equal(false);
    expect(theirs.getAttribute("target")).to.equal("_blank");
    expect(theirs.getAttribute("rel")).to.equal("noopener noreferrer");
  });

  it("escapes HTML and drops unsafe links", () => {
    const container = rendered(
      '<img src=x onerror="alert(1)"> [click](javascript:alert(1))'
    );

    expect(container.querySelector("img")).to.equal(null);
    expect(container.querySelector("a")).to.equal(null);
    expect(container.textContent).to.contain("<img");
    expect(container.textContent).to.contain("click");
  });
});

describe("ecc-utils-design-compliance-footer", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("renders links, mail and preference items", async () => {
    const config: ComplianceConfig = {
      footer: {
        items: [
          {
            id: "terms",
            action: {
              type: "link",
              href: "https://example.org/terms",
              newTab: true,
            },
          },
          {
            id: "contact",
            action: {
              type: "mailto",
              email: "help@example.org",
              subject: "Hi there",
            },
          },
        ],
      },
    };
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${config}
      ></ecc-utils-design-compliance-footer>`
    );

    expect(item(el, "Terms & Conditions").getAttribute("href")).to.equal(
      "https://example.org/terms"
    );
    expect(item(el, "Terms & Conditions").getAttribute("target")).to.equal(
      "_blank"
    );
    expect(item(el, "Contact Us").getAttribute("href")).to.equal(
      "mailto:help@example.org?subject=Hi%20there"
    );
    expect(
      el.shadowRoot?.querySelector("nav")?.getAttribute("aria-label")
    ).to.equal("Legal");

    const requested = sinon.spy();
    window.addEventListener(PREFERENCES_REQUESTED_EVENT, requested);
    item(el, "Cookie Preferences").click();
    window.removeEventListener(PREFERENCES_REQUESTED_EVENT, requested);
    expect(requested.callCount).to.equal(1);
  });

  it("leaves out items with unsafe targets", async () => {
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${{
          footer: {
            items: [
              {
                id: "terms",
                // eslint-disable-next-line no-script-url
                action: { type: "link", href: "javascript:alert(1)" },
              },
              {
                id: "contact",
                action: { type: "mailto", email: "a@b?cc=x@y" },
              },
              {
                id: "imprint",
                action: { type: "embed", src: "http://example.org" },
              },
            ],
          },
        }}
      ></ecc-utils-design-compliance-footer>`
    );

    expect(items(el)).to.have.length(1); // cookie preferences
  });

  it("shows a Markdown page in a dialog", async () => {
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${{
          footer: {
            items: [
              {
                id: "imprint",
                action: { type: "page", markdown: "Operated by **Example**." },
              },
            ],
          },
        }}
      ></ecc-utils-design-compliance-footer>`
    );

    item(el, "Imprint").click();
    await waitUntil(() => dialog(el).open);

    expect(dialog(el).querySelector("h2")?.textContent?.trim()).to.equal(
      "Imprint"
    );
    expect(dialog(el).querySelector("strong")?.textContent).to.equal("Example");
    dialog(el).close();
  });

  it("lets apps handle items themselves", async () => {
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${{
          footer: {
            items: [
              { id: "imprint", action: { type: "page", markdown: "Hi" } },
            ],
          },
        }}
        @ecc-compliance-item-selected=${(event: Event) =>
          event.preventDefault()}
      ></ecc-utils-design-compliance-footer>`
    );

    const selected = oneEvent(el, "ecc-compliance-item-selected");
    item(el, "Imprint").click();
    const { detail } = await selected;
    await el.updateComplete;

    expect(detail.item.id).to.equal("imprint");
    expect(dialog(el).open).to.equal(false);
  });

  it("loads embeds only with consent", async () => {
    const config: ComplianceConfig = {
      cookies: COOKIES,
      footer: {
        items: [
          {
            id: "privacy-policy",
            action: {
              type: "embed",
              src: "https://policies.example.org/privacy",
              consent: "embeds",
            },
          },
        ],
      },
    };
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${config}
      ></ecc-utils-design-compliance-footer>`
    );

    item(el, "Privacy Policy").click();
    await waitUntil(() => dialog(el).open);
    expect(dialog(el).querySelector("iframe")).to.equal(null);
    expect(dialog(el).textContent).to.contain("Embedded content");

    saveConsent(COOKIES, { embeds: true });
    await el.updateComplete;
    const frame = dialog(el).querySelector("iframe");
    expect(frame?.getAttribute("src")).to.equal(
      "https://policies.example.org/privacy"
    );
    expect(frame?.getAttribute("sandbox")).to.contain("allow-scripts");
    dialog(el).close();
  });

  it("doesn't let same-origin embeds lift the sandbox", async () => {
    const config: ComplianceConfig = {
      footer: {
        texts: { close: "Schliessen" },
        items: [
          { id: "terms", action: { type: "embed", src: "/legal/terms" } },
        ],
      },
    };
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${config}
      ></ecc-utils-design-compliance-footer>`
    );

    item(el, "Terms & Conditions").click();
    await waitUntil(() => dialog(el).open);
    const sandbox = dialog(el).querySelector("iframe")?.getAttribute("sandbox");

    expect(sandbox).to.contain("allow-scripts");
    expect(sandbox).not.to.contain("allow-same-origin");
    expect(dialog(el).textContent).to.contain("Schliessen");
    dialog(el).close();
  });

  it("stops listening for consent once removed", async () => {
    const el = await fixture<EccUtilsDesignComplianceFooter>(
      html`<ecc-utils-design-compliance-footer
        .config=${{ cookies: COOKIES }}
      ></ecc-utils-design-compliance-footer>`
    );
    const update = sinon.spy(el, "requestUpdate");
    el.remove();

    saveConsent(COOKIES, { embeds: true });

    expect(update.callCount).to.equal(0);
  });
});
