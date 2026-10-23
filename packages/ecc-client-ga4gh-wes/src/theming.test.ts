/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html } from "@open-wc/testing";
import { LitElement } from "lit";
import "./components/index.js";

// Every component must list GlobalStyles after TailwindStyles; otherwise
// Tailwind's unlayered `:host { font-family: inherit }` wins and theming
// tokens on the host are ignored.
const TAGS = [
  "ecc-client-ga4gh-wes-runs",
  "ecc-client-ga4gh-wes-run",
  "ecc-client-ga4gh-wes-run-create",
];

describe("WES component theming", () => {
  TAGS.forEach((tag) => {
    it(`${tag} applies --ecc-font-sans`, async () => {
      // String fixture: lit's html template cannot interpolate tag names
      const el = await fixture(
        `<${tag} style="--ecc-font-sans: Georgia, serif"></${tag}>`
      );
      expect(getComputedStyle(el).fontFamily).to.equal("Georgia, serif");
    });
  });

  it("colors run-create errors with --ecc-destructive", async () => {
    // Without a base URL or provider, the component shows an error
    const el = await fixture<LitElement>(html`
      <ecc-client-ga4gh-wes-run-create
        style="--ecc-destructive: rgb(1, 2, 3)"
      ></ecc-client-ga4gh-wes-run-create>
    `);
    // The error is set in firstUpdated and shown on the next render
    await el.updateComplete;
    const message = el.shadowRoot?.querySelector(
      ".error-message"
    ) as HTMLElement;
    expect(message, "error message rendered").to.be.instanceOf(HTMLElement);
    expect(message.textContent).to.contain("custom provider");
    // GlobalStyles maps the public --ecc-destructive to --destructive
    expect(getComputedStyle(message).color).to.equal("rgb(1, 2, 3)");
  });
});
