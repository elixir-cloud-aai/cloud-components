import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

// Utility function to combine class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * @summary A separator component that visually or semantically separates content
 * @since 1.0.0
 *
 * @element ecc-utils-design-separator
 *
 * @csspart base - The component's base wrapper
 *
 * @slot - Default slot
 */
export class EccUtilsDesignSeparator extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  /**
   * The orientation of the separator.
   */
  @property({ type: String }) orientation: "horizontal" | "vertical" =
    "horizontal";

  /**
   * Whether the separator is decorative or semantically separates content.
   */
  @property({ type: Boolean }) decorative = true;

  render() {
    const classes = cn(
      "shrink-0 bg-border",
      this.orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
    );

    return html`
      <div
        part="base"
        class=${classes}
        role=${this.decorative ? "none" : "separator"}
        aria-orientation=${ifDefined(
          this.decorative ? undefined : this.orientation
        )}
      ></div>
    `;
  }
}

export default EccUtilsDesignSeparator;
