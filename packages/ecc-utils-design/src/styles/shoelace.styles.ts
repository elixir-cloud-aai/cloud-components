import { css } from "lit";

const sholelaceStyles = css`
  :root,
  :host,
  .sl-theme-light {
    --sl-color-primary-50: var(--ecc-color-primary-50);
    --sl-color-primary-100: var(--ecc-color-primary-100);
    --sl-color-primary-200: var(--ecc-color-primary-200);
    --sl-color-primary-300: var(--ecc-color-primary-300);
    --sl-color-primary-400: var(--ecc-color-primary-400);
    --sl-color-primary-500: var(--ecc-color-primary-500);
    --sl-color-primary-600: var(--ecc-color-primary-600);
    --sl-color-primary-700: var(--ecc-color-primary-700);
    --sl-color-primary-800: var(--ecc-color-primary-800);
    --sl-color-primary-900: var(--ecc-color-primary-900);
    --sl-color-primary-950: var(--ecc-color-primary-950);

    --sl-color-success-50: var(--ecc-color-success-50);
    --sl-color-success-100: var(--ecc-color-success-100);
    --sl-color-success-200: var(--ecc-color-success-200);
    --sl-color-success-300: var(--ecc-color-success-300);
    --sl-color-success-400: var(--ecc-color-success-400);
    --sl-color-success-500: var(--ecc-color-success-500);
    --sl-color-success-600: var(--ecc-color-success-600);
    --sl-color-success-700: var(--ecc-color-success-700);
    --sl-color-success-800: var(--ecc-color-success-800);
    --sl-color-success-900: var(--ecc-color-success-900);
    --sl-color-success-950: var(--ecc-color-success-950);

    --sl-color-warning-50: var(--ecc-color-warning-50);
    --sl-color-warning-100: var(--ecc-color-warning-100);
    --sl-color-warning-200: var(--ecc-color-warning-200);
    --sl-color-warning-300: var(--ecc-color-warning-300);
    --sl-color-warning-400: var(--ecc-color-warning-400);
    --sl-color-warning-500: var(--ecc-color-warning-500);
    --sl-color-warning-600: var(--ecc-color-warning-600);
    --sl-color-warning-700: var(--ecc-color-warning-700);
    --sl-color-warning-800: var(--ecc-color-warning-800);
    --sl-color-warning-900: var(--ecc-color-warning-900);
    --sl-color-warning-950: var(--ecc-color-warning-950);

    --sl-color-danger-50: var(--ecc-color-danger-50);
    --sl-color-danger-100: var(--ecc-color-danger-100);
    --sl-color-danger-200: var(--ecc-color-danger-200);
    --sl-color-danger-300: var(--ecc-color-danger-300);
    --sl-color-danger-400: var(--ecc-color-danger-400);
    --sl-color-danger-500: var(--ecc-color-danger-500);
    --sl-color-danger-600: var(--ecc-color-danger-600);
    --sl-color-danger-700: var(--ecc-color-danger-700);
    --sl-color-danger-800: var(--ecc-color-danger-800);
    --sl-color-danger-900: var(--ecc-color-danger-900);
    --sl-color-danger-950: var(--ecc-color-danger-950);

    --sl-color-neutral-50: var(--ecc-color-neutral-50);
    --sl-color-neutral-100: var(--ecc-color-neutral-100);
    --sl-color-neutral-200: var(--ecc-color-neutral-200);
    --sl-color-neutral-300: var(--ecc-color-neutral-300);
    --sl-color-neutral-400: var(--ecc-color-neutral-400);
    --sl-color-neutral-500: var(--ecc-color-neutral-500);
    --sl-color-neutral-600: var(--ecc-color-neutral-600);
    --sl-color-neutral-700: var(--ecc-color-neutral-700);
    --sl-color-neutral-800: var(--ecc-color-neutral-800);
    --sl-color-neutral-900: var(--ecc-color-neutral-900);
    --sl-color-neutral-950: var(--ecc-color-neutral-950);

    --sl-color-neutral-0: var(--ecc-color-neutral-0);
    --sl-color-neutral-1000: var(--ecc-color-neutral-1000);

    --sl-border-radius-small: var(--ecc-border-radius-small);
    --sl-border-radius-medium: var(--ecc-border-radius-medium);
    --sl-border-radius-large: var(--ecc-border-radius-large);
    --sl-border-radius-x-large: var(--ecc-border-radius-x-large);

    --sl-border-radius-circle: var(--ecc-radius-circle);
    --sl-border-radius-pill: var(--ecc-radius-full);

    --sl-shadow-x-small: var(--ecc-shadow-x-small);
    --sl-shadow-small: var(--ecc-shadow-small);
    --sl-shadow-medium: var(--ecc-shadow-medium);
    --sl-shadow-large: var(--ecc-shadow-large);
    --sl-shadow-x-large: var(--ecc-shadow-x-large);

    --sl-spacing-3x-small: var(--ecc-spacing-3x-small);
    --sl-spacing-2x-small: var(--ecc-spacing-2x-small);
    --sl-spacing-x-small: var(--ecc-spacing-x-small);
    --sl-spacing-small: var(--ecc-spacing-small);
    --sl-spacing-medium: var(--ecc-spacing-medium);
    --sl-spacing-large: var(--ecc-spacing-large);
    --sl-spacing-x-large: var(--ecc-spacing-x-large);
    --sl-spacing-2x-large: var(--ecc-spacing-2x-large);
    --sl-spacing-3x-large: var(--ecc-spacing-3x-large);
    --sl-spacing-4x-large: var(--ecc-spacing-4x-large);

    --sl-transition-x-slow: var(--ecc-transition-x-slow);
    --sl-transition-slow: var(--ecc-transition-slow);
    --sl-transition-medium: var(--ecc-transition-medium);
    --sl-transition-fast: var(--ecc-transition-fast);
    --sl-transition-x-fast: var(--ecc-transition-x-fast);

    --sl-font-mono: var(--ecc-font-mono);
    --sl-font-sans: var(--ecc-font-sans);
    --sl-font-serif: var(--ecc-font-serif);

    --sl-font-size-2x-small: var(--ecc-font-size-2x-small);
    --sl-font-size-x-small: var(--ecc-font-size-x-small);
    --sl-font-size-small: var(--ecc-font-size-small);
    --sl-font-size-medium: var(--ecc-font-size-medium);
    --sl-font-size-large: var(--ecc-font-size-large);
    --sl-font-size-x-large: var(--ecc-font-size-x-large);
    --sl-font-size-2x-large: var(--ecc-font-size-2x-large);
    --sl-font-size-3x-large: var(--ecc-font-size-3x-large);
    --sl-font-size-4x-large: var(--ecc-font-size-4x-large);

    --sl-font-weight-light: var(--ecc-font-weight-light);
    --sl-font-weight-normal: var(--ecc-font-weight-normal);
    --sl-font-weight-semibold: var(--ecc-font-weight-semibold);
    --sl-font-weight-bold: var(--ecc-font-weight-bold);

    --sl-letter-spacing-denser: var(--ecc-letter-spacing-denser);
    --sl-letter-spacing-dense: var(--ecc-letter-spacing-dense);
    --sl-letter-spacing-normal: var(--ecc-letter-spacing-normal);
    --sl-letter-spacing-loose: var(--ecc-letter-spacing-loose);
    --sl-letter-spacing-looser: var(--ecc-letter-spacing-looser);

    --sl-line-height-denser: var(--ecc-line-height-denser);
    --sl-line-height-dense: var(--ecc-line-height-dense);
    --sl-line-height-normal: var(--ecc-line-height-normal);
    --sl-line-height-loose: var(--ecc-line-height-loose);
    --sl-line-height-looser: var(--ecc-line-height-looser);

    --sl-focus-ring-color: var(--ecc-focus-ring-color);
    --sl-focus-ring-style: var(--ecc-focus-ring-style);
    --sl-focus-ring-width: var(--ecc-focus-ring-width);
    --sl-focus-ring: var(--ecc-focus-ring);
    --sl-focus-ring-offset: var(--ecc-focus-ring-offset);

    --sl-button-font-size-small: var(--ecc-button-font-size-small);
    --sl-button-font-size-medium: var(--ecc-button-font-size-medium);
    --sl-button-font-size-large: var(--ecc-button-font-size-large);

    --sl-input-height-small: var(--ecc-input-height-small);
    --sl-input-height-medium: var(--ecc-input-height-medium);
    --sl-input-height-large: var(--ecc-input-height-large);

    --sl-input-background-color: var(--ecc-input-background-color);
    --sl-input-background-color-hover: var(--ecc-input-background-color-hover);
    --sl-input-background-color-focus: var(--ecc-input-background-color-focus);
    --sl-input-background-color-disabled: var(
      --ecc-input-background-color-disabled
    );
    --sl-input-border-color: var(--ecc-input-border-color);
    --sl-input-border-color-hover: var(--ecc-input-border-color-hover);
    --sl-input-border-color-focus: var(--ecc-input-border-color-focus);
    --sl-input-border-color-disabled: var(--ecc-input-border-color-disabled);
    --sl-input-border-width: var(--ecc-input-border-width);
    --sl-input-required-content: var(--ecc-input-required-content);
    --sl-input-required-content-offset: var(
      --ecc-input-required-content-offset
    );
    --sl-input-required-content-color: var(--ecc-input-required-content-color);

    --sl-input-border-radius-small: var(--ecc-input-border-radius-small);
    --sl-input-border-radius-medium: var(--ecc-input-border-radius-medium);
    --sl-input-border-radius-large: var(--ecc-input-border-radius-large);

    --sl-input-font-family: var(--ecc-input-font-family);
    --sl-input-font-weight: var(--ecc-input-font-weight);
    --sl-input-font-size-small: var(--ecc-input-font-size-small);
    --sl-input-font-size-medium: var(--ecc-input-font-size-medium);
    --sl-input-font-size-large: var(--ecc-input-font-size-large);
    --sl-input-letter-spacing: var(--ecc-input-letter-spacing);

    --sl-input-color: var(--ecc-input-color);
    --sl-input-color-hover: var(--ecc-input-color-hover);
    --sl-input-color-focus: var(--ecc-input-color-focus);
    --sl-input-color-disabled: var(--ecc-input-color-disabled);
    --sl-input-icon-color: var(--ecc-input-icon-color);
    --sl-input-icon-color-hover: var(--ecc-input-icon-color-hover);
    --sl-input-icon-color-focus: var(--ecc-input-icon-color-focus);
    --sl-input-placeholder-color: var(--ecc-input-placeholder-color);
    --sl-input-placeholder-color-disabled: var(
      --ecc-input-placeholder-color-disabled
    );
    --sl-input-spacing-small: var(--ecc-input-spacing-small);
    --sl-input-spacing-medium: var(--ecc-input-spacing-medium);
    --sl-input-spacing-large: var(--ecc-input-spacing-large);

    --sl-input-focus-ring-color: var(--ecc-input-focus-ring-color);
    --sl-input-focus-ring-offset: var(--ecc-input-focus-ring-offset);

    --sl-input-filled-background-color: var(
      --ecc-input-filled-background-color
    );
    --sl-input-filled-background-color-hover: var(
      --ecc-input-filled-background-color-hover
    );
    --sl-input-filled-background-color-focus: var(
      --ecc-input-filled-background-color-focus
    );
    --sl-input-filled-background-color-disabled: var(
      --ecc-input-filled-background-color-disabled
    );
    --sl-input-filled-color: var(--ecc-input-filled-color);
    --sl-input-filled-color-hover: var(--ecc-input-filled-color-hover);
    --sl-input-filled-color-focus: var(--ecc-input-filled-color-focus);
    --sl-input-filled-color-disabled: var(--ecc-input-filled-color-disabled);

    --sl-input-label-font-size-small: var(--ecc-input-label-font-size-small);
    --sl-input-label-font-size-medium: var(--ecc-input-label-font-size-medium);
    --sl-input-label-font-size-large: var(--ecc-input-label-font-size-large);
    --sl-input-label-color: var(--ecc-input-label-color);

    --sl-input-help-text-font-size-small: var(
      --ecc-input-help-text-font-size-small
    );
    --sl-input-help-text-font-size-medium: var(
      --ecc-input-help-text-font-size-medium
    );
    --sl-input-help-text-font-size-large: var(
      --ecc-input-help-text-font-size-large
    );
    --sl-input-help-text-color: var(--ecc-input-help-text-color);

    --sl-toggle-size-small: var(--ecc-toggle-size-small);
    --sl-toggle-size-medium: var(--ecc-toggle-size-medium);
    --sl-toggle-size-large: var(--ecc-toggle-size-large);

    --sl-overlay-background-color: var(--ecc-overlay-background-color);

    --sl-panel-background-color: var(--ecc-panel-background-color);
    --sl-panel-border-color: var(--ecc-panel-border-color);
    --sl-panel-border-width: var(--ecc-panel-border-width);

    --sl-tooltip-border-radius: var(--ecc-tooltip-border-radius);
    --sl-tooltip-background-color: var(--ecc-tooltip-background-color);
    --sl-tooltip-color: var(--ecc-tooltip-color);
    --sl-tooltip-font-family: var(--ecc-tooltip-font-family);
    --sl-tooltip-font-weight: var(--ecc-tooltip-font-weight);
    --sl-tooltip-font-size: var(--ecc-tooltip-font-size);
    --sl-tooltip-line-height: var(--ecc-tooltip-line-height);
    --sl-tooltip-padding: var(--ecc-tooltip-padding);
    --sl-tooltip-arrow-size: var(--ecc-tooltip-arrow-size);

    --sl-z-index-drawer: var(--ecc-z-index-drawer);
    --sl-z-index-dialog: var(--ecc-z-index-dialog);
    --sl-z-index-dropdown: var(--ecc-z-index-dropdown);
    --sl-z-index-toast: var(--ecc-z-index-toast);
    --sl-z-index-tooltip: var(--ecc-z-index-tooltip);
  }

  .sl-scroll-lock {
    padding-right: var(--sl-scroll-lock-size) !important;
    overflow: hidden !important;
  }

  .sl-toast-stack {
    position: fixed;
    top: 0;
    inset-inline-end: 0;
    z-index: var(--sl-z-index-toast);
    width: 28rem;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
  }

  .sl-toast-stack sl-alert {
    margin: var(--sl-spacing-medium);
  }

  .sl-toast-stack sl-alert::part(base) {
    box-shadow: var(--sl-shadow-large);
  }
`;

export default sholelaceStyles;
