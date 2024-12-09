/* eslint-disable no-param-reassign */
import _ from "lodash";

export const getListData = (input: string) => {
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
      if (e.getAttribute("type") === null) {
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

export const formatLabel = (str: string) => {
  let label = str;

  label = label.replace(/_([a-z])/g, (match, p1) => p1.toUpperCase());
  label = label.replace(/([A-Z])/g, " $1");
  label = label.charAt(0).toUpperCase() + label.slice(1);

  return label;
};

export const formatBtn = (btn: Element) => {
  const parser = new DOMParser();
  const startIcon = parser
    .parseFromString(btn.getAttribute("start-icon") || "", "text/html")
    .body.querySelector("*");
  startIcon?.classList.add("icon", "start-icon");

  const endIcon = parser
    .parseFromString(btn.getAttribute("end-icon") || "", "text/html")
    .body.querySelector("*");
  endIcon?.classList.add("icon", "end-icon");

  btn.setAttribute("rel", btn.getAttribute("rel") || "noopener noreferrer");
  btn.setAttribute("target", btn.getAttribute("target") || "_blank");

  btn.innerHTML = `
    ${startIcon?.outerHTML || ""}
      ${btn.innerHTML}
    ${endIcon?.outerHTML || ""}
    `;

  return btn;
};
