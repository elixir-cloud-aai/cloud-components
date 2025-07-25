import {
  EccUtilsDesignSelect,
  EccUtilsDesignSelectValue,
  EccUtilsDesignSelectTrigger,
  EccUtilsDesignSelectContent,
  EccUtilsDesignSelectItem,
  EccUtilsDesignSelectGroup,
  EccUtilsDesignSelectLabel,
  EccUtilsDesignSelectSeparator,
} from "./select.js";

export {
  EccUtilsDesignSelect,
  EccUtilsDesignSelectTrigger,
  EccUtilsDesignSelectContent,
  EccUtilsDesignSelectItem,
  EccUtilsDesignSelectGroup,
  EccUtilsDesignSelectLabel,
  EccUtilsDesignSelectSeparator,
  EccUtilsDesignSelectValue,
};

// For backwards compatibility and as default export
export default EccUtilsDesignSelect;

if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select")
) {
  window.customElements.define("ecc-utils-design-select", EccUtilsDesignSelect);
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-trigger")
) {
  window.customElements.define(
    "ecc-utils-design-select-trigger",
    EccUtilsDesignSelectTrigger
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-content")
) {
  window.customElements.define(
    "ecc-utils-design-select-content",
    EccUtilsDesignSelectContent
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-item")
) {
  window.customElements.define(
    "ecc-utils-design-select-item",
    EccUtilsDesignSelectItem
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-separator")
) {
  window.customElements.define(
    "ecc-utils-design-select-separator",
    EccUtilsDesignSelectSeparator
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-label")
) {
  window.customElements.define(
    "ecc-utils-design-select-label",
    EccUtilsDesignSelectLabel
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-group")
) {
  window.customElements.define(
    "ecc-utils-design-select-group",
    EccUtilsDesignSelectGroup
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-select-value")
) {
  window.customElements.define(
    "ecc-utils-design-select-value",
    EccUtilsDesignSelectValue
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-select": EccUtilsDesignSelect;
    "ecc-utils-design-select-trigger": EccUtilsDesignSelectTrigger;
    "ecc-utils-design-select-content": EccUtilsDesignSelectContent;
    "ecc-utils-design-select-item": EccUtilsDesignSelectItem;
    "ecc-utils-design-select-separator": EccUtilsDesignSelectSeparator;
    "ecc-utils-design-select-label": EccUtilsDesignSelectLabel;
    "ecc-utils-design-select-group": EccUtilsDesignSelectGroup;
    "ecc-utils-design-select-value": EccUtilsDesignSelectValue;
  }
}
