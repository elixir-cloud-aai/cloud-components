import * as _ from "lodash-es";
import { repeat } from "lit/directives/repeat.js";
import { html, render, TemplateResult } from "lit";
import EccUtilsDesignCollection from "./collection.js";

export const findRootElement = (element: Element | ShadowRoot): HTMLElement => {
  const root = element.getRootNode();

  return root instanceof ShadowRoot
    ? findRootElement(root.host)
    : (element as HTMLElement);
};

export const errorAlert = (element: Element, message: string) => {
  const rootElement = findRootElement(element);

  if (rootElement instanceof EccUtilsDesignCollection) {
    rootElement.error(message);
  }
};

export const itemMatchesFilter = (item: Element, filter: string): boolean => {
  const searchRegex = new RegExp(filter.trim(), "i");
  const itemName = item.getAttribute("name") || "";

  return [
    item.textContent,
    itemName,
    _.kebabCase(itemName),
    item.getAttribute("tag"),
  ].some((text) => searchRegex.test(text || ""));
};

export const renderSkeletons = (count = 1) => {
  const skeletons = Array.from({ length: count });

  return html` <div class="lazy">
    ${repeat(skeletons, () => html`<sl-skeleton effect="sheen"></sl-skeleton>`)}
  </div>`;
};

export const parseSearchParams = (
  searchString: string
): Record<string, string> => {
  // Remove the leading '?' if it exists
  const cleanSearchString = searchString.startsWith("?")
    ? searchString.slice(1)
    : searchString;

  // Create a URLSearchParams object
  const searchParams = new URLSearchParams(cleanSearchString);

  // Convert the URLSearchParams object to a plain object
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

export const templateToString = (template: TemplateResult): HTMLElement => {
  const fragment = document.createDocumentFragment();
  render(template, fragment);
  const div = document.createElement("div");
  div.appendChild(fragment);
  return div;
};
