/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { GlobalStyles } from "./global.js";
import "./components/badge/index.js";
import "./components/code/index.js";

/** Minimal host that nests a design component in its own shadow tree. */
class TestThemeHost extends LitElement {
  static styles = [GlobalStyles];

  render() {
    return html`<ecc-utils-design-badge>Badge</ecc-utils-design-badge>`;
  }
}
customElements.define("test-theme-host", TestThemeHost);

const inShadow = (el: Element | null | undefined, selector: string) =>
  el?.shadowRoot?.querySelector(selector) as HTMLElement;

/** Serialize a color the same way the browser serializes computed styles. */
const resolveColor = async (value: string) => {
  const probe = await fixture<HTMLElement>(
    html`<div style="background-color: ${value}"></div>`
  );
  return getComputedStyle(probe).backgroundColor;
};

describe("GlobalStyles", () => {
  describe("surface attribute", () => {
    it("keeps the host transparent by default", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge
          style="--ecc-background: rgb(1, 2, 3)"
        ></ecc-utils-design-badge>
      `);
      expect(getComputedStyle(el).backgroundColor).to.equal("rgba(0, 0, 0, 0)");
    });

    it("paints background and foreground tokens when set", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge
          surface
          style="--ecc-background: rgb(1, 2, 3); --ecc-foreground: rgb(4, 5, 6)"
        ></ecc-utils-design-badge>
      `);
      const style = getComputedStyle(el);
      expect(style.backgroundColor).to.equal("rgb(1, 2, 3)");
      expect(style.color).to.equal("rgb(4, 5, 6)");
    });

    it("insets the surface by --ecc-surface-padding", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge
          surface
          style="--ecc-surface-padding: 7px"
        ></ecc-utils-design-badge>
      `);
      expect(getComputedStyle(el).paddingLeft).to.equal("7px");
    });

    it("keeps full-width surfaces within their container", async () => {
      const wrapper = await fixture<HTMLElement>(html`
        <div style="width: 200px">
          <ecc-utils-design-code surface value="{}"></ecc-utils-design-code>
        </div>
      `);
      const el = wrapper.querySelector("ecc-utils-design-code") as HTMLElement;
      expect(el.getBoundingClientRect().width).to.equal(200);
    });
  });

  describe("font tokens", () => {
    it("applies --ecc-font-sans to the host", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge
          style="--ecc-font-sans: Georgia, serif"
        ></ecc-utils-design-badge>
      `);
      expect(getComputedStyle(el).fontFamily).to.equal("Georgia, serif");
    });

    it("inherits the page font when --ecc-font-sans is unset", async () => {
      const wrapper = await fixture(html`
        <div style="font-family: Georgia, serif">
          <ecc-utils-design-badge></ecc-utils-design-badge>
        </div>
      `);
      const el = wrapper.querySelector("ecc-utils-design-badge") as Element;
      expect(getComputedStyle(el).fontFamily).to.equal("Georgia, serif");
    });

    it("applies --ecc-font-mono to the code editor", async () => {
      const el = await fixture(html`
        <ecc-utils-design-code
          style="--ecc-font-mono: Courier, monospace"
          value="{}"
        ></ecc-utils-design-code>
      `);
      const editor = inShadow(el, ".ace_editor");
      expect(getComputedStyle(editor).fontFamily).to.equal(
        "Courier, monospace"
      );
    });
  });

  describe("dark mode", () => {
    it("uses light defaults without dark", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge>Badge</ecc-utils-design-badge>
      `);
      expect(
        getComputedStyle(inShadow(el, "[part=base]")).backgroundColor
      ).to.equal(await resolveColor("oklch(0.205 0 0)"));
    });

    it("applies dark defaults via the dark attribute", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge dark>Badge</ecc-utils-design-badge>
      `);
      expect(
        getComputedStyle(inShadow(el, "[part=base]")).backgroundColor
      ).to.equal(await resolveColor("oklch(0.985 0 0)"));
    });

    it("passes dark defaults to nested components", async () => {
      const host = await fixture(
        html`<test-theme-host dark></test-theme-host>`
      );
      const badge = inShadow(host, "ecc-utils-design-badge") as LitElement;
      await badge.updateComplete;
      expect(
        getComputedStyle(inShadow(badge, "[part=base]")).backgroundColor
      ).to.equal(await resolveColor("oklch(0.985 0 0)"));
    });

    it("applies dark defaults via a .dark ancestor", async function darkAncestor() {
      // Relies on :host-context(), which Firefox does not support
      if (!CSS.supports("selector(:host-context(.dark))")) this.skip();
      const wrapper = await fixture(html`
        <div class="dark">
          <ecc-utils-design-badge>Badge</ecc-utils-design-badge>
        </div>
      `);
      const el = wrapper.querySelector("ecc-utils-design-badge");
      expect(
        getComputedStyle(inShadow(el, "[part=base]")).backgroundColor
      ).to.equal(await resolveColor("oklch(0.985 0 0)"));
    });

    it("lets explicit tokens override dark defaults", async () => {
      const el = await fixture(html`
        <ecc-utils-design-badge dark style="--ecc-primary: rgb(7, 8, 9)"
          >Badge</ecc-utils-design-badge
        >
      `);
      expect(
        getComputedStyle(inShadow(el, "[part=base]")).backgroundColor
      ).to.equal("rgb(7, 8, 9)");
    });
  });

  describe("code editor theme", () => {
    it("follows design tokens", async () => {
      const el = await fixture(html`
        <ecc-utils-design-code
          style="--ecc-background: rgb(10, 20, 30); --ecc-foreground: rgb(40, 50, 60)"
          value="{}"
        ></ecc-utils-design-code>
      `);
      const style = getComputedStyle(inShadow(el, ".ace_editor"));
      expect(style.backgroundColor).to.equal("rgb(10, 20, 30)");
      expect(style.color).to.equal("rgb(40, 50, 60)");
    });

    it("paints the gutter with --ecc-muted", async () => {
      const el = await fixture(html`
        <ecc-utils-design-code
          style="--ecc-muted: rgb(70, 80, 90)"
          value="{}"
        ></ecc-utils-design-code>
      `);
      expect(
        getComputedStyle(inShadow(el, ".ace_gutter")).backgroundColor
      ).to.equal("rgb(70, 80, 90)");
    });
  });
});
