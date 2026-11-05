import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Global state manager for select
const selectState = new Map<
  string,
  {
    isOpen: boolean;
    value: string;
    onSelect: (value: string) => void;
  }
>();

/**
 * EccUtilsDesignSelect - Root select component
 *
 * @element ecc-utils-design-select
 */
export class EccUtilsDesignSelect extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @state() private selectId = `select-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;

  @state() private isOpen = false;

  connectedCallback() {
    super.connectedCallback();

    selectState.set(this.selectId, {
      isOpen: this.isOpen,
      value: this.value,
      onSelect: (value) => this._handleSelect(value),
    });

    document.addEventListener("click", this._handleOutsideClick, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    selectState.delete(this.selectId);
    document.removeEventListener("click", this._handleOutsideClick, true);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("value") || changedProperties.has("isOpen")) {
      selectState.set(this.selectId, {
        ...selectState.get(this.selectId)!,
        value: this.value,
        isOpen: this.isOpen,
      });
    }
  }

  private _handleOutsideClick = (e: MouseEvent) => {
    if (this.isOpen && !this.contains(e.target as Node)) {
      this.isOpen = false;
      e.preventDefault();
    }
  };

  toggleOpen() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    this._updateState();
  }

  _handleSelect(value: string) {
    this.value = value;
    this.isOpen = false;

    this.dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _updateState() {
    selectState.set(this.selectId, {
      ...selectState.get(this.selectId)!,
      isOpen: this.isOpen,
      value: this.value,
    });
  }

  getSelectId(): string {
    return this.selectId;
  }

  render() {
    return html`
      <div
        part="base"
        class="relative"
        data-state=${this.isOpen ? "open" : "closed"}
      >
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignSelectTrigger - Trigger component for the select
 *
 * @element ecc-utils-design-select-trigger
 */
export class EccUtilsDesignSelectTrigger extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: Boolean }) disabled = false;

  @state() private isOpen = false;

  private _getParentSelect(): EccUtilsDesignSelect | null {
    return this.closest("ecc-utils-design-select") as EccUtilsDesignSelect;
  }

  private _handleClick() {
    const select = this._getParentSelect();
    if (select) {
      select.toggleOpen();
    }
  }

  render() {
    const classes = cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      this.disabled && "opacity-50 cursor-not-allowed"
    );

    return html`
      <button
        part="base"
        type="button"
        class=${classes}
        ?disabled=${this.disabled}
        data-state=${this.isOpen ? "open" : "closed"}
        @click=${this._handleClick}
      >
        <slot></slot>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    `;
  }
}

/**
 * EccUtilsDesignSelectContent - Content component for the select
 *
 * @element ecc-utils-design-select-content
 */
export class EccUtilsDesignSelectContent extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) position = "popper";

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

  private _getParentSelect(): EccUtilsDesignSelect | null {
    return this.closest("ecc-utils-design-select") as EccUtilsDesignSelect;
  }

  private _updateState() {
    const select = this._getParentSelect();
    if (select) {
      const selectStateData = selectState.get(select.getSelectId());
      if (selectStateData) {
        this.isOpen = selectStateData.isOpen;
      }
    }
  }

  render() {
    if (!this.isOpen) return html``;

    const classes = cn(
      "absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      this.position === "popper" &&
        "top-full mt-1 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
    );

    return html`
      <div
        part="base"
        class=${classes}
        data-state=${this.isOpen ? "open" : "closed"}
      >
        <div class="relative max-h-[300px] overflow-y-auto">
          <div class="p-1">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignSelectItem - Item component for the select
 *
 * @element ecc-utils-design-select-item
 */
export class EccUtilsDesignSelectItem extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) value = "";
  @property({ type: Boolean }) disabled = false;

  @state() private selected = false;

  connectedCallback() {
    super.connectedCallback();
    this._updateSelected();
    this._updateInterval = window.setInterval(
      () => this._updateSelected(),
      100
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateInterval) {
      window.clearInterval(this._updateInterval);
    }
  }

  private _updateInterval: number | undefined;

  private _getParentSelect(): EccUtilsDesignSelect | null {
    return this.closest("ecc-utils-design-select") as EccUtilsDesignSelect;
  }

  private _updateSelected() {
    const select = this._getParentSelect();
    if (select) {
      const selectStateData = selectState.get(select.getSelectId());
      if (selectStateData) {
        this.selected = selectStateData.value === this.value;
      }
    }
  }

  private _handleSelect() {
    if (this.disabled) return;

    const select = this._getParentSelect();
    if (select) {
      select._handleSelect(this.value);
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    // Handle Enter key press
    if (e.key === "Enter") {
      e.preventDefault();
      this._handleSelect();
    }
  }

  render() {
    const classes = cn(
      "relative flex w-full select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
      !this.disabled &&
        "cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      this.disabled && "pointer-events-none opacity-50",
      this.selected && "bg-accent text-accent-foreground"
    );

    return html`
      <div
        part="base"
        class=${classes}
        aria-disabled=${this.disabled}
        aria-selected=${this.selected}
        @click=${this._handleSelect}
        @keydown=${this._handleKeyDown}
        tabindex=${this.disabled ? "-1" : "0"}
        role="option"
      >
        <span
          class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center"
        >
          ${this.selected
            ? html`
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="h-4 w-4"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              `
            : ""}
        </span>
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignSelectGroup - Group component
 *
 * @element ecc-utils-design-select-group
 */
export class EccUtilsDesignSelectGroup extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div part="base" class="overflow-hidden p-1">
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignSelectLabel - Label component
 *
 * @element ecc-utils-design-select-label
 */
export class EccUtilsDesignSelectLabel extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    const classes = cn("px-2 py-1.5 text-sm font-semibold");
    return html`<div part="base" class=${classes}><slot></slot></div>`;
  }
}

/**
 * EccUtilsDesignSelectSeparator - Separator component
 *
 * @element ecc-utils-design-select-separator
 */
export class EccUtilsDesignSelectSeparator extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    const classes = cn("-mx-1 my-1 h-px bg-muted");
    return html`<div part="base" class=${classes}></div>`;
  }
}

/**
 * EccUtilsDesignSelectValue - Value component for the select
 *
 * @element ecc-utils-design-select-value
 */
export class EccUtilsDesignSelectValue extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) placeholder = "Select an option";

  @state() private selectedLabel = "";

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

  private _getParentSelect(): EccUtilsDesignSelect | null {
    return this.closest("ecc-utils-design-select") as EccUtilsDesignSelect;
  }

  private _updateState() {
    const select = this._getParentSelect();
    if (select) {
      const selectStateData = selectState.get(select.getSelectId());
      if (selectStateData && selectStateData.value) {
        const options = select.querySelectorAll("ecc-utils-design-select-item");
        this.selectedLabel =
          Array.from(options)
            .find(
              (option) =>
                (option as EccUtilsDesignSelectItem).value ===
                selectStateData.value
            )
            ?.textContent?.trim() || this.placeholder;
      } else {
        this.selectedLabel = this.placeholder;
      }
    }
  }

  render() {
    const classes = cn(
      "line-clamp-1",
      this.selectedLabel === this.placeholder && "text-muted-foreground"
    );
    return html`<span part="base" class=${classes}
      >${this.selectedLabel}</span
    >`;
  }
}

export default EccUtilsDesignSelect;
