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

export function generateUniqueKey() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const findNearestFormGroup = (
  key: string,
  element: HTMLElement | null,
  isGroup = false
): string | null => {
  if (!element) return null;

  if (
    element.matches("ecc-d-form") ||
    (!isGroup && element.matches("ecc-d-form-group"))
  ) {
    return null;
  }

  const { parentElement } = element;
  if (!parentElement) return null;

  const specialAttributes = ["ecc-array", "ecc-group", "ecc-form"];
  const hasSpecialAttribute = specialAttributes.some((attr) =>
    parentElement.hasAttribute(attr)
  );

  if (hasSpecialAttribute) {
    const parentPath = parentElement.getAttribute("path");
    const path = parentPath ? `${parentPath}.${key}` : key;

    console.log("the key", key);

    return path;
  }

  return findNearestFormGroup(key, parentElement, isGroup);
};
