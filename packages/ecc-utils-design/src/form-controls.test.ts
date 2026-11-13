/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html } from "@open-wc/testing";
import type { LitElement } from "lit";
import "./components/input/index.js";
import "./components/textarea/index.js";
import "./components/checkbox/index.js";
import "./components/select/index.js";
import "./components/multi-select/index.js";
import type { EccUtilsDesignSelect } from "./components/select/index.js";
import type { EccUtilsDesignMultiSelect } from "./components/multi-select/index.js";

type FormControl = LitElement & { invalid: boolean; error: string };

// The element that gets `aria-invalid` and `aria-describedby`
const controls: [string, () => Promise<FormControl>, string][] = [
  [
    "input",
    () => fixture(html`<ecc-utils-design-input></ecc-utils-design-input>`),
    "input",
  ],
  [
    "textarea",
    () =>
      fixture(html`<ecc-utils-design-textarea></ecc-utils-design-textarea>`),
    "textarea",
  ],
  [
    "checkbox",
    () =>
      fixture(html`<ecc-utils-design-checkbox></ecc-utils-design-checkbox>`),
    "[role=checkbox]",
  ],
];

function errorElement(el: LitElement): HTMLElement {
  return el.shadowRoot!.querySelector("[part=error]") as HTMLElement;
}

describe("form controls: invalid state and error message", () => {
  controls.forEach(([name, create, selector]) => {
    describe(name, () => {
      it("is valid by default, with an empty live region", async () => {
        const el = await create();
        const control = el.shadowRoot!.querySelector(selector)!;
        expect(control.hasAttribute("aria-invalid")).to.equal(false);
        expect(control.hasAttribute("aria-describedby")).to.equal(false);
        expect(errorElement(el).textContent?.trim()).to.equal("");
        expect(errorElement(el).getAttribute("aria-live")).to.equal("polite");
      });

      it("shows the error under the control", async () => {
        const el = await create();
        el.error = "Must be a valid URI.";
        await el.updateComplete;
        const control = el.shadowRoot!.querySelector(selector)!;
        const message = errorElement(el);
        expect(message.textContent?.trim()).to.equal("Must be a valid URI.");
        expect(control.getAttribute("aria-invalid")).to.equal("true");
        expect(control.getAttribute("aria-describedby")).to.equal(message.id);
        expect(control.className).to.contain("border-destructive");
      });

      it("can be invalid without a message", async () => {
        const el = await create();
        el.invalid = true;
        await el.updateComplete;
        const control = el.shadowRoot!.querySelector(selector)!;
        expect(el.hasAttribute("invalid")).to.equal(true);
        expect(control.getAttribute("aria-invalid")).to.equal("true");
        expect(control.hasAttribute("aria-describedby")).to.equal(false);
        expect(control.className).to.contain("border-destructive");
      });

      it("clears the error", async () => {
        const el = await create();
        el.error = "Is required.";
        await el.updateComplete;
        el.error = "";
        await el.updateComplete;
        const control = el.shadowRoot!.querySelector(selector)!;
        expect(control.hasAttribute("aria-invalid")).to.equal(false);
        expect(control.hasAttribute("aria-describedby")).to.equal(false);
        expect(errorElement(el).textContent?.trim()).to.equal("");
        expect(control.className).to.not.contain("border-destructive");
      });
    });
  });

  it("takes the error from the attribute", async () => {
    const el = await fixture<FormControl>(
      html`<ecc-utils-design-input
        error="Is required."
      ></ecc-utils-design-input>`
    );
    expect(errorElement(el).textContent?.trim()).to.equal("Is required.");
  });

  const selects: [string, () => Promise<FormControl>, string][] = [
    [
      "select",
      () =>
        fixture<EccUtilsDesignSelect>(html`
          <ecc-utils-design-select>
            <ecc-utils-design-select-trigger>
              <ecc-utils-design-select-value></ecc-utils-design-select-value>
            </ecc-utils-design-select-trigger>
          </ecc-utils-design-select>
        `),
      "ecc-utils-design-select-trigger",
    ],
    [
      "multi-select",
      () =>
        fixture<EccUtilsDesignMultiSelect>(html`
          <ecc-utils-design-multi-select>
            <ecc-utils-design-multi-select-trigger></ecc-utils-design-multi-select-trigger>
          </ecc-utils-design-multi-select>
        `),
      "ecc-utils-design-multi-select-trigger",
    ],
  ];

  selects.forEach(([name, create, triggerTag]) => {
    describe(name, () => {
      it("shows the error and marks the trigger invalid", async () => {
        const el = await create();
        const trigger = el.querySelector(triggerTag) as LitElement;
        const button = () => trigger.shadowRoot!.querySelector("button")!;
        expect(button().hasAttribute("aria-invalid")).to.equal(false);
        expect(errorElement(el).textContent?.trim()).to.equal("");
        expect(errorElement(el).getAttribute("aria-live")).to.equal("polite");

        el.error = "Must be one of: a, b.";
        await el.updateComplete;
        expect(el.hasAttribute("invalid")).to.equal(false);
        await trigger.updateComplete;
        expect(errorElement(el).textContent?.trim()).to.equal(
          "Must be one of: a, b."
        );
        expect(button().getAttribute("aria-invalid")).to.equal("true");
        const describedBy = button().getAttribute("aria-describedby")!;
        // Hidden, so that the message isn't read twice
        expect(
          trigger.shadowRoot!.getElementById(describedBy)!.hidden
        ).to.equal(true);
        expect(
          trigger.shadowRoot!.getElementById(describedBy)!.textContent?.trim()
        ).to.equal("Must be one of: a, b.");
        expect(button().className).to.contain("border-destructive");

        el.error = "";
        await el.updateComplete;
        await trigger.updateComplete;
        expect(button().hasAttribute("aria-invalid")).to.equal(false);
        expect(button().hasAttribute("aria-describedby")).to.equal(false);
        expect(button().className).to.not.contain("border-destructive");

        el.invalid = true;
        await el.updateComplete;
        await trigger.updateComplete;
        expect(el.hasAttribute("invalid")).to.equal(true);
        expect(button().getAttribute("aria-invalid")).to.equal("true");
        expect(button().hasAttribute("aria-describedby")).to.equal(false);
      });

      it("takes the error from the attribute", async () => {
        const el = await create();
        el.setAttribute("error", "Is required.");
        await el.updateComplete;
        expect(errorElement(el).textContent?.trim()).to.equal("Is required.");
      });

      it("has a valid trigger without a select", async () => {
        const trigger = await fixture<LitElement>(
          `<${triggerTag}></${triggerTag}>`
        );
        const button = trigger.shadowRoot!.querySelector("button")!;
        expect(button.hasAttribute("aria-invalid")).to.equal(false);
        expect(button.className).to.contain("border-input");
      });
    });
  });
});
