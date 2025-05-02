import { LitElement, html, css } from "lit";
import { TWStyles as TailwindStyles } from "../../tailwind.js";
import { GlobalStyles } from "../../global.js";

// Utility function to combine class names
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * EccUtilsDesignCard - Main card container component
 *
 * @element ecc-utils-design-card
 */
export class EccUtilsDesignCard extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn("rounded-xl border bg-card text-card-foreground shadow");

    return html`<div part="base" class=${classes}><slot></slot></div>`;
  }
}

/**
 * EccUtilsDesignCardHeader - Card header component
 *
 * @element ecc-utils-design-card-header
 */
export class EccUtilsDesignCardHeader extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn("flex flex-col space-y-1.5 p-6");

    return html`<div class=${classes}><slot></slot></div>`;
  }
}

/**
 * EccUtilsDesignCardTitle - Card title component
 *
 * @element ecc-utils-design-card-title
 */
export class EccUtilsDesignCardTitle extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn("font-semibold leading-none tracking-tight");

    return html`<div class=${classes}><slot></slot></div>`;
  }
}

/**
 * EccUtilsDesignCardDescription - Card description component
 *
 * @element ecc-utils-design-card-description
 */
export class EccUtilsDesignCardDescription extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn("text-sm text-muted-foreground");

    return html`<div class=${classes}><slot></slot></div>`;
  }
}

/**
 * EccUtilsDesignCardContent - Card content component
 *
 * @element ecc-utils-design-card-content
 */
export class EccUtilsDesignCardContent extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn("p-6 pt-0");

    return html`<div class=${classes}><slot></slot></div>`;
  }
}

/**
 * EccUtilsDesignCardFooter - Card footer component
 *
 * @element ecc-utils-design-card-footer
 */
export class EccUtilsDesignCardFooter extends LitElement {
  static styles = [
    css`
      ${TailwindStyles}
    `,
    css`
      ${GlobalStyles}
    `,
    css`
      :host {
        display: block;
      }
    `,
  ];

  render() {
    const classes = cn("flex items-center p-6 pt-0");

    return html`<div class=${classes}><slot></slot></div>`;
  }
}

export default EccUtilsDesignCard;
