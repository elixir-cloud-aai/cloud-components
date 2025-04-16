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

export const findFieldPath = (
  key: string,
  element: HTMLElement | null,
  isGroup = false
): string | null => {
  const gropEl = findNearestFormGroup(element, isGroup);

  if (!gropEl) return null;

  const parentPath = gropEl?.getAttribute("path");
  return parentPath ? `${parentPath}.${key}` : key;
};

export const findNearestFormGroup = (
  element: HTMLElement | null,
  isGroup = false
): Element | null => {
  if (!element) return null;

  const topLevelElement = element.closest("ecc-d-form, ecc-d-form-group");
  if (
    topLevelElement &&
    element.shadowRoot &&
    (topLevelElement.matches("ecc-d-form") ||
      (!isGroup && topLevelElement.matches("ecc-d-form-group")))
  ) {
    return null;
  }

  const specialElement = element.closest(
    "[ecc-array], [ecc-group], [ecc-form]"
  );

  if (specialElement) {
    return specialElement;
  }

  return element.parentElement
    ? findNearestFormGroup(element.parentElement, isGroup)
    : null;
};

export const removeDuplicates = (arr: string[]) => {
  const lowercaseMap = new Map<string, string>();
  arr.forEach((item) => {
    if (!item) return;
    lowercaseMap.set(item.toLowerCase(), item);
  });

  return Array.from(lowercaseMap.values());
};

export const setupCustomInputs = (
  inputs: NodeListOf<HTMLInputElement> | undefined
) => {
  inputs?.forEach((input) => {
    // if the path has already been set don't set it again
    if (input.getAttribute("ecc-input-path")) return;
    // if it has children then it's not an input but one or more of its children may be
    if (input.hasChildNodes()) {
      setupCustomInputs(input.childNodes as NodeListOf<HTMLInputElement>);
    }
    // if it is not an input return
    if (typeof input.value === "undefined") return;

    const key = input.getAttribute("ecc-key");
    if (!key) return;

    const path = findFieldPath(key, input as HTMLElement);
    input.setAttribute("ecc-d-input-path", path || "");

    input.addEventListener("input", () => {
      input.dispatchEvent(
        new CustomEvent("ecc-input", {
          detail: {
            key,
            path,
            target: input,
            value: input.value,
          },
          bubbles: true,
          composed: true,
        })
      );
    });
  });
};
