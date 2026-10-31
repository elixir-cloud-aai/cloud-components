import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
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

/**
 * EccUtilsDesignInput - Input component
 *
 * @element ecc-utils-design-input
 */
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
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    const classes = cn(
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    );

    return html`
      <input
        type=${this.type}
        part="base"
        class=${classes}
        placeholder=${this.placeholder}
        .value=${this.value}
        ?disabled=${this.disabled}
        @input=${this._handleInput}
      />
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
