/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-non-null-assertion */
import { expect, fixture, html } from "@open-wc/testing";
import "./components/index.js";

describe("TES design consistency", () => {
  for (const tag of ["runs", "run", "run-create"]) {
    it(`${tag} honors font and surface tokens`, async () => {
      const el = await fixture(
        `<ecc-client-ga4gh-tes-${tag} surface style="--ecc-font-sans: Georgia, serif; --ecc-surface-padding: 20px"></ecc-client-ga4gh-tes-${tag}>`
      );
      expect(getComputedStyle(el).fontFamily).to.equal("Georgia, serif");
      expect(getComputedStyle(el).padding).to.equal("20px");
    });
  }
  it("disables submission until required executor fields are filled", async () => {
    const el = await fixture(
      html`<ecc-client-ga4gh-tes-run-create
        .provider=${{ createTask: async () => ({ id: "test" }) }}
      ></ecc-client-ga4gh-tes-run-create>`
    );
    const button = el.shadowRoot!.querySelector(
      "ecc-utils-design-button[type=submit]"
    )!;
    expect(button.hasAttribute("disabled")).to.equal(true);
  });
});
