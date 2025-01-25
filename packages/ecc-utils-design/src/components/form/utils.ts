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

// write a function that takes any string and converts it to a camelCase variable name
export function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .split(/[\s_-]+/) // Split on spaces, underscores, and hyphens
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
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

/**
 * Finds the nearest form group and returns its path.
 * @param element The starting element to search from.
 * @param key The key of the current element (if applicable).
 * @returns The path of the nearest form group, or null if not found.
 */
export function findNearestFormGroup(
  element: HTMLElement,
  key?: string,
  groupItem = false
): string | null {
  if (!element) return null;

  if (element.matches("ecc-d-form") || element.matches("ecc-d-form-group")) {
    return null;
  }

  const { parentElement } = element;
  if (!parentElement) return null;

  const specialAttributes = [
    "ecc-array-item",
    "ecc-form-item",
    "ecc-group-item",
  ];
  const hasSpecialAttribute = specialAttributes.some((attr) =>
    parentElement.hasAttribute(attr)
  );

  if (hasSpecialAttribute) {
    const parentPath = parentElement.getAttribute("path");
    return parentPath && key
      ? `${parentPath}.${key}`
      : key || parentPath || null;
  }

  return findNearestFormGroup(parentElement, key, groupItem);
}
