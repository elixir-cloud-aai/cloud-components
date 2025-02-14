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

  const topLevelElement = element.closest("ecc-d-form, ecc-d-form-group");
  if (
    topLevelElement &&
    (topLevelElement.matches("ecc-d-form") ||
      (!isGroup && topLevelElement.matches("ecc-d-form-group")))
  ) {
    return null;
  }

  const specialElement = element.closest(
    "[ecc-array], [ecc-group], [ecc-form]"
  );
  if (specialElement) {
    const parentPath = specialElement.getAttribute("path");
    return parentPath ? `${parentPath}.${key}` : key;
  }

  return element.parentElement
    ? findNearestFormGroup(key, element.parentElement, isGroup)
    : null;
};

export const removeDuplicates = (arr: string[]) => {
  const lowercaseMap = new Map<string, string>();
  arr.forEach((item) => {
    lowercaseMap.set(item.toLowerCase(), item);
  });

  return Array.from(lowercaseMap.values());
};
