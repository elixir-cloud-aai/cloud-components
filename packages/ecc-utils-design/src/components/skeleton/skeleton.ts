import { LitElement, html, css } from "lit";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";

// Utility function to combine class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * EccUtilsDesignSkeleton - Skeleton component for loading states
 *
 * The Skeleton component is used to show a placeholder preview of content before
 * the data gets loaded to reduce load-time frustration.
 *
 * @element ecc-utils-design-skeleton
 *
 * @attr {string} class - Additional CSS classes to apply to the skeleton
 *
 * @example
 * ```html
 * <!-- Basic usage -->
 * <ecc-utils-design-skeleton class="w-[100px] h-[20px] rounded-full"></ecc-utils-design-skeleton>
 *
 * <!-- Card skeleton -->
 * <div class="card">
 *   <ecc-utils-design-skeleton class="h-32 w-full"></ecc-utils-design-skeleton>
 *   <ecc-utils-design-skeleton class="h-4 w-3/4 mt-2"></ecc-utils-design-skeleton>
 *   <ecc-utils-design-skeleton class="h-3 w-1/2 mt-1"></ecc-utils-design-skeleton>
 * </div>
 *
 * <!-- Custom color -->
 * <ecc-utils-design-skeleton class="h-10 w-full bg-blue-200"></ecc-utils-design-skeleton>
 * ```
 */
export class EccUtilsDesignSkeleton extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  /**
   * Additional CSS classes to apply to the skeleton
   * Use this to customize the appearance (width, height, color, etc.)
   */

  render() {
    const classes = cn("animate-pulse rounded-md bg-primary/10");

    return html`
      <div part="base" class=${classes}>
        <slot></slot>
      </div>
    `;
  }
}

export default EccUtilsDesignSkeleton;
