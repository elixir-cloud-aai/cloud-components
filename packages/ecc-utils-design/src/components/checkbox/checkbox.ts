import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export class EccUtilsDesignCheckbox extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  /**
   * Whether the value is invalid; also implied by a non-empty `error`.
   */
  @property({ type: Boolean, reflect: true }) invalid = false;
  /** Error message shown under the checkbox, e.g. one returned by an API. */
  @property({ type: String }) error = "";
  @state() private _focused = false;

  render() {
    const isInvalid = this.invalid || !!this.error;
    const checkboxClasses = cn(
      "peer h-4 w-4 shrink-0 rounded-[4px] border shadow focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      isInvalid
        ? "border-destructive focus-visible:ring-destructive"
        : "border-primary focus-visible:ring-ring",
      this.checked && "bg-primary text-primary-foreground",
      this._focused &&
        (isInvalid ? "ring-1 ring-destructive" : "ring-1 ring-ring")
    );

    const indicatorClasses = cn(
      "flex items-center justify-center text-current",
      !this.checked && "opacity-0"
    );

    // The message is positioned under the box without taking space, so
    // that it neither widens nor shifts the box next to its label
    return html`
      <div class="relative">
        <div
          part="base"
          class=${checkboxClasses}
          role="checkbox"
          aria-checked=${this.checked ? "true" : "false"}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-invalid=${ifDefined(isInvalid ? "true" : undefined)}
          aria-describedby=${ifDefined(this.error ? "error" : undefined)}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this._handleClick}
          @keydown=${this._handleKeydown}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
        >
          <div class=${indicatorClasses}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
          </div>
        </div>
        <p
          id="error"
          part="error"
          class=${cn(
            "pointer-events-none absolute left-0 top-full whitespace-nowrap text-sm text-destructive",
            !!this.error && "mt-1.5"
          )}
          aria-live="polite"
        >
          ${this.error}
        </p>
      </div>
    `;
  }

  private _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this._toggle();
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this._toggle();
    }
  }

  private _handleFocus() {
    this._focused = true;
  }

  private _handleBlur() {
    this._focused = false;
  }

  private _toggle() {
    const oldValue = this.checked;
    this.checked = !this.checked;

    // Dispatch change event
    this.dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      })
    );

    // Request update to trigger re-render
    this.requestUpdate("checked", oldValue);
  }
}

export default EccUtilsDesignCheckbox;
