/* eslint-disable import/no-extraneous-dependencies */
import { expect, fixture, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "../index.js";
import "../../button/index.js";
import type { EccUtilsDesignDialog } from "../dialog.js";
import type { EccDialogOpenChangedEvent } from "../../../events/index.js";

/** Returns `value`, or fails the test if it is missing */
function must<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) {
    throw new Error(`Missing ${what}`);
  }
  return value;
}

/** The element that has focus, also inside shadow roots */
function deepActiveElement(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

function shadow(el: EccUtilsDesignDialog): ShadowRoot {
  return must(el.shadowRoot, "shadow root");
}

function nativeDialog(el: EccUtilsDesignDialog): HTMLDialogElement {
  return must(shadow(el).querySelector("dialog"), "native dialog");
}

function part<T extends HTMLElement = HTMLElement>(
  el: EccUtilsDesignDialog,
  name: string
): T {
  return must(shadow(el).querySelector<T>(`[part=${name}]`), `part ${name}`);
}

function find<T extends Element = HTMLElement>(
  root: ParentNode,
  selector: string
): T {
  return must(root.querySelector<T>(selector), selector);
}

function slot(el: EccUtilsDesignDialog, name: string): HTMLSlotElement {
  const selector = name ? `slot[name=${name}]` : "slot:not([name])";
  return find<HTMLSlotElement>(shadow(el), selector);
}

/** Renders a wrapper and returns the dialog with `selector` in it */
async function renderIn(
  template: ReturnType<typeof html>,
  selector = "ecc-utils-design-dialog"
): Promise<{ wrapper: HTMLElement; el: EccUtilsDesignDialog }> {
  const wrapper = await fixture<HTMLElement>(template);
  const el = find<EccUtilsDesignDialog>(wrapper, selector);
  await el.updateComplete;
  return { wrapper, el };
}

async function renderDialog(open = false): Promise<EccUtilsDesignDialog> {
  const { el } = await renderIn(html`
    <div>
      <button id="outside">Outside</button>
      <ecc-utils-design-dialog ?open=${open}>
        <button slot="trigger" id="trigger">Open</button>
        <span slot="title">Edit profile</span>
        <span slot="description">Change your profile here.</span>
        <input id="first" aria-label="Name" />
        <p>Body text</p>
        <div slot="footer">
          <button id="cancel" data-dialog-close>Cancel</button>
          <button id="last">Save</button>
        </div>
      </ecc-utils-design-dialog>
    </div>
  `);
  return el;
}

/** Renders two dialogs, one inside the other, both open */
async function renderNested(): Promise<{
  wrapper: HTMLElement;
  outer: EccUtilsDesignDialog;
  inner: EccUtilsDesignDialog;
}> {
  const { wrapper, el: outer } = await renderIn(
    html`
      <div>
        <ecc-utils-design-dialog id="outer">
          <span slot="title">Outer</span>
          <button id="outer-button">Outer</button>
          <ecc-utils-design-dialog id="inner">
            <span slot="title">Inner</span>
            <button id="inner-close" data-dialog-close>Close</button>
          </ecc-utils-design-dialog>
        </ecc-utils-design-dialog>
      </div>
    `,
    "#outer"
  );
  const inner = find<EccUtilsDesignDialog>(wrapper, "#inner");
  outer.open = true;
  await outer.updateComplete;
  inner.open = true;
  await inner.updateComplete;
  return { wrapper, outer, inner };
}

/** Collects the open-changed events that the dialog fires */
function recordEvents(el: EccUtilsDesignDialog): EccDialogOpenChangedEvent[] {
  const events: EccDialogOpenChangedEvent[] = [];
  el.addEventListener("ecc-dialog-open-changed", (e) => events.push(e));
  return events;
}

async function clickTrigger(el: EccUtilsDesignDialog) {
  find<HTMLButtonElement>(el, "#trigger").click();
  await el.updateComplete;
}

describe("EccUtilsDesignDialog", () => {
  describe("open and close", () => {
    it("is closed by default", async () => {
      const el = await renderDialog();
      expect(el.open).to.equal(false);
      expect(nativeDialog(el).open).to.equal(false);
    });

    it("opens as a modal when `open` is set", async () => {
      const el = await renderDialog();
      el.open = true;
      await el.updateComplete;
      expect(nativeDialog(el).open).to.equal(true);
      expect(nativeDialog(el).matches(":modal")).to.equal(true);
      expect(el.hasAttribute("open")).to.equal(true);
    });

    it("renders open from the attribute", async () => {
      const el = await renderDialog(true);
      expect(nativeDialog(el).open).to.equal(true);
    });

    it("closes when `open` is unset", async () => {
      const el = await renderDialog(true);
      el.open = false;
      await el.updateComplete;
      expect(nativeDialog(el).open).to.equal(false);
    });

    it("opens with show() and closes with close()", async () => {
      const el = await renderDialog();
      el.show();
      await el.updateComplete;
      expect(nativeDialog(el).open).to.equal(true);
      el.close();
      await el.updateComplete;
      expect(nativeDialog(el).open).to.equal(false);
    });

    it("stays open if opened again right after a close", async () => {
      const el = await renderDialog(true);
      el.open = false;
      await el.updateComplete;
      el.open = true;
      await el.updateComplete;
      // Let the native `close` event of the first close arrive
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      expect(el.open).to.equal(true);
      expect(nativeDialog(el).open).to.equal(true);
    });

    it("doesn't fire events for changes of `open` by code", async () => {
      const el = await renderDialog();
      const events = recordEvents(el);
      el.open = true;
      await el.updateComplete;
      el.open = false;
      await el.updateComplete;
      expect(events).to.have.length(0);
    });

    it("opens when it is connected with `open` set", async () => {
      const el = document.createElement("ecc-utils-design-dialog");
      el.open = true;
      document.body.append(el);
      await el.updateComplete;
      expect(nativeDialog(el).open).to.equal(true);
      el.remove();
    });

    it("closes the native dialog when removed and reopens it when added", async () => {
      const el = await renderDialog(true);
      const parent = must(el.parentElement, "parent");
      const dialog = nativeDialog(el);
      el.remove();
      expect(dialog.open).to.equal(false);
      parent.append(el);
      await el.updateComplete;
      expect(dialog.open).to.equal(true);
    });

    it("syncs `open` and fires an event if the browser closes it", async () => {
      const el = await renderDialog(true);
      const events = recordEvents(el);
      nativeDialog(el).close();
      await waitUntil(() => !el.open);
      expect(events.map((e) => e.detail)).to.deep.equal([
        { open: false, reason: "escape" },
      ]);
    });
  });

  describe("trigger", () => {
    it("opens on a click on the trigger and fires an event", async () => {
      const el = await renderDialog();
      const listener = oneEvent(el, "ecc-dialog-open-changed");
      find<HTMLButtonElement>(el, "#trigger").click();
      const event = await listener;
      await el.updateComplete;
      expect(event.detail).to.deep.equal({ open: true, reason: "trigger" });
      expect(event.bubbles).to.equal(true);
      expect(event.composed).to.equal(true);
      expect(event.cancelable).to.equal(true);
      expect(el.open).to.equal(true);
      expect(nativeDialog(el).open).to.equal(true);
    });

    it("stays closed if the event is canceled", async () => {
      const el = await renderDialog();
      el.addEventListener("ecc-dialog-open-changed", (e) => e.preventDefault());
      await clickTrigger(el);
      expect(el.open).to.equal(false);
    });

    it("marks the trigger as opening a dialog", async () => {
      const el = await renderDialog();
      const trigger = find(el, "#trigger");
      expect(trigger.getAttribute("aria-haspopup")).to.equal("dialog");
      expect(trigger.getAttribute("aria-expanded")).to.equal("false");
      el.open = true;
      await el.updateComplete;
      expect(trigger.getAttribute("aria-expanded")).to.equal("true");
      el.open = false;
      await el.updateComplete;
      expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    });

    it("reflects `open` to the attribute", async () => {
      const el = await renderDialog();
      await clickTrigger(el);
      expect(el.hasAttribute("open")).to.equal(true);
      el.close();
      await el.updateComplete;
      expect(el.hasAttribute("open")).to.equal(false);
    });

    it("leaves the trigger of a nested dialog to that dialog", async () => {
      const { wrapper, el: outer } = await renderIn(
        html`
          <div>
            <ecc-utils-design-dialog id="outer">
              <ecc-utils-design-dialog id="inner">
                <button slot="trigger" id="inner-trigger">Open inner</button>
              </ecc-utils-design-dialog>
            </ecc-utils-design-dialog>
          </div>
        `,
        "#outer"
      );
      const inner = find<EccUtilsDesignDialog>(wrapper, "#inner");
      outer.open = true;
      await outer.updateComplete;
      const events = recordEvents(outer);
      find<HTMLButtonElement>(wrapper, "#inner-trigger").click();
      await inner.updateComplete;
      expect(inner.open).to.equal(true);
      expect(events.map((e) => e.detail.reason)).to.deep.equal(["trigger"]);
      expect(events[0].target).to.equal(inner);
    });
  });

  describe("Escape", () => {
    it("closes on Escape and fires an event", async () => {
      const el = await renderDialog();
      await clickTrigger(el);
      const listener = oneEvent(el, "ecc-dialog-open-changed");
      await sendKeys({ press: "Escape" });
      const event = await listener;
      await el.updateComplete;
      expect(event.detail).to.deep.equal({ open: false, reason: "escape" });
      expect(el.open).to.equal(false);
      expect(nativeDialog(el).open).to.equal(false);
    });

    it("stays open if the event is canceled", async () => {
      const el = await renderDialog();
      await clickTrigger(el);
      el.addEventListener("ecc-dialog-open-changed", (e) => e.preventDefault());
      await sendKeys({ press: "Escape" });
      await el.updateComplete;
      expect(el.open).to.equal(true);
      expect(nativeDialog(el).open).to.equal(true);
    });

    it("closes on the native cancel event", async () => {
      const el = await renderDialog(true);
      const events = recordEvents(el);
      const cancel = new Event("cancel", { cancelable: true });
      nativeDialog(el).dispatchEvent(cancel);
      await el.updateComplete;
      expect(cancel.defaultPrevented).to.equal(true);
      expect(events.map((e) => e.detail)).to.deep.equal([
        { open: false, reason: "escape" },
      ]);
      expect(nativeDialog(el).open).to.equal(false);
    });

    it("closes only the innermost of nested dialogs", async () => {
      const { outer, inner } = await renderNested();
      await sendKeys({ press: "Escape" });
      await inner.updateComplete;
      await outer.updateComplete;
      expect(inner.open).to.equal(false);
      expect(outer.open).to.equal(true);
    });

    it("leaves Escape to content that handled it", async () => {
      const el = await renderDialog(true);
      const input = find(el, "input");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") e.preventDefault();
      });
      input.focus();
      await sendKeys({ press: "Escape" });
      await el.updateComplete;
      expect(el.open).to.equal(true);
    });
  });

  describe("overlay", () => {
    it("closes on a click on the overlay and fires an event", async () => {
      const el = await renderDialog(true);
      const listener = oneEvent(el, "ecc-dialog-open-changed");
      // A click on the backdrop targets the native dialog element itself
      nativeDialog(el).click();
      const event = await listener;
      await el.updateComplete;
      expect(event.detail).to.deep.equal({ open: false, reason: "overlay" });
      expect(el.open).to.equal(false);
    });

    it("stays open on a click inside the content", async () => {
      const el = await renderDialog(true);
      const events = recordEvents(el);
      find(el, "p").click();
      part(el, "content").click();
      await el.updateComplete;
      expect(events).to.have.length(0);
      expect(el.open).to.equal(true);
    });

    it("stays open on an overlay click with `no-overlay-close`", async () => {
      const el = await renderDialog(true);
      el.noOverlayClose = true;
      await el.updateComplete;
      nativeDialog(el).click();
      await el.updateComplete;
      expect(el.open).to.equal(true);
    });

    it("stays open if a press inside ends on the overlay", async () => {
      const el = await renderDialog(true);
      find(el, "input").dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, composed: true })
      );
      nativeDialog(el).click();
      await el.updateComplete;
      expect(el.open).to.equal(true);
    });

    it("leaves an overlay click of a nested dialog to that dialog", async () => {
      const { outer, inner } = await renderNested();
      nativeDialog(inner).click();
      await inner.updateComplete;
      await outer.updateComplete;
      expect(inner.open).to.equal(false);
      expect(outer.open).to.equal(true);
    });
  });

  describe("close button and close elements", () => {
    it("closes on the built-in close button", async () => {
      const el = await renderDialog(true);
      const listener = oneEvent(el, "ecc-dialog-open-changed");
      const button = part<HTMLButtonElement>(el, "close-button");
      expect(button.getAttribute("aria-label")).to.equal("Close");
      button.click();
      const event = await listener;
      expect(event.detail).to.deep.equal({
        open: false,
        reason: "close-button",
      });
      await el.updateComplete;
      expect(el.open).to.equal(false);
    });

    it("labels the close button with `close-label`", async () => {
      const el = await renderDialog(true);
      el.closeLabel = "Schließen";
      await el.updateComplete;
      expect(part(el, "close-button").getAttribute("aria-label")).to.equal(
        "Schließen"
      );
    });

    it("hides the close button with `hide-close-button`", async () => {
      const el = await renderDialog(true);
      el.hideCloseButton = true;
      await el.updateComplete;
      expect(shadow(el).querySelector("[part=close-button]")).to.equal(null);
    });

    it("closes on a click on an element with data-dialog-close", async () => {
      const el = await renderDialog(true);
      const listener = oneEvent(el, "ecc-dialog-open-changed");
      find<HTMLButtonElement>(el, "#cancel").click();
      const event = await listener;
      expect(event.detail).to.deep.equal({ open: false, reason: "close" });
      await el.updateComplete;
      expect(el.open).to.equal(false);
    });

    it("leaves data-dialog-close of a nested dialog to that dialog", async () => {
      const { wrapper, outer, inner } = await renderNested();
      find<HTMLButtonElement>(wrapper, "#inner-close").click();
      await inner.updateComplete;
      await outer.updateComplete;
      expect(inner.open).to.equal(false);
      expect(outer.open).to.equal(true);
    });
  });

  describe("focus", () => {
    it("moves focus into the dialog on open", async () => {
      const el = await renderDialog();
      el.open = true;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "first");
    });

    it("focuses an element with autofocus first", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog>
            <input id="a" aria-label="A" />
            <input id="b" aria-label="B" />
          </ecc-utils-design-dialog>
        </div>
      `);
      find(el, "#b").setAttribute("autofocus", "");
      el.open = true;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "b");
    });

    it("skips hidden, inert and disabled elements", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog>
            <input id="hidden" aria-label="Hidden" hidden />
            <div inert><input id="inert" aria-label="Inert" /></div>
            <button id="disabled" disabled>Disabled</button>
            <input id="visible" aria-label="Visible" />
          </ecc-utils-design-dialog>
        </div>
      `);
      el.open = true;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "visible");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()).to.equal(part(el, "close-button"));
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("visible");
    });

    it("never gets stuck on elements that can't take focus", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog hide-close-button>
            <button id="one">One</button>
            <fieldset disabled><button id="in-fieldset">In</button></fieldset>
            <button id="invisible" style="visibility: hidden">Invisible</button>
            <button id="two">Two</button>
          </ecc-utils-design-dialog>
        </div>
      `);
      // A link without `href` reports tabIndex 0 but can't take focus
      const link = document.createElement("a");
      link.textContent = "Placeholder";
      find(el, "#one").after(link);
      el.open = true;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "one");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("two");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("one");
      await sendKeys({ press: "Shift+Tab" });
      expect(deepActiveElement()?.id).to.equal("two");
    });

    it("keeps Tab inside with the trigger of a closed nested dialog", async () => {
      const { el: outer } = await renderIn(
        html`
          <div>
            <ecc-utils-design-dialog id="outer" hide-close-button>
              <button id="outer-button">Outer</button>
              <ecc-utils-design-dialog id="inner">
                <button slot="trigger" id="inner-trigger">Open inner</button>
              </ecc-utils-design-dialog>
            </ecc-utils-design-dialog>
          </div>
        `,
        "#outer"
      );
      outer.open = true;
      await outer.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "outer-button");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("inner-trigger");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("outer-button");
    });

    it("focuses the content if nothing in it is focusable", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog hide-close-button>
            <p>Only text</p>
          </ecc-utils-design-dialog>
        </div>
      `);
      el.open = true;
      await el.updateComplete;
      const content = part(el, "content");
      await waitUntil(() => deepActiveElement() === content);
    });

    it("keeps Tab focus inside the dialog", async () => {
      const el = await renderDialog();
      el.open = true;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "first");
      const closeButton = part(el, "close-button");
      // Order: input, Cancel, Save, close button, then back to the input
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("cancel");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("last");
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()).to.equal(closeButton);
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("first");
      await sendKeys({ press: "Shift+Tab" });
      expect(deepActiveElement()).to.equal(closeButton);
    });

    it("moves Tab focus into the dialog from its content", async () => {
      const el = await renderDialog(true);
      part(el, "content").focus();
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()?.id).to.equal("first");
      part(el, "content").focus();
      await sendKeys({ press: "Shift+Tab" });
      expect(deepActiveElement()).to.equal(part(el, "close-button"));
    });

    it("keeps focus inside if nothing in it is focusable", async () => {
      const { el } = await renderIn(html`
        <div>
          <button id="before">Before</button>
          <ecc-utils-design-dialog hide-close-button>
            <p>Only text</p>
          </ecc-utils-design-dialog>
        </div>
      `);
      el.open = true;
      await el.updateComplete;
      const content = part(el, "content");
      await waitUntil(() => deepActiveElement() === content);
      await sendKeys({ press: "Tab" });
      expect(deepActiveElement()).to.equal(content);
    });

    it("returns focus to the trigger on close", async () => {
      const el = await renderDialog();
      const trigger = find<HTMLButtonElement>(el, "#trigger");
      trigger.focus();
      trigger.click();
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "first");
      await sendKeys({ press: "Escape" });
      await el.updateComplete;
      await waitUntil(() => deepActiveElement() === trigger);
    });

    it("returns focus to the element focused before an opening by code", async () => {
      const el = await renderDialog();
      const outside = find<HTMLButtonElement>(
        must(el.parentElement, "parent"),
        "#outside"
      );
      outside.focus();
      el.open = true;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement()?.id === "first");
      el.open = false;
      await el.updateComplete;
      await waitUntil(() => deepActiveElement() === outside);
    });
  });

  describe("slots", () => {
    it("renders title, description, body and footer slots", async () => {
      const el = await renderDialog(true);
      expect(slot(el, "title").assignedElements()[0].textContent).to.equal(
        "Edit profile"
      );
      expect(
        slot(el, "description").assignedElements()[0].textContent
      ).to.equal("Change your profile here.");
      expect(slot(el, "footer").assignedElements()).to.have.length(1);
      expect(
        slot(el, "")
          .assignedElements()
          .map((e) => e.tagName)
      ).to.deep.equal(["INPUT", "P"]);
      expect(part(el, "header").hidden).to.equal(false);
      expect(part(el, "footer").hidden).to.equal(false);
    });

    it("hides the header and footer when their slots are empty", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog open>
            <p>Body</p>
          </ecc-utils-design-dialog>
        </div>
      `);
      expect(part(el, "header").hidden).to.equal(true);
      expect(part(el, "footer").hidden).to.equal(true);
    });

    it("shows the header when a title is added later", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog open>
            <p>Body</p>
          </ecc-utils-design-dialog>
        </div>
      `);
      const title = document.createElement("span");
      title.slot = "title";
      title.textContent = "Later";
      el.append(title);
      await waitUntil(() => !part(el, "header").hidden);
      expect(nativeDialog(el).hasAttribute("aria-labelledby")).to.equal(true);
    });
  });

  describe("accessibility", () => {
    it("is a modal dialog named by its title and described by its description", async () => {
      const el = await renderDialog(true);
      const dialog = nativeDialog(el);
      expect(dialog.getAttribute("aria-modal")).to.equal("true");
      const title = must(
        shadow(el).getElementById(
          must(dialog.getAttribute("aria-labelledby"), "aria-labelledby")
        ),
        "title"
      );
      const description = must(
        shadow(el).getElementById(
          must(dialog.getAttribute("aria-describedby"), "aria-describedby")
        ),
        "description"
      );
      expect(find<HTMLSlotElement>(title, "slot").name).to.equal("title");
      expect(find<HTMLSlotElement>(description, "slot").name).to.equal(
        "description"
      );
    });

    it("uses `label` as the name without a title", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog open label="Settings">
            <p>Body</p>
          </ecc-utils-design-dialog>
        </div>
      `);
      const dialog = nativeDialog(el);
      expect(dialog.getAttribute("aria-label")).to.equal("Settings");
      expect(dialog.hasAttribute("aria-labelledby")).to.equal(false);
      expect(dialog.hasAttribute("aria-describedby")).to.equal(false);
    });

    it("marks the focusable control of a custom-element trigger", async () => {
      const { el } = await renderIn(html`
        <div>
          <ecc-utils-design-dialog label="Settings">
            <ecc-utils-design-button slot="trigger"
              >Open</ecc-utils-design-button
            >
          </ecc-utils-design-dialog>
        </div>
      `);
      const host = find<HTMLElement>(el, "ecc-utils-design-button");
      await (host as HTMLElement & { updateComplete: Promise<unknown> })
        .updateComplete;
      await el.updateComplete;
      const inner = find<HTMLButtonElement>(
        must(host.shadowRoot, "button shadow root"),
        "button"
      );
      expect(inner.getAttribute("aria-haspopup")).to.equal("dialog");
      expect(inner.getAttribute("aria-expanded")).to.equal("false");
      el.open = true;
      await el.updateComplete;
      expect(inner.getAttribute("aria-expanded")).to.equal("true");
    });

    it("passes the a11y audit", async () => {
      const el = await renderDialog(true);
      await expect(el).to.be.accessible();
    });
  });

  describe("layout", () => {
    it("scrolls content taller than the window", async () => {
      const el = await renderDialog(true);
      expect(getComputedStyle(nativeDialog(el)).overflowY).to.equal("auto");
      const tall = document.createElement("div");
      tall.style.height = "5000px";
      el.append(tall);
      await waitUntil(
        () => nativeDialog(el).scrollHeight > nativeDialog(el).clientHeight
      );
      expect(nativeDialog(el).clientHeight).to.be.at.most(window.innerHeight);
    });
  });
});
