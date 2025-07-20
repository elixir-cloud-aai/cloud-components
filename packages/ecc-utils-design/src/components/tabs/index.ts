import {
  EccUtilsDesignTabs,
  EccUtilsDesignTabsList,
  EccUtilsDesignTabsTrigger,
  EccUtilsDesignTabsContent,
} from "./tabs.js";

// Define custom elements
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-tabs")
) {
  window.customElements.define("ecc-utils-design-tabs", EccUtilsDesignTabs);
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-tabs-list")
) {
  window.customElements.define(
    "ecc-utils-design-tabs-list",
    EccUtilsDesignTabsList
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-tabs-trigger")
) {
  window.customElements.define(
    "ecc-utils-design-tabs-trigger",
    EccUtilsDesignTabsTrigger
  );
}
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-tabs-content")
) {
  window.customElements.define(
    "ecc-utils-design-tabs-content",
    EccUtilsDesignTabsContent
  );
}

// Export components
export * from "./tabs.js";
export default EccUtilsDesignTabs;

// Add type declarations
declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-tabs": EccUtilsDesignTabs;
    "ecc-utils-design-tabs-list": EccUtilsDesignTabsList;
    "ecc-utils-design-tabs-trigger": EccUtilsDesignTabsTrigger;
    "ecc-utils-design-tabs-content": EccUtilsDesignTabsContent;
  }
}
