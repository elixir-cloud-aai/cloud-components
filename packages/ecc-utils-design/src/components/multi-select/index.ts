import {
  EccUtilsDesignMultiSelect,
  EccUtilsDesignMultiSelectTrigger,
  EccUtilsDesignMultiSelectContent,
  EccUtilsDesignMultiSelectItem,
} from "./multi-select.js";

export {
  EccUtilsDesignMultiSelect,
  EccUtilsDesignMultiSelectTrigger,
  EccUtilsDesignMultiSelectContent,
  EccUtilsDesignMultiSelectItem,
};

// For backwards compatibility and as default export
export default EccUtilsDesignMultiSelect;

if (!window.customElements.get("ecc-utils-design-multi-select")) {
  window.customElements.define(
    "ecc-utils-design-multi-select",
    EccUtilsDesignMultiSelect
  );
}
if (!window.customElements.get("ecc-utils-design-multi-select-trigger")) {
  window.customElements.define(
    "ecc-utils-design-multi-select-trigger",
    EccUtilsDesignMultiSelectTrigger
  );
}
if (!window.customElements.get("ecc-utils-design-multi-select-content")) {
  window.customElements.define(
    "ecc-utils-design-multi-select-content",
    EccUtilsDesignMultiSelectContent
  );
}
if (!window.customElements.get("ecc-utils-design-multi-select-item")) {
  window.customElements.define(
    "ecc-utils-design-multi-select-item",
    EccUtilsDesignMultiSelectItem
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-multi-select": EccUtilsDesignMultiSelect;
    "ecc-utils-design-multi-select-trigger": EccUtilsDesignMultiSelectTrigger;
    "ecc-utils-design-multi-select-content": EccUtilsDesignMultiSelectContent;
    "ecc-utils-design-multi-select-item": EccUtilsDesignMultiSelectItem;
  }
}
