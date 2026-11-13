import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export class EccUtilsDesignTextarea extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) placeholder = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Whether the value is invalid; also implied by a non-empty `error`.
   */
  @property({ type: Boolean, reflect: true }) invalid = false;
  /** Error message shown under the field, e.g. one returned by an API. */
  @property({ type: String }) error = "";
  @property({ type: Number }) rows = 3;
  @property({ type: Number }) cols?: number;

  render() {
    const isInvalid = this.invalid || !!this.error;
    const classes = cn(
      "flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      isInvalid
        ? "border-destructive focus-visible:ring-destructive"
        : "border-input focus-visible:ring-ring"
    );

    return html`
      <textarea
        part="base"
        class=${classes}
        placeholder=${this.placeholder}
        .value=${this.value}
        ?disabled=${this.disabled}
        aria-invalid=${ifDefined(isInvalid ? "true" : undefined)}
        aria-describedby=${ifDefined(this.error ? "error" : undefined)}
        rows=${this.rows}
        cols=${this.cols || ""}
        @input=${this._handleInput}
      ></textarea>
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
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;
    this.dispatchEvent(
      new CustomEvent("ecc-input-changed", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default EccUtilsDesignTextarea;
