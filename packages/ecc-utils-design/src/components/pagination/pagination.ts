import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import "../button/index.js"; // Import the button component

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * EccUtilsDesignPagination - Root pagination component
 *
 * @element ecc-utils-design-pagination
 */
export class EccUtilsDesignPagination extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    const classes = cn("mx-auto flex w-full justify-center");

    return html`
      <nav
        part="base"
        role="navigation"
        aria-label="pagination"
        class=${classes}
      >
        <slot></slot>
      </nav>
    `;
  }
}

/**
 * EccUtilsDesignPaginationContent - Content component
 *
 * @element ecc-utils-design-pagination-content
 */
export class EccUtilsDesignPaginationContent extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    const classes = cn("flex flex-row items-center gap-1");

    return html`
      <div part="base" class=${classes}>
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignPaginationItem - Item component
 *
 * @element ecc-utils-design-pagination-item
 */
export class EccUtilsDesignPaginationItem extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    return html`
      <div part="base">
        <slot></slot>
      </div>
    `;
  }
}

/**
 * EccUtilsDesignPaginationLink - Link component
 *
 * @element ecc-utils-design-pagination-link
 */
export class EccUtilsDesignPaginationLink extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: Boolean }) isActive = false;
  @property({ type: String }) size: "default" | "sm" | "lg" | "icon" = "icon";
  @property({ type: String }) href = "#";

  render() {
    const variant = this.isActive ? "outline" : "ghost";
    const classes = cn();

    return html`
      <ecc-utils-design-button
        part="base"
        variant=${variant}
        size=${this.size}
        class=${classes}
        @click=${this._handleClick}
      >
        <slot></slot>
      </ecc-utils-design-button>
    `;
  }

  private _handleClick(e: Event) {
    if (this.href === "#") {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: {
            variant: "link",
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

/**
 * EccUtilsDesignPaginationPrevious - Previous button component
 *
 * @element ecc-utils-design-pagination-previous
 */
export class EccUtilsDesignPaginationPrevious extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: Boolean }) disabled = false;

  render() {
    const classes = cn("gap-1");

    return html`
      <ecc-utils-design-button
        part="base"
        variant="ghost"
        size="default"
        class=${classes}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
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
          class="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span>Previous</span>
      </ecc-utils-design-button>
    `;
  }

  private _handleClick() {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: {
            variant: "previous",
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

/**
 * EccUtilsDesignPaginationNext - Next button component
 *
 * @element ecc-utils-design-pagination-next
 */
export class EccUtilsDesignPaginationNext extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  @property({ type: Boolean }) disabled = false;

  render() {
    const classes = cn("gap-1");

    return html`
      <ecc-utils-design-button
        part="base"
        variant="ghost"
        size="default"
        class=${classes}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <span>Next</span>
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
          class="h-4 w-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </ecc-utils-design-button>
    `;
  }

  private _handleClick() {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("ecc-button-clicked", {
          detail: {
            variant: "next",
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }
}

/**
 * EccUtilsDesignPaginationEllipsis - Ellipsis component
 *
 * @element ecc-utils-design-pagination-ellipsis
 */
export class EccUtilsDesignPaginationEllipsis extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
  ];

  render() {
    const classes = cn("flex h-9 w-9 items-center justify-center");

    return html`
      <span part="base" aria-hidden="true" class=${classes}>
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
          class="h-4 w-4"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
        <span class="sr-only">More pages</span>
      </span>
    `;
  }
}

export default EccUtilsDesignPagination;
