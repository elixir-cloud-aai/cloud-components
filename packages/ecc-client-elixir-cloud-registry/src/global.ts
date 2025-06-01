import { css } from "lit";

/**
 * Global styles that can be applied to all components
 */
export const GlobalStyles = css`
  :host {
    --background: var(--ecc-background, oklch(1 0 0));
    --foreground: var(--ecc-foreground, oklch(0.145 0 0));
    --card: var(--ecc-card, oklch(1 0 0));
    --card-foreground: var(--ecc-card-foreground, oklch(0.145 0 0));
    --popover: var(--ecc-popover, oklch(1 0 0));
    --popover-foreground: var(--ecc-popover-foreground, oklch(0.145 0 0));
    --primary: var(--ecc-primary, oklch(0.205 0 0));
    --primary-foreground: var(--ecc-primary-foreground, oklch(0.985 0 0));
    --secondary: var(--ecc-secondary, oklch(0.97 0 0));
    --secondary-foreground: var(--ecc-secondary-foreground, oklch(0.205 0 0));
    --muted: var(--ecc-muted, oklch(0.97 0 0));
    --muted-foreground: var(--ecc-muted-foreground, oklch(0.556 0 0));
    --accent: var(--ecc-accent, oklch(0.97 0 0));
    --accent-foreground: var(--ecc-accent-foreground, oklch(0.205 0 0));
    --destructive: var(--ecc-destructive, oklch(0.577 0.245 27.325));
    --destructive-foreground: var(
      --ecc-destructive-foreground,
      oklch(0.985 0 0)
    );
    --border: var(--ecc-border, oklch(0.922 0 0));
    --input: var(--ecc-input, oklch(0.922 0 0));
    --ring: var(--ecc-ring, oklch(0.708 0 0));
    --chart-1: var(--ecc-chart-1, oklch(0.646 0.222 41.116));
    --chart-2: var(--ecc-chart-2, oklch(0.6 0.118 184.704));
    --chart-3: var(--ecc-chart-3, oklch(0.398 0.07 227.392));
    --chart-4: var(--ecc-chart-4, oklch(0.828 0.189 84.429));
    --chart-5: var(--ecc-chart-5, oklch(0.769 0.188 70.08));
    --radius: var(--ecc-radius, 0.625rem);
    --sidebar: var(--ecc-sidebar, oklch(0.985 0 0));
    --sidebar-foreground: var(--ecc-sidebar-foreground, oklch(0.145 0 0));
    --sidebar-primary: var(--ecc-sidebar-primary, oklch(0.205 0 0));
    --sidebar-primary-foreground: var(
      --ecc-sidebar-primary-foreground,
      oklch(0.985 0 0)
    );
    --sidebar-accent: var(--ecc-sidebar-accent, oklch(0.97 0 0));
    --sidebar-accent-foreground: var(
      --ecc-sidebar-accent-foreground,
      oklch(0.205 0 0)
    );
    --sidebar-border: var(--ecc-sidebar-border, oklch(0.922 0 0));
    --sidebar-ring: var(--ecc-sidebar-ring, oklch(0.708 0 0));
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  :host([dark]),
  :host-context([dark]),
  :host-context(.dark) {
    --background: var(--ecc-background, oklch(0.145 0 0));
    --foreground: var(--ecc-foreground, oklch(0.985 0 0));
    --card: var(--ecc-card, oklch(0.145 0 0));
    --card-foreground: var(--ecc-card-foreground, oklch(0.985 0 0));
    --popover: var(--ecc-popover, oklch(0.145 0 0));
    --popover-foreground: var(--ecc-popover-foreground, oklch(0.985 0 0));
    --primary: var(--ecc-primary, oklch(0.985 0 0));
    --primary-foreground: var(--ecc-primary-foreground, oklch(0.205 0 0));
    --secondary: var(--ecc-secondary, oklch(0.269 0 0));
    --secondary-foreground: var(--ecc-secondary-foreground, oklch(0.985 0 0));
    --muted: var(--ecc-muted, oklch(0.269 0 0));
    --muted-foreground: var(--ecc-muted-foreground, oklch(0.708 0 0));
    --accent: var(--ecc-accent, oklch(0.269 0 0));
    --accent-foreground: var(--ecc-accent-foreground, oklch(0.985 0 0));
    --destructive: var(--ecc-destructive, oklch(0.396 0.141 25.723));
    --destructive-foreground: var(
      --ecc-destructive-foreground,
      oklch(0.637 0.237 25.331)
    );
    --border: var(--ecc-border, oklch(0.269 0 0));
    --input: var(--ecc-input, oklch(0.269 0 0));
    --ring: var(--ecc-ring, oklch(0.439 0 0));
    --chart-1: var(--ecc-chart-1, oklch(0.488 0.243 264.376));
    --chart-2: var(--ecc-chart-2, oklch(0.696 0.17 162.48));
    --chart-3: var(--ecc-chart-3, oklch(0.769 0.188 70.08));
    --chart-4: var(--ecc-chart-4, oklch(0.627 0.265 303.9));
    --chart-5: var(--ecc-chart-5, oklch(0.645 0.246 16.439));
    --sidebar: var(--ecc-sidebar, oklch(0.205 0 0));
    --sidebar-foreground: var(--ecc-sidebar-foreground, oklch(0.985 0 0));
    --sidebar-primary: var(--ecc-sidebar-primary, oklch(0.488 0.243 264.376));
    --sidebar-primary-foreground: var(
      --ecc-sidebar-primary-foreground,
      oklch(0.985 0 0)
    );
    --sidebar-accent: var(--ecc-sidebar-accent, oklch(0.269 0 0));
    --sidebar-accent-foreground: var(
      --ecc-sidebar-accent-foreground,
      oklch(0.985 0 0)
    );
    --sidebar-border: var(--ecc-sidebar-border, oklch(0.269 0 0));
    --sidebar-ring: var(--ecc-sidebar-ring, oklch(0.439 0 0));
  }
`;
