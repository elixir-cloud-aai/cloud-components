import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

// Utility function to combine class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * EccUtilsDesignTabs - Main tabs container component
 *
 * @element ecc-utils-design-tabs
 */
export class EccUtilsDesignTabs extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  @property({ type: String, attribute: "default-value" }) defaultValue = "";
  @property({ type: String }) value = "";

  private _activeValue = "";
  private _firstUpdated = false;

  firstUpdated() {
    this._firstUpdated = true;

    // Set initial value from props
    if (this.value || this.defaultValue) {
      this._activeValue = this.value || this.defaultValue;
      this._updateActiveTab();
    } else {
      // Wait for the child elements to be rendered
      // Use requestAnimationFrame to ensure the DOM is updated
      requestAnimationFrame(() => {
        if (!this._activeValue) {
          // Find the first trigger and use its value
          const firstTrigger = this.querySelector(
            "ecc-utils-design-tabs-trigger"
          );
          if (firstTrigger) {
            this._activeValue = firstTrigger.getAttribute("value") || "";
            this._updateActiveTab();
          }
        }
      });
    }
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("value") && this._firstUpdated) {
      this._activeValue = this.value;
      this._updateActiveTab();
    }
    if (changedProps.has("defaultValue") && this._firstUpdated) {
      this._activeValue = this.defaultValue;
      this._updateActiveTab();
    }
  }

  _updateActiveTab() {
    // Find all tab triggers and content elements
    const allTriggers = this.querySelectorAll("ecc-utils-design-tabs-trigger");
    const allContent = this.querySelectorAll("ecc-utils-design-tabs-content");

    // Update active state
    allTriggers.forEach((trigger) => {
      const value = trigger.getAttribute("value");
      const shadowElement = trigger.shadowRoot?.querySelector("button");
      const isActive =
        value === this._activeValue ||
        shadowElement?.getAttribute("value") === this._activeValue;
      trigger.setAttribute("data-state", isActive ? "active" : "inactive");
      trigger.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    allContent.forEach((content) => {
      const value = content.getAttribute("value");
      const shadowElement = content.shadowRoot?.querySelector("div");
      const isActive =
        value === this._activeValue ||
        shadowElement?.getAttribute("value") === this._activeValue;
      content.setAttribute("data-state", isActive ? "active" : "inactive");
      const element = content;
      element.hidden = !isActive;
    });
  }

  _handleTabChange(value: string) {
    // Only update if in uncontrolled mode or value is not explicitly set
    if (this.value === "") {
      this._activeValue = value;
      this._updateActiveTab();
    }

    // Always dispatch event
    this.dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = cn();
    return html`
      <div part="base" class=${classes}>
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  _handleSlotChange() {
    // If we don't have an active value yet, select the first tab
    if (!this._activeValue && this._firstUpdated) {
      const firstTrigger = this.querySelector("ecc-utils-design-tabs-trigger");
      if (firstTrigger) {
        this._activeValue = firstTrigger.getAttribute("value") || "";
        this._updateActiveTab();
      }
    }
  }
}

/**
 * EccUtilsDesignTabsList - Container for tab triggers
 *
 * @element ecc-utils-design-tabs-list
 */
export class EccUtilsDesignTabsList extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
    );

    return html`<div part="base" class=${classes} role="tablist">
      <slot></slot>
    </div>`;
  }
}

/**
 * EccUtilsDesignTabsTrigger - Individual tab trigger button
 *
 * @element ecc-utils-design-tabs-trigger
 */
export class EccUtilsDesignTabsTrigger extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: inline-block;
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;
  @property({ type: String, reflect: true }) "data-state" = "inactive";

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "tab");
  }

  render() {
    const classes = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm w-full",
      this.disabled ? "cursor-not-allowed" : "cursor-pointer"
    );

    return html`
      <button
        part="base"
        class=${classes}
        value=${this.value}
        ?disabled=${this.disabled}
        data-state=${this["data-state"]}
        aria-selected=${this["data-state"] === "active" ? "true" : "false"}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  _handleClick() {
    if (this.disabled) return;

    const tabs = this.closest("ecc-utils-design-tabs");
    if (tabs) {
      tabs._handleTabChange(this.value);
    }
  }
}

/**
 * EccUtilsDesignTabsContent - Content panel for a tab
 *
 * @element ecc-utils-design-tabs-content
 */
export class EccUtilsDesignTabsContent extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: String, reflect: true }) "data-state" = "inactive";

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("role", "tabpanel");
    // Hide by default until parent activates
    this.hidden = true;
  }

  render() {
    const classes = cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    );

    return html`<div part="base" class=${classes} value=${this.value}>
      <slot></slot>
    </div>`;
  }
}

export default EccUtilsDesignTabs;
