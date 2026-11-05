import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import "../checkbox/index.js";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Global state manager for multi-select
const multiSelectState = new Map<
  string,
  {
    isOpen: boolean;
    selectedValues: string[];
    onSelect: (values: string[]) => void;
  }
>();

/**
 * EccUtilsDesignMultiSelect - Root multi-select component
 *
 * @element ecc-utils-design-multi-select
 */
export class EccUtilsDesignMultiSelect extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `,
  ];

  @state() private selectId = `multi-select-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  @property({ type: Array }) value: string[] = [];
  @property({ type: String }) placeholder = "Select options...";
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) name = "";

  @state() private isOpen = false;

  connectedCallback() {
    super.connectedCallback();

    multiSelectState.set(this.selectId, {
      isOpen: this.isOpen,
      selectedValues: this.value,
      onSelect: (values) => this._handleSelect(values),
    });

    document.addEventListener("click", this._handleOutsideClick, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    multiSelectState.delete(this.selectId);
    document.removeEventListener("click", this._handleOutsideClick, true);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has("value") || changedProperties.has("isOpen")) {
      multiSelectState.set(this.selectId, {
        ...multiSelectState.get(this.selectId)!,
        selectedValues: this.value,
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

  _handleSelect(values: string[]) {
    this.value = [...values];

    this.dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _updateState() {
    multiSelectState.set(this.selectId, {
      ...multiSelectState.get(this.selectId)!,
      isOpen: this.isOpen,
      selectedValues: this.value,
    });
  }

  getSelectId(): string {
    return this.selectId;
  }

  private _removeValue(valueToRemove: string) {
    const newValues = this.value.filter((v) => v !== valueToRemove);
    this._handleSelect(newValues);
  }

  private _clearAll() {
    this._handleSelect([]);
  }

  render() {
    return html`
      <div
        part="base"
        class="relative w-full"
        data-state=${this.isOpen ? "open" : "closed"}
      >
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignMultiSelectTrigger - Trigger component for the multi-select
 *
 * @element ecc-utils-design-multi-select-trigger
 */
export class EccUtilsDesignMultiSelectTrigger extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `,
  ];

  @property({ type: Boolean }) disabled = false;

  @state() private isOpen = false;
  @state() private selectedValues: string[] = [];

  private _getParentSelect(): EccUtilsDesignMultiSelect | null {
    return this.closest(
      "ecc-utils-design-multi-select"
    ) as EccUtilsDesignMultiSelect;
  }

  private _handleClick() {
    const select = this._getParentSelect();
    if (select) {
      select.toggleOpen();
    }
  }

  private _removeValue(e: Event, value: string) {
    e.stopPropagation();
    const select = this._getParentSelect();
    if (select) {
      const newValues = this.selectedValues.filter((v) => v !== value);
      select._handleSelect(newValues);
    }
  }

  private _clearAll(e: Event) {
    e.stopPropagation();
    const select = this._getParentSelect();
    if (select) {
      select._handleSelect([]);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateState();
  }

  private _updateInterval: number | undefined;

  private _updateState() {
    const select = this._getParentSelect();
    if (select) {
      const selectId = select.getSelectId();
      const selectState = multiSelectState.get(selectId);
      if (selectState) {
        this.isOpen = selectState.isOpen;
        this.selectedValues = selectState.selectedValues;
      }
    }

    // Continue polling for state updates
    this._updateInterval = window.setTimeout(() => this._updateState(), 16);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateInterval) {
      clearTimeout(this._updateInterval);
    }
  }

  render() {
    const select = this._getParentSelect();
    const placeholder = select?.placeholder || "Select options...";

    const classes = cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      this.disabled && "opacity-50 cursor-not-allowed"
    );

    const hasSelection = this.selectedValues.length > 0;

    return html`
      <button
        part="base"
        type="button"
        class=${classes}
        ?disabled=${this.disabled}
        data-state=${this.isOpen ? "open" : "closed"}
        @click=${this._handleClick}
      >
        <div class="flex items-center min-h-6 flex-1 min-w-0">
          ${hasSelection
            ? html`
                <div
                  class="flex gap-1 mr-2 overflow-x-auto scrollbar-hide flex-nowrap flex-1 min-w-0"
                >
                  ${this.selectedValues.map(
                    (value) => html`
                      <div
                        class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md flex-shrink-0 max-w-[150px]"
                      >
                        <span class="truncate"
                          >${this._getDisplayText(value)}</span
                        >
                        <button
                          type="button"
                          class="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 flex-shrink-0"
                          @click=${(e: Event) => this._removeValue(e, value)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                    `
                  )}
                </div>
              `
            : html`<span class="text-muted-foreground">${placeholder}</span>`}
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          ${hasSelection && !this.disabled
            ? html`
                <button
                  type="button"
                  class="hover:bg-muted rounded-full p-1"
                  @click=${this._clearAll}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="opacity-50"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </button>
              `
            : ""}
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
        </div>
      </button>
    `;
  }

  private _getDisplayText(value: string): string {
    // Try to find the corresponding item to get its display text
    const items = this.parentElement?.querySelectorAll(
      "ecc-utils-design-multi-select-item"
    );
    if (items) {
      for (const item of Array.from(items)) {
        const itemElement = item as EccUtilsDesignMultiSelectItem;
        if (itemElement.value === value) {
          return itemElement.textContent?.trim() || value;
        }
      }
    }
    return value;
  }
}

/**
 * EccUtilsDesignMultiSelectContent - Content component for the multi-select
 *
 * @element ecc-utils-design-multi-select-content
 */
export class EccUtilsDesignMultiSelectContent extends LitElement {
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
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateInterval) {
      clearTimeout(this._updateInterval);
    }
  }

  private _updateInterval: number | undefined;

  private _getParentSelect(): EccUtilsDesignMultiSelect | null {
    return this.closest(
      "ecc-utils-design-multi-select"
    ) as EccUtilsDesignMultiSelect;
  }

  private _updateState() {
    const select = this._getParentSelect();
    if (select) {
      const selectId = select.getSelectId();
      const selectState = multiSelectState.get(selectId);
      if (selectState) {
        this.isOpen = selectState.isOpen;
      }
    }

    // Continue polling for state updates
    this._updateInterval = window.setTimeout(() => this._updateState(), 16);
  }

  render() {
    if (!this.isOpen) {
      return html``;
    }

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
 * EccUtilsDesignMultiSelectItem - Item component for the multi-select
 *
 * @element ecc-utils-design-multi-select-item
 */
export class EccUtilsDesignMultiSelectItem extends LitElement {
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
    this._updateState();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._updateInterval) {
      clearTimeout(this._updateInterval);
    }
  }

  private _updateInterval: number | undefined;

  private _getParentSelect(): EccUtilsDesignMultiSelect | null {
    return this.closest(
      "ecc-utils-design-multi-select"
    ) as EccUtilsDesignMultiSelect;
  }

  private _updateState() {
    const select = this._getParentSelect();
    if (select) {
      const selectId = select.getSelectId();
      const selectState = multiSelectState.get(selectId);
      if (selectState) {
        this.selected = selectState.selectedValues.includes(this.value);
      }
    }

    // Continue polling for state updates
    this._updateInterval = window.setTimeout(() => this._updateState(), 16);
  }

  private _handleSelect() {
    if (this.disabled) return;

    const select = this._getParentSelect();
    if (select) {
      const currentValues = [...select.value];
      let newValues: string[];

      if (this.selected) {
        // Remove from selection
        newValues = currentValues.filter((v) => v !== this.value);
      } else {
        // Add to selection
        newValues = [...currentValues, this.value];
      }

      select._handleSelect(newValues);
    }
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this._handleSelect();
    }
  }

  private _shouldShow(): boolean {
    return !this.disabled;
  }

  render() {
    if (!this._shouldShow()) {
      return html``;
    }

    const classes = cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      this.disabled && "opacity-50 pointer-events-none"
    );

    return html`
      <div
        part="base"
        class=${classes}
        role="option"
        aria-selected=${this.selected ? "true" : "false"}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @click=${this._handleSelect}
        @keydown=${this._handleKeyDown}
      >
        <ecc-utils-design-checkbox
          class="mr-2"
          .checked=${this.selected}
          .disabled=${this.disabled}
          @ecc-input-changed=${(e: Event) => {
            e.stopPropagation();
            this._handleSelect();
          }}
        ></ecc-utils-design-checkbox>
        <span class="flex-1"><slot></slot></span>
      </div>
    `;
  }
}

export default EccUtilsDesignMultiSelect;
