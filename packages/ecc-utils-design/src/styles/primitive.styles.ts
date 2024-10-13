import { css } from "lit";

/* TODO: Need to be translated to new tokens:

--ecc-color-brand-faint: var(--ecc-color-blue-50);
--ecc-color-brand-muted: var(--ecc-color-blue-100);
--ecc-color-brand-subtle: var(--ecc-color-blue-300);
--ecc-color-brand-primary: var(--ecc-color-blue-500);
--ecc-color-brand-emphasis: var(--ecc-color-blue-700);
--ecc-color-brand-strong: var(--ecc-color-blue-900);

--ecc-color-background-subtle: var(--ecc-color-neutral-50);
--ecc-color-background-base: var(--ecc-color-neutral-100);
--ecc-color-background-emphasis: var(--ecc-color-neutral-200);

--ecc-color-border-base: var(--ecc-color-neutral-300);

--ecc-color-status-success: var(--ecc-color-green-500);
--ecc-color-status-danger: var(--ecc-color-red-500);
--ecc-color-status-warning: var(--ecc-color-yellow-500);
--ecc-color-status-neutral: var(--ecc-color-neutral-500);

--ecc-color-content-subtle: var(--ecc-color-neutral-700);
--ecc-color-content-base: var(--ecc-color-neutral-800);
--ecc-color-content-emphasis: var(--ecc-color-neutral-900);
--ecc-color-content-strong: var(--ecc-color-black);

--ecc-spacing-4xs: 0.125rem;
--ecc-spacing-3xs: 0.25rem;
--ecc-spacing-2xs: 0.5rem;
--ecc-spacing-xs: 0.75rem;
--ecc-spacing-s: 1rem;
--ecc-spacing-m: 1.5rem;
--ecc-spacing-l: 2rem;
--ecc-spacing-xl: 3rem;
--ecc-spacing-2xl: 4rem;
--ecc-spacing-3xl: 6rem;
--ecc-spacing-4xl: 8rem;

--ecc-elevation-sunken: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--ecc-elevation-default: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
--ecc-elevation-raised: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
--ecc-elevation-overlay: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
--ecc-elevation-overflow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);

--ecc-radius-small: 0.125rem;
--ecc-radius-medium: 0.25rem;
--ecc-radius-large: 0.5rem;
--ecc-radius-circle: 50%;
--ecc-radius-full: 9999px;

*/

const primitiveStylesheet = css`
  :root,
  :host,
  .light {
    /* Low Level Tokens */

    --ecc-color-primary-50: hsl(from var(--ecc-color-brand-internal) h s 95%);
    --ecc-color-primary-100: hsl(from var(--ecc-color-brand-internal) h s 90%);
    --ecc-color-primary-200: hsl(from var(--ecc-color-brand-internal) h s 80%);
    --ecc-color-primary-300: hsl(from var(--ecc-color-brand-internal) h s 70%);
    --ecc-color-primary-400: hsl(from var(--ecc-color-brand-internal) h s 60%);
    --ecc-color-primary-500: hsl(from var(--ecc-color-brand-internal) h s 50%);
    --ecc-color-primary-600: hsl(from var(--ecc-color-brand-internal) h s 40%);
    --ecc-color-primary-700: hsl(from var(--ecc-color-brand-internal) h s 30%);
    --ecc-color-primary-800: hsl(from var(--ecc-color-brand-internal) h s 20%);
    --ecc-color-primary-900: hsl(from var(--ecc-color-brand-internal) h s 10%);
    --ecc-color-primary-950: hsl(from var(--ecc-color-brand-internal) h s 5%);

    --ecc-color-success-50: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 0.1)
    );
    --ecc-color-success-100: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 0.2)
    );
    --ecc-color-success-200: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 0.4)
    );
    --ecc-color-success-300: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 0.6)
    );
    --ecc-color-success-400: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 0.8)
    );
    --ecc-color-success-500: var(--ecc-color-success-internal);
    --ecc-color-success-600: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 1.2)
    );
    --ecc-color-success-700: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 1.4)
    );
    --ecc-color-success-800: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 1.6)
    );
    --ecc-color-success-900: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 1.8)
    );
    --ecc-color-success-950: hsl(
      from var(--ecc-color-success-internal) h s calc(l / 1.9)
    );

    --ecc-color-warning-50: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 0.1)
    );
    --ecc-color-warning-100: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 0.2)
    );
    --ecc-color-warning-200: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 0.4)
    );
    --ecc-color-warning-300: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 0.6)
    );
    --ecc-color-warning-400: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 0.8)
    );
    --ecc-color-warning-500: var(--ecc-color-warning-internal);
    --ecc-color-warning-600: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 1.2)
    );
    --ecc-color-warning-700: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 1.4)
    );
    --ecc-color-warning-800: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 1.6)
    );
    --ecc-color-warning-900: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 1.8)
    );
    --ecc-color-warning-950: hsl(
      from var(--ecc-color-warning-internal) h s calc(l / 1.9)
    );

    --ecc-color-danger-50: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 0.1)
    );
    --ecc-color-danger-100: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 0.2)
    );
    --ecc-color-danger-200: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 0.4)
    );
    --ecc-color-danger-300: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 0.6)
    );
    --ecc-color-danger-400: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 0.8)
    );
    --ecc-color-danger-500: var(--ecc-color-danger-internal);
    --ecc-color-danger-600: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 1.2)
    );
    --ecc-color-danger-700: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 1.4)
    );
    --ecc-color-danger-800: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 1.6)
    );
    --ecc-color-danger-900: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 1.8)
    );
    --ecc-color-danger-950: hsl(
      from var(--ecc-color-danger-internal) h s calc(l / 1.9)
    );

    --ecc-color-neutral-50: hsl(from var(--ecc-color-neutral-internal) h s 95%);
    --ecc-color-neutral-100: hsl(
      from var(--ecc-color-neutral-internal) h s 90%
    );
    --ecc-color-neutral-200: hsl(
      from var(--ecc-color-neutral-internal) h s 80%
    );
    --ecc-color-neutral-300: hsl(
      from var(--ecc-color-neutral-internal) h s 70%
    );
    --ecc-color-neutral-400: hsl(
      from var(--ecc-color-neutral-internal) h s 60%
    );
    --ecc-color-neutral-500: hsl(
      from var(--ecc-color-neutral-internal) h s 50%
    );
    --ecc-color-neutral-600: hsl(
      from var(--ecc-color-neutral-internal) h s 40%
    );
    --ecc-color-neutral-700: hsl(
      from var(--ecc-color-neutral-internal) h s 30%
    );
    --ecc-color-neutral-800: hsl(
      from var(--ecc-color-neutral-internal) h s 20%
    );
    --ecc-color-neutral-900: hsl(
      from var(--ecc-color-neutral-internal) h s 10%
    );
    --ecc-color-neutral-950: hsl(from var(--ecc-color-neutral-internal) h s 5%);

    --ecc-color-neutral-0: hsl(0, 0%, 100%);
    --ecc-color-neutral-1000: hsl(0, 0%, 0%);

    --ecc-border-radius-small: calc(var(--ecc-corner-internal) / 2);
    --ecc-border-radius-medium: var(--ecc-corner-internal);
    --ecc-border-radius-large: calc(var(--ecc-corner-internal) * 2);
    --ecc-border-radius-x-large: calc(var(--ecc-corner-internal) * 4);

    --ecc-border-radius-circle: 50%;
    --ecc-border-radius-pill: 9999px;

    --ecc-shadow-x-small: 0 1px calc(var(--ecc-corner-internal) / 4)
      calc(0.25px * var(--ecc-depth-internal))
      hsl(from var(--ecc-color-neutral) h s l / 10%);
    --ecc-shadow-small: 0 1px calc(var(--ecc-corner-internal) / 2)
      calc(0.5px * var(--ecc-depth-internal))
      hsl(from var(--ecc-color-neutral) h s l / 20%);
    --ecc-shadow-medium: 0 2px calc(var(--ecc-corner-internal))
      calc(1px * var(--ecc-depth-internal))
      hsl(from var(--ecc-color-neutral) h s l / 20%);
    --ecc-shadow-large: 0 2px calc(var(--ecc-corner-internal) * 2)
      calc(2px * var(--ecc-depth-internal))
      hsl(from var(--ecc-color-neutral) h s l / 20%);
    --ecc-shadow-x-large: 0 4px calc(var(--ecc-corner-internal) * 4)
      calc(4px * var(--ecc-depth-internal))
      hsl(from var(--ecc-color-neutral) h s l / 20%);

    --ecc-spacing-3x-small: calc(var(--ecc-density-internal) * 0.125);
    --ecc-spacing-2x-small: calc(var(--ecc-density-internal) * 0.25);
    --ecc-spacing-x-small: calc(var(--ecc-density-internal) * 0.5);
    --ecc-spacing-small: calc(var(--ecc-density-internal) * 0.75);
    --ecc-spacing-medium: calc(var(--ecc-density-internal) * 1);
    --ecc-spacing-large: calc(var(--ecc-density-internal) * 1.25);
    --ecc-spacing-x-large: calc(var(--ecc-density-internal) * 1.75);
    --ecc-spacing-2x-large: calc(var(--ecc-density-internal) * 2.25);
    --ecc-spacing-3x-large: calc(var(--ecc-density-internal) * 3);
    --ecc-spacing-4x-large: calc(var(--ecc-density-internal) * 4);

    --ecc-transition-x-slow: calc(var(--ecc-motion-internal) * 4);
    --ecc-transition-slow: calc(var(--ecc-motion-internal) * 2);
    --ecc-transition-medium: var(--ecc-motion-internal);
    --ecc-transition-fast: calc(var(--ecc-motion-internal) / 2);
    --ecc-transition-x-fast: calc(var(--ecc-motion-internal) / 4);

    --ecc-font-mono: SFMono-Regular, Consolas, "Liberation Mono", Menlo,
      monospace;
    --ecc-font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol";
    --ecc-font-serif: Georgia, "Times New Roman", serif;

    --ecc-font-size-2x-small: calc(var(--ecc-motion-internal) * 0.625);
    --ecc-font-size-x-small: calc(var(--ecc-motion-internal) * 0.75);
    --ecc-font-size-small: calc(var(--ecc-font-size-internal) * 0.875);
    --ecc-font-size-medium: var(--ecc-font-size-internal);
    --ecc-font-size-large: calc(var(--ecc-font-size-internal) * 1.25);
    --ecc-font-size-x-large: calc(var(--ecc-font-size-internal) * 1.5);
    --ecc-font-size-2x-large: calc(var(--ecc-font-size-internal) * 2.25);
    --ecc-font-size-3x-large: calc(var(--ecc-font-size-internal) * 3);
    --ecc-font-size-4x-large: calc(var(--ecc-font-size-internal) * 4.5);

    --ecc-font-weight-light: 300;
    --ecc-font-weight-normal: 400;
    --ecc-font-weight-semibold: 500;
    --ecc-font-weight-bold: 700;

    --ecc-letter-spacing-denser: -0.03em;
    --ecc-letter-spacing-dense: -0.015em;
    --ecc-letter-spacing-normal: normal;
    --ecc-letter-spacing-loose: 0.075em;
    --ecc-letter-spacing-looser: 0.15em;

    --ecc-line-height-denser: 1;
    --ecc-line-height-dense: 1.4;
    --ecc-line-height-normal: 1.8;
    --ecc-line-height-loose: 2.2;
    --ecc-line-height-looser: 2.6;

    --ecc-focus-ring-color: var(--ecc-color-primary-600);
    --ecc-focus-ring-style: solid;
    --ecc-focus-ring-width: 3px;
    --ecc-focus-ring: var(--ecc-focus-ring-style) var(--ecc-focus-ring-width)
      var(--ecc-focus-ring-color);
    --ecc-focus-ring-offset: 1px;

    --ecc-button-font-size-small: var(--ecc-font-size-x-small);
    --ecc-button-font-size-medium: var(--ecc-font-size-small);
    --ecc-button-font-size-large: var(--ecc-font-size-medium);

    --ecc-input-height-small: calc(var(--ecc-sizing-internal) * 1.875);
    --ecc-input-height-medium: calc(var(--ecc-sizing-internal) * 2.5);
    --ecc-input-height-large: calc(var(--ecc-sizing-internal) * 3.125);

    --ecc-input-background-color: var(--ecc-color-neutral-0);
    --ecc-input-background-color-hover: var(--ecc-input-background-color);
    --ecc-input-background-color-focus: var(--ecc-input-background-color);
    --ecc-input-background-color-disabled: var(--ecc-color-neutral-100);
    --ecc-input-border-color: var(--ecc-color-neutral-300);
    --ecc-input-border-color-hover: var(--ecc-color-neutral-400);
    --ecc-input-border-color-focus: var(--ecc-color-primary-500);
    --ecc-input-border-color-disabled: var(--ecc-color-neutral-200);
    --ecc-input-border-width: 1px;
    --ecc-input-required-content: "*";
    --ecc-input-required-content-offset: -2px;
    --ecc-input-required-content-color: var(--ecc-input-label-color);

    --ecc-input-border-radius-small: var(--ecc-border-radius-medium);
    --ecc-input-border-radius-medium: var(--ecc-border-radius-medium);
    --ecc-input-border-radius-large: var(--ecc-border-radius-medium);

    --ecc-input-font-family: var(--ecc-font-sans);
    --ecc-input-font-weight: var(--ecc-font-weight-normal);
    --ecc-input-font-size-small: var(--ecc-font-size-small);
    --ecc-input-font-size-medium: var(--ecc-font-size-medium);
    --ecc-input-font-size-large: var(--ecc-font-size-large);
    --ecc-input-letter-spacing: var(--ecc-letter-spacing-normal);

    --ecc-input-color: var(--ecc-color-neutral-700);
    --ecc-input-color-hover: var(--ecc-color-neutral-700);
    --ecc-input-color-focus: var(--ecc-color-neutral-700);
    --ecc-input-color-disabled: var(--ecc-color-neutral-900);
    --ecc-input-icon-color: var(--ecc-color-neutral-500);
    --ecc-input-icon-color-hover: var(--ecc-color-neutral-600);
    --ecc-input-icon-color-focus: var(--ecc-color-neutral-600);
    --ecc-input-placeholder-color: var(--ecc-color-neutral-500);
    --ecc-input-placeholder-color-disabled: var(--ecc-color-neutral-600);
    --ecc-input-spacing-small: var(--ecc-spacing-small);
    --ecc-input-spacing-medium: var(--ecc-spacing-medium);
    --ecc-input-spacing-large: var(--ecc-spacing-large);

    --ecc-input-focus-ring-color: hsl(198.6 88.7% 48.4% / 40%);
    --ecc-input-focus-ring-offset: 0;

    --ecc-input-filled-background-color: var(--ecc-color-neutral-100);
    --ecc-input-filled-background-color-hover: var(--ecc-color-neutral-100);
    --ecc-input-filled-background-color-focus: var(--ecc-color-neutral-100);
    --ecc-input-filled-background-color-disabled: var(--ecc-color-neutral-100);
    --ecc-input-filled-color: var(--ecc-color-neutral-800);
    --ecc-input-filled-color-hover: var(--ecc-color-neutral-800);
    --ecc-input-filled-color-focus: var(--ecc-color-neutral-700);
    --ecc-input-filled-color-disabled: var(--ecc-color-neutral-800);

    --ecc-input-label-font-size-small: var(--ecc-font-size-small);
    --ecc-input-label-font-size-medium: var(--ecc-font-size-medium);
    --ecc-input-label-font-size-large: var(--ecc-font-size-large);
    --ecc-input-label-color: inherit;

    --ecc-input-help-text-font-size-small: var(--ecc-font-size-x-small);
    --ecc-input-help-text-font-size-medium: var(--ecc-font-size-small);
    --ecc-input-help-text-font-size-large: var(--ecc-font-size-medium);
    --ecc-input-help-text-color: var(--ecc-color-neutral-500);

    --ecc-toggle-size-small: calc(var(--ecc-sizing-internal) * 0.875);
    --ecc-toggle-size-medium: calc(var(--ecc-sizing-internal) * 1.125);
    --ecc-toggle-size-large: calc(var(--ecc-sizing-internal) * 1.375);

    --ecc-overlay-background-color: hsl(240 3.8% 46.1% / 33%);

    --ecc-panel-background-color: var(--ecc-color-neutral-0);
    --ecc-panel-border-color: var(--ecc-color-neutral-200);
    --ecc-panel-border-width: 1px;

    --ecc-tooltip-border-radius: var(--ecc-border-radius-medium);
    --ecc-tooltip-background-color: var(--ecc-color-neutral-800);
    --ecc-tooltip-color: var(--ecc-color-neutral-0);
    --ecc-tooltip-font-family: var(--ecc-font-sans);
    --ecc-tooltip-font-weight: var(--ecc-font-weight-normal);
    --ecc-tooltip-font-size: var(--ecc-font-size-small);
    --ecc-tooltip-line-height: var(--ecc-line-height-dense);
    --ecc-tooltip-padding: var(--ecc-spacing-2x-small)
      var(--ecc-spacing-x-small);
    --ecc-tooltip-arrow-size: 6px;

    --ecc-z-index-drawer: 700;
    --ecc-z-index-dialog: 800;
    --ecc-z-index-dropdown: 900;
    --ecc-z-index-toast: 950;
    --ecc-z-index-tooltip: 1000;

    /* High Level Tokens */

    --ecc-color-brand-internal: var(--ecc-color-brand, hsl(217, 91%, 60%));
    --ecc-color-warning-internal: var(--ecc-color-warning, hsl(38, 92%, 50%));
    --ecc-color-danger-internal: var(--ecc-color-danger, hsl(0, 84%, 60%));
    --ecc-color-success-internal: var(--ecc-color-success, hsl(142, 71%, 45%));
    --ecc-color-neutral-internal: var(--ecc-color-neutral, hsl(240, 4%, 46%));

    --ecc-corner-internal: var(--ecc-corner, 0.5rem);

    --ecc-depth-internal: var(--ecc-depth, 1);

    --ecc-density-internal: var(--ecc-density, 0.5rem);

    --ecc-sizing-internal: var(--ecc-sizing, 0.9rem);

    --ecc-motion-internal: var(--ecc-motion, 250ms);

    --ecc-font-size-internal: var(--ecc-font-size, 0.9rem);
  }
`;

export { primitiveStylesheet };
