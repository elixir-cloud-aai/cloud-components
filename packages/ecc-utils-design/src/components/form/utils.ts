import { html, TemplateResult } from "lit";

export function renderInTooltip(
  content: TemplateResult,
  tooltipText: string
): TemplateResult {
  return tooltipText.trim()
    ? html`
        <sl-tooltip data-testid="tooltip" content=${tooltipText}>
          ${content}
        </sl-tooltip>
      `
    : content;
}

// write a function to console.warn a string that is sent as a param, only when app is in dev mode
export function devWarn(message: string): void {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV === "development") {
    console.warn(message);
  }
}

export function noKeyWarning(Element: string, label: string): void {
  console.warn(
    `${Element}: Key attribute is required. We will auto generate a key from label but cannot guarantee uniqness. To ensure optimal functionality Please add a key for this field: ${label}`
  );
}

export function isShadowElement(element: Element): boolean {
  return element.getRootNode() instanceof ShadowRoot;
}
