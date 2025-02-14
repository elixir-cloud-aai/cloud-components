import * as _ from "lodash-es";
import { repeat } from "lit/directives/repeat.js";
import { html } from "lit";
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
