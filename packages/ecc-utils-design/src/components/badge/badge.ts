import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

type Variant = "default" | "secondary" | "destructive" | "outline";

// Utility function to combine class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Base styles for the badge
const baseBadgeStyles =
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

// Variant styles for the badge
const variantStyles: Record<Variant, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground",
};

// Size styles for the badge
const sizeStyles: Record<"sm" | "md" | "lg", string> = {
  sm: "text-[0.625rem]",
  md: "text-sm",
  lg: "text-base",
};

/**
 * EccUtilsDesignBadge - Badge component
 *
 * @element ecc-utils-design-badge
 */
export class EccUtilsDesignBadge extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: String }) variant: Variant = "default";
  // TODO: Remove this once we have a better way to handle styles
  @property({ type: String }) size: "sm" | "md" | "lg" = "md";

  render() {
    const classes = cn(
      baseBadgeStyles,
      variantStyles[this.variant],
      sizeStyles[this.size]
    );

    return html`
      <div part="base" class=${classes}>
        <slot></slot>
      </div>
    `;
  }
}

export default EccUtilsDesignBadge;
