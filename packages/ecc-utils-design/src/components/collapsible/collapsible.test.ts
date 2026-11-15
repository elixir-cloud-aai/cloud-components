// eslint-disable-next-line import/no-extraneous-dependencies
import { fixture, html, expect } from "@open-wc/testing";
import "./index.js";
import type {
  EccUtilsDesignCollapsible,
  EccUtilsDesignCollapsibleTrigger,
} from "./collapsible.js";

describe("collapsible aria-expanded", () => {
  it("tracks the open state on the trigger", async () => {
    const el = await fixture<EccUtilsDesignCollapsible>(html`
      <ecc-utils-design-collapsible>
        <ecc-utils-design-collapsible-trigger
          >t</ecc-utils-design-collapsible-trigger
        >
      </ecc-utils-design-collapsible>
    `);
    const trigger = el.querySelector<EccUtilsDesignCollapsibleTrigger>(
      "ecc-utils-design-collapsible-trigger"
    );
    if (!trigger) throw new Error("Collapsible trigger not found");
    const button = () => trigger.shadowRoot?.querySelector("[role=button]");
    expect(button()?.getAttribute("aria-expanded")).to.equal("false");

    el.toggleOpen();
    await el.updateComplete;
    await trigger.updateComplete;
    expect(button()?.getAttribute("aria-expanded")).to.equal("true");

    el.open = false;
    await el.updateComplete;
    await trigger.updateComplete;
    expect(button()?.getAttribute("aria-expanded")).to.equal("false");
  });
});
