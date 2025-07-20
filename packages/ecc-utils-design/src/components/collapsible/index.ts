import {
  EccUtilsDesignCollapsible,
  EccUtilsDesignCollapsibleTrigger,
  EccUtilsDesignCollapsibleContent,
} from "./collapsible.js";

export {
  EccUtilsDesignCollapsible,
  EccUtilsDesignCollapsibleTrigger,
  EccUtilsDesignCollapsibleContent,
};

// For backwards compatibility and as default export
export default EccUtilsDesignCollapsible;

if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-collapsible")
) {
  window.customElements.define(
    "ecc-utils-design-collapsible",
    EccUtilsDesignCollapsible
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-collapsible-trigger")
) {
  window.customElements.define(
    "ecc-utils-design-collapsible-trigger",
    EccUtilsDesignCollapsibleTrigger
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-collapsible-content")
) {
  window.customElements.define(
    "ecc-utils-design-collapsible-content",
    EccUtilsDesignCollapsibleContent
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-collapsible": EccUtilsDesignCollapsible;
    "ecc-utils-design-collapsible-trigger": EccUtilsDesignCollapsibleTrigger;
    "ecc-utils-design-collapsible-content": EccUtilsDesignCollapsibleContent;
  }
}
