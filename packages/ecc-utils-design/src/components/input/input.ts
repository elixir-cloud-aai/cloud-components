import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week"
  | "color"
  | "file"
  | "range";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export class EccUtilsDesignInput extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) type: InputType = "text";
  @property({ type: String }) placeholder = "";
  /** Accessible name for the native control (forwarded as aria-label) */
  @property({ type: String }) label?: string;
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Whether the value is invalid; also implied by a non-empty `error`.
   */
  @property({ type: Boolean, reflect: true }) invalid = false;
  /** Error message shown under the field, e.g. one returned by an API. */
  @property({ type: String }) error = "";

  render() {
    const isInvalid = this.invalid || !!this.error;
    const classes = cn(
      "flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      isInvalid
        ? "border-destructive focus-visible:ring-destructive"
        : "border-input focus-visible:ring-ring"
    );

    return html`
      <input
        aria-label=${ifDefined(this.label || undefined)}
        type=${this.type}
        part="base"
        class=${classes}
        placeholder=${this.placeholder}
        .value=${this.value}
        ?disabled=${this.disabled}
        aria-invalid=${ifDefined(isInvalid ? "true" : undefined)}
        aria-describedby=${ifDefined(this.error ? "error" : undefined)}
        @input=${this._handleInput}
      />
      <p
        id="error"
        part="error"
        class=${cn("text-sm text-destructive", !!this.error && "mt-1.5")}
        aria-live="polite"
      >
        ${this.error}
      </p>
    `;
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default EccUtilsDesignInput;
