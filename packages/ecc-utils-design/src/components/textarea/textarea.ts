import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
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
  @property({ type: Number }) rows = 3;
  @property({ type: Number }) cols?: number;

  render() {
    const classes = cn(
      "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
    );

    return html`
      <textarea
        part="base"
        class=${classes}
        placeholder=${this.placeholder}
        .value=${this.value}
        ?disabled=${this.disabled}
        rows=${this.rows}
        cols=${this.cols || ""}
        @input=${this._handleInput}
      ></textarea>
    `;
  }

  private _handleInput(e: Event) {
    const textarea = e.target as HTMLTextAreaElement;
    this.value = textarea.value;
    this.dispatchEvent(
      new CustomEvent("ecc-utils-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export default EccUtilsDesignTextarea;
