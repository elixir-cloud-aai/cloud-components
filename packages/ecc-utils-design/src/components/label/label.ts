import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * EccUtilsDesignLabel - Label component
 *
 * @element ecc-utils-design-label
 */
export class EccUtilsDesignLabel extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) for = "";
  @property({ type: Boolean }) disabled = false;

  render() {
    const classes = cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      this.disabled && "cursor-not-allowed opacity-70"
    );

    return html`
      <label
        part="base"
        class=${classes}
        for=${this.for}
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </label>
    `;
  }
}

export default EccUtilsDesignLabel;
