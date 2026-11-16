import { LitElement, html, css, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

import type { EccDialogOpenChangeReason } from "../../events/ecc-dialog-open-changed.js";

export type { EccDialogOpenChangeReason };

const TAG_NAME = "ecc-utils-design-dialog";

/** Attribute that makes an element inside the dialog close it on click */
const CLOSE_ATTRIBUTE = "data-dialog-close";

let nextId = 0;

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/** The element that has focus, also inside shadow roots */
function deepActiveElement(): HTMLElement | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active instanceof HTMLElement ? active : null;
}

/**
 * Whether Tab can move focus to the element. `tabIndex` alone isn't enough:
 * links without `href`, controls in a disabled fieldset and invisible
 * elements report 0 but can't take focus.
 */
function isTabbable(el: HTMLElement): boolean {
  if (el.tabIndex < 0 || el.matches(":disabled")) return false;
  if (
    (el instanceof HTMLAnchorElement || el instanceof HTMLAreaElement) &&
    !el.hasAttribute("href") &&
    !el.hasAttribute("tabindex")
  ) {
    return false;
  }
  return (
    el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility === "visible"
  );
}

/**
 * Focuses the first candidate that takes focus, in the order given; returns
 * whether one did
 */
function focusFirst(candidates: HTMLElement[]): boolean {
  return candidates.some((candidate) => {
    candidate.focus();
    return deepActiveElement() === candidate;
  });
}

/** Whether `node` is `host` or inside it, also inside its shadow roots */
function isWithin(node: Node, host: Node): boolean {
  let current: Node | null = node;
  while (current) {
    if (current === host) return true;
    current =
      current.parentNode ??
      (current instanceof ShadowRoot ? current.host : null);
  }
  return false;
}

/** Number of open dialogs that lock the page's scrolling */
let scrollLocks = 0;

/** Inline styles of `body` before the first lock, restored by the last */
let bodyStyleBeforeLock: { overflow: string; paddingRight: string } | null =
  null;

/**
 * Stops the page behind open dialogs from scrolling, as shadcn/ui does;
 * nested dialogs share one lock. The scrollbar's width goes to the body's
 * padding, so that the page doesn't shift when the scrollbar disappears.
 */
function lockScroll() {
  scrollLocks += 1;
  if (scrollLocks > 1) return;
  const { body } = document;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  bodyStyleBeforeLock = {
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };
  if (scrollbar > 0) {
    const padding = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${padding + scrollbar}px`;
  }
  body.style.overflow = "hidden";
}

/** Releases a lock of `lockScroll()`; the last one restores the page */
function unlockScroll() {
  if (scrollLocks === 0) return;
  scrollLocks -= 1;
  if (scrollLocks > 0 || !bodyStyleBeforeLock) return;
  const { body } = document;
  body.style.overflow = bodyStyleBeforeLock.overflow;
  body.style.paddingRight = bodyStyleBeforeLock.paddingRight;
  bodyStyleBeforeLock = null;
}

/**
 * Collects the elements below `root` in the order of the flat tree, that is,
 * into shadow roots and through slots to their assigned elements.
 */
function flatTreeElements(root: Element | ShadowRoot, out: HTMLElement[]) {
  const visit = (el: Element) => {
    if (el instanceof HTMLElement && !el.hidden && !el.hasAttribute("inert")) {
      out.push(el);
      flatTreeElements(el.shadowRoot ?? el, out);
    }
  };
  for (const child of Array.from(root.children)) {
    if (child instanceof HTMLSlotElement) {
      child.assignedElements({ flatten: true }).forEach(visit);
    } else {
      visit(child);
    }
  }
}

/**
 * The element of a trigger that takes focus: the trigger itself, or, for a
 * custom element such as `ecc-utils-design-button`, the control in its
 * shadow root
 */
function focusableControl(trigger: Element): HTMLElement | null {
  if (!(trigger instanceof HTMLElement)) return null;
  if (trigger.tabIndex >= 0 || !trigger.shadowRoot) return trigger;
  const inner: HTMLElement[] = [];
  flatTreeElements(trigger.shadowRoot, inner);
  return inner.find((el) => el.tabIndex >= 0) ?? trigger;
}

/**
 * A modal dialog that matches shadcn/ui's Dialog: a window over the page that
 * keeps focus inside until it is closed.
 *
 * Opens on a click on the `trigger` slot or when `open` is set, and closes on
 * Escape, a click on the overlay, the close button or an element with the
 * `data-dialog-close` attribute, or when `open` is unset. Focus moves into
 * the dialog on open (to the first element with `autofocus`, else the first
 * focusable element), stays there on Tab and Shift+Tab, and returns on
 * close to the trigger that opened it (also if a click didn't focus it, as
 * in Safari) or else to the element that had it before. While it is open,
 * the page behind it doesn't scroll.
 *
 * @element ecc-utils-design-dialog
 *
 * @slot - The body of the dialog.
 * @slot trigger - An element that opens the dialog on click, e.g. a button.
 * @slot title - The title, which names the dialog for assistive technology.
 * @slot description - A description below the title, which describes the dialog.
 * @slot footer - Actions at the bottom, e.g. buttons; elements with `data-dialog-close` close the dialog.
 *
 * @csspart dialog - The native `dialog` element.
 * @csspart content - The panel inside the dialog.
 * @csspart header - The container of the title and the description.
 * @csspart title - The container of the title.
 * @csspart description - The container of the description.
 * @csspart body - The container of the body.
 * @csspart footer - The container of the footer.
 * @csspart close-button - The close button in the top right corner.
 *
 * @fires ecc-dialog-open-changed - When the user opens or closes the dialog
 * (not when `open` is changed by code). `detail` holds `open` (the new state)
 * and `reason` (`trigger`, `escape`, `overlay`, `close-button` or `close`).
 * Cancelable: `preventDefault()` keeps the current state. It doesn't bubble,
 * so that listeners of an outer dialog don't get the events of nested ones.
 */
export class EccUtilsDesignDialog extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: contents;
      }
      dialog::backdrop {
        background-color: rgb(0 0 0 / 0.5);
      }
    `,
  ];

  /** Whether the dialog is open. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Accessible name of the dialog, used if the `title` slot is empty. */
  @property({ type: String }) label = "";

  /** Accessible name of the close button. */
  @property({ type: String, attribute: "close-label" }) closeLabel = "Close";

  /** Hides the close button in the top right corner. */
  @property({ type: Boolean, attribute: "hide-close-button" })
  hideCloseButton = false;

  /** Keeps the dialog open on a click on the overlay. */
  @property({ type: Boolean, attribute: "no-overlay-close" })
  noOverlayClose = false;

  @state() private hasTitle = false;

  @state() private hasDescription = false;

  @state() private hasFooter = false;

  @query("dialog") private dialog!: HTMLDialogElement;

  @query("[part=content]") private content!: HTMLElement;

  private readonly idPrefix = `${TAG_NAME}-${(nextId += 1)}`;

  /** The element to focus again on close */
  private returnFocusTo: HTMLElement | null = null;

  /** The trigger whose click is opening the dialog */
  private openingTrigger: Element | null = null;

  /** Whether this dialog holds a lock of the page's scrolling */
  private locksScroll = false;

  /** Whether the current press started inside the content */
  private pressStartedInside = false;

  /** Opens the dialog, like setting `open`. */
  show() {
    this.open = true;
  }

  /** Closes the dialog, like unsetting `open`. */
  close() {
    this.open = false;
  }

  constructor() {
    super();
    // Slotted triggers are buttons or other controls, whose keyboard
    // activation also fires a click
    this.addEventListener("click", (event) => this.onHostClick(event));
  }

  connectedCallback() {
    super.connectedCallback();
    // Reopen the native dialog if the element is moved while open
    if (this.hasUpdated) this.requestUpdate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.dialog?.open) this.dialog.close();
    this.returnFocusTo = null;
    this.openingTrigger = null;
    this.releaseScroll();
  }

  private releaseScroll() {
    if (!this.locksScroll) return;
    this.locksScroll = false;
    unlockScroll();
  }

  /** Opens the dialog on a click on an element in the `trigger` slot */
  private onHostClick(event: MouseEvent) {
    const trigger = event
      .composedPath()
      .find(
        (target): target is Element =>
          target instanceof Element &&
          target.parentElement === this &&
          target.slot === "trigger"
      );
    if (!trigger || this.open) return;
    // Safari and Firefox on macOS don't focus buttons on a mouse click:
    // remember the trigger, so that focus returns to it on close
    this.openingTrigger = trigger;
    this.requestOpenChange(true, "trigger");
    if (!this.open) this.openingTrigger = null;
  }

  protected updated() {
    this.syncTriggers();
    if (!this.dialog || !this.isConnected) return;
    if (this.open && !this.dialog.open) {
      this.returnFocusTo = this.focusToReturnTo();
      this.dialog.showModal();
      if (!this.locksScroll) {
        this.locksScroll = true;
        lockScroll();
      }
      this.focusInitial();
    } else if (!this.open && this.dialog.open) {
      this.dialog.close();
      this.releaseScroll();
      this.restoreFocus();
    }
    this.openingTrigger = null;
  }

  /**
   * The element to focus on close: the element that has focus, or, if a
   * trigger opened the dialog and focus isn't on it (a click that didn't
   * focus it), the trigger's control
   */
  private focusToReturnTo(): HTMLElement | null {
    const active = deepActiveElement();
    const trigger = this.openingTrigger;
    if (!trigger || (active && isWithin(active, trigger))) return active;
    return focusableControl(trigger) ?? active;
  }

  /**
   * Asks to change `open` for a user action: fires the cancelable
   * `ecc-dialog-open-changed` and applies the change unless it was canceled.
   */
  private requestOpenChange(open: boolean, reason: EccDialogOpenChangeReason) {
    if (this.open === open) return;
    if (this.emitOpenChange(open, reason, true)) this.open = open;
  }

  /** Fires `ecc-dialog-open-changed`; false if a listener canceled it */
  private emitOpenChange(
    open: boolean,
    reason: EccDialogOpenChangeReason,
    cancelable: boolean
  ): boolean {
    return this.dispatchEvent(
      // Not bubbling: a listener of an outer dialog (e.g. a controlled one
      // that sets its `open` from the event) doesn't get those of nested ones
      new CustomEvent("ecc-dialog-open-changed", {
        detail: { open, reason },
        bubbles: false,
        composed: false,
        cancelable,
      })
    );
  }

  private focusInitial() {
    const elements: HTMLElement[] = [];
    flatTreeElements(this.content, elements);
    const tabbable = elements.filter(isTabbable);
    const candidates = [
      ...tabbable.filter((el) => el.hasAttribute("autofocus")),
      ...tabbable,
    ];
    if (!focusFirst(candidates)) this.content.focus();
  }

  private restoreFocus() {
    const target = this.returnFocusTo;
    this.returnFocusTo = null;
    if (target?.isConnected) target.focus();
  }

  /** Marks slotted triggers as opening this dialog */
  private syncTriggers() {
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=trigger]");
    for (const trigger of slot?.assignedElements() ?? []) {
      // A custom element such as `ecc-utils-design-button` takes focus with a
      // control in its shadow root: the attributes go there, too, so that
      // assistive technology announces them on the focused control
      const targets = [trigger];
      const control = focusableControl(trigger);
      if (control && control !== trigger) targets.push(control);
      for (const target of targets) {
        target.setAttribute("aria-haspopup", "dialog");
        target.setAttribute("aria-expanded", String(this.open));
      }
    }
  }

  /**
   * Whether an event's path reached this dialog through another open dialog,
   * which handles the event itself (a closed one, e.g. with its trigger in
   * this dialog, leaves it to this one)
   */
  private isFromNestedDialog(path: EventTarget[]): boolean {
    const own = path.indexOf(this);
    return path
      .slice(0, own)
      .some((target) => target instanceof EccUtilsDesignDialog && target.open);
  }

  private onKeyDown(event: KeyboardEvent) {
    if (
      !this.open ||
      event.defaultPrevented ||
      this.isFromNestedDialog(event.composedPath())
    ) {
      return;
    }
    if (event.key === "Escape") {
      // Handled here, so the browser doesn't close the dialog by itself and
      // outer dialogs stay open
      event.preventDefault();
      event.stopPropagation();
      this.requestOpenChange(false, "escape");
    } else if (event.key === "Tab") {
      this.trapFocus(event);
    }
  }

  /**
   * Moves focus to the next (Shift+Tab: previous) focusable element in the
   * dialog, from the last one to the first and back. Handles every Tab press,
   * so that focus moves the same way in every browser (e.g. also to buttons
   * in Safari, which skips them by default).
   */
  private trapFocus(event: KeyboardEvent) {
    event.preventDefault();
    const elements: HTMLElement[] = [];
    flatTreeElements(this.content, elements);
    const tabbable = elements.filter(isTabbable);
    if (tabbable.length === 0) {
      this.content.focus();
      return;
    }
    const active = deepActiveElement();
    const index = active ? tabbable.indexOf(active) : -1;
    const count = tabbable.length;
    let next: number;
    if (index === -1) {
      next = event.shiftKey ? count - 1 : 0;
    } else {
      next = (index + (event.shiftKey ? -1 : 1) + count) % count;
    }
    // Try the following candidates in the direction of the Tab press if one
    // refuses focus, so that Tab never gets stuck
    const step = event.shiftKey ? -1 : 1;
    const order = tabbable.map(
      (_, offset) => tabbable[(next + step * offset + count) % count]
    );
    if (!focusFirst(order)) this.content.focus();
  }

  /** Other close requests than Escape, e.g. the Android back button */
  private onCancel(event: Event) {
    event.preventDefault();
    this.requestOpenChange(false, "escape");
  }

  /** Keeps `open` in sync if the browser closed the dialog by itself */
  private onClose() {
    // `close` fires later than `dialog.close()`: ignore it if `open` was
    // unset by code, if the dialog was opened again in the meantime, or if
    // it was closed because the element was removed
    if (!this.open || this.dialog.open || !this.isConnected) return;
    this.open = false;
    this.releaseScroll();
    // Browsers close a modal dialog by themselves only on close requests
    // (e.g. repeated Escape presses), so the reason is `escape`
    this.emitOpenChange(false, "escape", false);
    this.restoreFocus();
  }

  private onPointerDown(event: PointerEvent) {
    this.pressStartedInside = event.composedPath()[0] !== this.dialog;
  }

  private onDialogClick(event: MouseEvent) {
    const path = event.composedPath();
    const { pressStartedInside } = this;
    this.pressStartedInside = false;
    // The backdrop belongs to the dialog element, while the panel covers the
    // dialog element entirely: a click on the element itself is on the overlay
    if (path[0] === this.dialog) {
      if (!pressStartedInside && !this.noOverlayClose) {
        this.requestOpenChange(false, "overlay");
      }
      return;
    }
    const closer = path.findIndex(
      (target) =>
        target instanceof Element && target.hasAttribute(CLOSE_ATTRIBUTE)
    );
    // The closest dialog around the element owns it: an element inside a
    // nested dialog closes that dialog only (which may already be closed
    // when the click reaches this one)
    const owner = path
      .slice(closer + 1)
      .find((target) => target instanceof EccUtilsDesignDialog);
    if (closer !== -1 && owner === this) {
      this.requestOpenChange(false, "close");
    }
  }

  private onSlotChange() {
    // Named slots take elements only (text needs an element with `slot`)
    const assigned = (name: string) =>
      (this.shadowRoot
        ?.querySelector<HTMLSlotElement>(`slot[name=${name}]`)
        ?.assignedElements({ flatten: true }).length ?? 0) > 0;
    this.hasTitle = assigned("title");
    this.hasDescription = assigned("description");
    this.hasFooter = assigned("footer");
    this.syncTriggers();
    // Lit-based triggers (e.g. `ecc-utils-design-button`) may render their
    // control after the slot changed: mark it again once they have rendered
    const slot =
      this.shadowRoot?.querySelector<HTMLSlotElement>("slot[name=trigger]");
    for (const trigger of slot?.assignedElements() ?? []) {
      const { updateComplete } = trigger as Element & {
        updateComplete?: Promise<unknown>;
      };
      if (updateComplete instanceof Promise) {
        updateComplete.then(() => this.syncTriggers());
      }
    }
  }

  firstUpdated() {
    this.onSlotChange();
  }

  render() {
    const titleId = `${this.idPrefix}-title`;
    const descriptionId = `${this.idPrefix}-description`;
    return html`
      <slot name="trigger" @slotchange=${this.onSlotChange}></slot>
      <dialog
        part="dialog"
        class=${cn(
          "m-auto w-full max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[calc(100%-2rem)] overflow-y-auto",
          "rounded-lg border bg-background p-0 text-foreground shadow-lg"
        )}
        aria-modal="true"
        aria-labelledby=${this.hasTitle ? titleId : nothing}
        aria-label=${!this.hasTitle && this.label ? this.label : nothing}
        aria-describedby=${this.hasDescription ? descriptionId : nothing}
        @keydown=${this.onKeyDown}
        @cancel=${this.onCancel}
        @close=${this.onClose}
        @pointerdown=${this.onPointerDown}
        @click=${this.onDialogClick}
      >
        <div
          part="content"
          class="relative grid gap-4 p-6 outline-none"
          tabindex="-1"
        >
          <div
            part="header"
            class="flex flex-col gap-2 text-center sm:text-left"
            ?hidden=${!this.hasTitle && !this.hasDescription}
          >
            <h2
              part="title"
              id=${titleId}
              class="text-lg leading-none font-semibold"
            >
              <slot name="title" @slotchange=${this.onSlotChange}></slot>
            </h2>
            <div
              part="description"
              id=${descriptionId}
              class="text-sm text-muted-foreground"
            >
              <slot name="description" @slotchange=${this.onSlotChange}></slot>
            </div>
          </div>
          <div part="body">
            <slot></slot>
          </div>
          <div
            part="footer"
            class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
            ?hidden=${!this.hasFooter}
          >
            <slot name="footer" @slotchange=${this.onSlotChange}></slot>
          </div>
          ${this.hideCloseButton
            ? nothing
            : html`
                <button
                  part="close-button"
                  type="button"
                  aria-label=${this.closeLabel}
                  class=${cn(
                    "absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity",
                    "hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "[&_svg]:pointer-events-none [&_svg]:size-4"
                  )}
                  @click=${(event: Event) => {
                    event.stopPropagation();
                    this.requestOpenChange(false, "close-button");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              `}
        </div>
      </dialog>
    `;
  }
}

export default EccUtilsDesignDialog;
