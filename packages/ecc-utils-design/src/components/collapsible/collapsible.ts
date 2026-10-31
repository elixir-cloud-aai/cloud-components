import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

// Global state manager for collapsible
const collapsibleState = new Map<
  string,
  {
    isOpen: boolean;
  }
>();

/**
 * EccUtilsDesignCollapsible - Root collapsible component
 *
 * @element ecc-utils-design-collapsible
 */
export class EccUtilsDesignCollapsible extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @state() private collapsibleId = `collapsible-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  @property({ type: Boolean }) open = false;
  @property({ type: Boolean }) disabled = false;

  connectedCallback() {
    super.connectedCallback();

    collapsibleState.set(this.collapsibleId, {
      isOpen: this.open,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    collapsibleState.delete(this.collapsibleId);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("open")) {
      collapsibleState.set(this.collapsibleId, {
        ...collapsibleState.get(this.collapsibleId)!,
        isOpen: this.open,
      });
    }
  }

  toggleOpen() {
    if (this.disabled) return;
    this.open = !this.open;
    this._updateState();

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent("ecc-collapsible-toggled", {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _updateState() {
    collapsibleState.set(this.collapsibleId, {
      ...collapsibleState.get(this.collapsibleId)!,
      isOpen: this.open,
    });
  }

  getCollapsibleId(): string {
    return this.collapsibleId;
  }

  render() {
    return html`
      <div part="base" data-state=${this.open ? "open" : "closed"}>
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignCollapsibleTrigger - Trigger component
 *
 * @element ecc-utils-design-collapsible-trigger
 */
export class EccUtilsDesignCollapsibleTrigger extends LitElement {
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
    `,
  ];

  @property({ type: Boolean }) disabled = false;

  private _getParentCollapsible(): EccUtilsDesignCollapsible | null {
    return this.closest(
      "ecc-utils-design-collapsible"
    ) as EccUtilsDesignCollapsible;
  }

  private _handleClick() {
    const parent = this._getParentCollapsible();
    if (parent) {
      parent.toggleOpen();
    }
  }

  render() {
    const parent = this._getParentCollapsible();

    return html`
      <div
        @click=${this._handleClick}
        role="button"
        tabindex="0"
        aria-expanded=${parent?.open ? "true" : "false"}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            this._handleClick();
          }
        }}
      >
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignCollapsibleContent - Content component
 *
 * @element ecc-utils-design-collapsible-content
 */
export class EccUtilsDesignCollapsibleContent extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @state() private isOpen = false;

  connectedCallback() {
    super.connectedCallback();
    this._updateState();
    this._updateInterval = window.setInterval(() => this._updateState(), 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateInterval) {
      window.clearInterval(this._updateInterval);
    }
  }

  private _updateInterval: number | undefined;

  private _getParentCollapsible(): EccUtilsDesignCollapsible | null {
    return this.closest(
      "ecc-utils-design-collapsible"
    ) as EccUtilsDesignCollapsible;
  }

  private _updateState() {
    const collapsible = this._getParentCollapsible();
    if (collapsible) {
      const collapsibleStateData = collapsibleState.get(
        collapsible.getCollapsibleId()
      );
      if (collapsibleStateData) {
        this.isOpen = collapsibleStateData.isOpen;
      }
    }
  }

  render() {
    const parent = this._getParentCollapsible();
    const isOpen = parent?.open || false;

    return html`
      <div class=${isOpen ? "block" : "hidden"}>
        <slot></slot>
      </div>
    `;
  }
}

export default EccUtilsDesignCollapsible;
