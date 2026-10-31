import { css } from "lit";

/**
 * Dark theme defaults.
 *
 * These are set as inherited private `--_ecc-default-*` properties rather
 * than as the tokens themselves, so that components nested in another
 * component's shadow tree pick them up through inheritance. This keeps the
 * `dark` attribute working in browsers without `:host-context()` support
 * (Firefox, Safari). Public `--ecc-*` tokens still take precedence.
 */
const DarkDefaults = css`
  color-scheme: dark;
  --_ecc-default-background: oklch(0.145 0 0);
  --_ecc-default-foreground: oklch(0.985 0 0);
  --_ecc-default-card: oklch(0.145 0 0);
  --_ecc-default-card-foreground: oklch(0.985 0 0);
  --_ecc-default-popover: oklch(0.145 0 0);
  --_ecc-default-popover-foreground: oklch(0.985 0 0);
  --_ecc-default-primary: oklch(0.985 0 0);
  --_ecc-default-primary-foreground: oklch(0.205 0 0);
  --_ecc-default-secondary: oklch(0.269 0 0);
  --_ecc-default-secondary-foreground: oklch(0.985 0 0);
  --_ecc-default-muted: oklch(0.269 0 0);
  --_ecc-default-muted-foreground: oklch(0.708 0 0);
  --_ecc-default-accent: oklch(0.269 0 0);
  --_ecc-default-accent-foreground: oklch(0.985 0 0);
  --_ecc-default-destructive: oklch(0.704 0.191 22.216);
  --_ecc-default-destructive-foreground: oklch(0.205 0 0);
  --_ecc-default-border: oklch(0.269 0 0);
  --_ecc-default-input: oklch(0.269 0 0);
  --_ecc-default-ring: oklch(0.439 0 0);
  --_ecc-default-chart-1: oklch(0.488 0.243 264.376);
  --_ecc-default-chart-2: oklch(0.696 0.17 162.48);
  --_ecc-default-chart-3: oklch(0.769 0.188 70.08);
  --_ecc-default-chart-4: oklch(0.627 0.265 303.9);
  --_ecc-default-chart-5: oklch(0.645 0.246 16.439);
  --_ecc-default-sidebar: oklch(0.205 0 0);
  --_ecc-default-sidebar-foreground: oklch(0.985 0 0);
  --_ecc-default-sidebar-primary: oklch(0.488 0.243 264.376);
  --_ecc-default-sidebar-primary-foreground: oklch(0.985 0 0);
  --_ecc-default-sidebar-accent: oklch(0.269 0 0);
  --_ecc-default-sidebar-accent-foreground: oklch(0.985 0 0);
  --_ecc-default-sidebar-border: oklch(0.269 0 0);
  --_ecc-default-sidebar-ring: oklch(0.439 0 0);
`;

/**
 * Global styles that can be applied to all components
 *
 * Theming API:
 * - `--ecc-*` custom properties override design tokens
 * - `dark` attribute on a component, or a `.dark` class or `dark` attribute
 *   on an ancestor, switches to dark defaults
 * - `surface` attribute makes a component paint its own background and text
 *   color from the `--ecc-background` and `--ecc-foreground` tokens, inset by
 *   `--ecc-surface-padding` and rounded by `--ecc-radius`
 */
export const GlobalStyles = css`
  :host {
    font-family: var(--ecc-font-sans, inherit);
    /* Not --font-mono: that name is Tailwind's theme variable, which maps here */
    --font-family-mono: var(
      --ecc-font-mono,
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      "Liberation Mono",
      "Courier New",
      monospace
    );
    --background: var(
      --ecc-background,
      var(--_ecc-default-background, oklch(1 0 0))
    );
    --foreground: var(
      --ecc-foreground,
      var(--_ecc-default-foreground, oklch(0.145 0 0))
    );
    --card: var(--ecc-card, var(--_ecc-default-card, oklch(1 0 0)));
    --card-foreground: var(
      --ecc-card-foreground,
      var(--_ecc-default-card-foreground, oklch(0.145 0 0))
    );
    --popover: var(--ecc-popover, var(--_ecc-default-popover, oklch(1 0 0)));
    --popover-foreground: var(
      --ecc-popover-foreground,
      var(--_ecc-default-popover-foreground, oklch(0.145 0 0))
    );
    --primary: var(
      --ecc-primary,
      var(--_ecc-default-primary, oklch(0.205 0 0))
    );
    --primary-foreground: var(
      --ecc-primary-foreground,
      var(--_ecc-default-primary-foreground, oklch(0.985 0 0))
    );
    --secondary: var(
      --ecc-secondary,
      var(--_ecc-default-secondary, oklch(0.97 0 0))
    );
    --secondary-foreground: var(
      --ecc-secondary-foreground,
      var(--_ecc-default-secondary-foreground, oklch(0.205 0 0))
    );
    --muted: var(--ecc-muted, var(--_ecc-default-muted, oklch(0.97 0 0)));
    --muted-foreground: var(
      --ecc-muted-foreground,
      var(--_ecc-default-muted-foreground, oklch(0.556 0 0))
    );
    --accent: var(--ecc-accent, var(--_ecc-default-accent, oklch(0.97 0 0)));
    --accent-foreground: var(
      --ecc-accent-foreground,
      var(--_ecc-default-accent-foreground, oklch(0.205 0 0))
    );
    --destructive: var(
      --ecc-destructive,
      var(--_ecc-default-destructive, oklch(0.577 0.245 27.325))
    );
    --destructive-foreground: var(
      --ecc-destructive-foreground,
      var(--_ecc-default-destructive-foreground, oklch(0.985 0 0))
    );
    --border: var(--ecc-border, var(--_ecc-default-border, oklch(0.922 0 0)));
    --input: var(--ecc-input, var(--_ecc-default-input, oklch(0.922 0 0)));
    --ring: var(--ecc-ring, var(--_ecc-default-ring, oklch(0.708 0 0)));
    --chart-1: var(
      --ecc-chart-1,
      var(--_ecc-default-chart-1, oklch(0.646 0.222 41.116))
    );
    --chart-2: var(
      --ecc-chart-2,
      var(--_ecc-default-chart-2, oklch(0.6 0.118 184.704))
    );
    --chart-3: var(
      --ecc-chart-3,
      var(--_ecc-default-chart-3, oklch(0.398 0.07 227.392))
    );
    --chart-4: var(
      --ecc-chart-4,
      var(--_ecc-default-chart-4, oklch(0.828 0.189 84.429))
    );
    --chart-5: var(
      --ecc-chart-5,
      var(--_ecc-default-chart-5, oklch(0.769 0.188 70.08))
    );
    --radius: var(--ecc-radius, 0.625rem);
    --sidebar: var(
      --ecc-sidebar,
      var(--_ecc-default-sidebar, oklch(0.985 0 0))
    );
    --sidebar-foreground: var(
      --ecc-sidebar-foreground,
      var(--_ecc-default-sidebar-foreground, oklch(0.145 0 0))
    );
    --sidebar-primary: var(
      --ecc-sidebar-primary,
      var(--_ecc-default-sidebar-primary, oklch(0.205 0 0))
    );
    --sidebar-primary-foreground: var(
      --ecc-sidebar-primary-foreground,
      var(--_ecc-default-sidebar-primary-foreground, oklch(0.985 0 0))
    );
    --sidebar-accent: var(
      --ecc-sidebar-accent,
      var(--_ecc-default-sidebar-accent, oklch(0.97 0 0))
    );
    --sidebar-accent-foreground: var(
      --ecc-sidebar-accent-foreground,
      var(--_ecc-default-sidebar-accent-foreground, oklch(0.205 0 0))
    );
    --sidebar-border: var(
      --ecc-sidebar-border,
      var(--_ecc-default-sidebar-border, oklch(0.922 0 0))
    );
    --sidebar-ring: var(
      --ecc-sidebar-ring,
      var(--_ecc-default-sidebar-ring, oklch(0.708 0 0))
    );
  }

  :host([surface]) {
    background-color: var(--background);
    color: var(--foreground);
    padding: var(--ecc-surface-padding, 1rem);
    border-radius: var(--radius);
    /* Many hosts are width: 100%; keep the padding inside that width */
    box-sizing: border-box;
  }

  :host([dark]) {
    ${DarkDefaults}
  }

  /* Separate rule: browsers without :host-context() drop only this one */
  :host-context([dark]),
  :host-context(.dark) {
    ${DarkDefaults}
  }
`;
