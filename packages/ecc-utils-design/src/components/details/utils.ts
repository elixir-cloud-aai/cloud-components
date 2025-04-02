/* eslint-disable no-param-reassign */
import { html } from "lit";
import * as _ from "lodash-es";
import "@shoelace-style/shoelace/dist/components/tooltip/tooltip.js";

export const getListData = (input: string) => {
  if (typeof input !== "string") return input;
  if (input.trim().startsWith("[") && input.trim().endsWith("]")) {
    return JSON.parse(input);
  }

  return input.split(",");
};

export const getNestedCopyValue = (el: Element) => {
  const dataItems = el.querySelectorAll("ecc-d-data-item");

  const data: Record<string, string> = {};

  dataItems.forEach((e) => {
    const pathName = e.getAttribute("label") || "label";

    if (_.isEqual(el, e.parentElement)) {
      if (!e.getAttribute("type")?.trim()) {
        _.set(data, pathName, e.getAttribute("value"));
      } else if (e.getAttribute("type") === "list") {
        _.set(data, pathName, getListData(e.getAttribute("value") || ""));
      } else if (e.getAttribute("type") === "detail") {
        _.set(data, pathName, getNestedCopyValue(e));
      }
    }
  });

  return data;
};

export const formatBtn = (btn: Element) => {
  const parser = new DOMParser();
  const startIcon = parser
    .parseFromString(btn.getAttribute("ecc-start-icon") || "", "text/html")
    .body.querySelector("*");
  startIcon?.classList.add("ecc-icon", "ecc-start-icon");

  const endIcon = parser
    .parseFromString(btn.getAttribute("ecc-end-icon") || "", "text/html")
    .body.querySelector("*");
  endIcon?.classList.add("ecc-icon", "ecc-end-icon");

  btn.setAttribute("rel", btn.getAttribute("rel") || "noopener noreferrer");
  btn.setAttribute("target", btn.getAttribute("target") || "_blank");

  btn.innerHTML = `
    ${startIcon?.outerHTML || ""}
      ${btn.innerHTML}
    ${endIcon?.outerHTML || ""}
    `;

  return btn;
};

export const renderLabel = (
  label: string,
  value: any,
  copy = false,
  tooltip = ""
) => {
  const getHTML = () => html`
    <span> ${label} </span>
    ${copy
      ? html`<sl-copy-button .value=${JSON.stringify(value)}></sl-copy-button>`
      : ""}
  `;

  return html`
    <div class="key">
      ${tooltip.trim()
        ? html` <sl-tooltip content="${tooltip}">${getHTML()}</sl-tooltip> `
        : getHTML()}
    </div>
  `;
};

export const cleanupString = (input: string): string => {
  // Trim the string and replace multiple spaces with a single space
  let cleaned = input.trim().replace(/\s+/g, " ");

  // Remove any non-alphanumeric characters (except spaces)
  cleaned = cleaned.replace(/[^a-zA-Z0-9 \-_]/g, "");

  // Capitalize the first letter and make the rest lowercase
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();

  return cleaned;
};
