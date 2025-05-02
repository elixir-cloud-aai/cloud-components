import EccUtilsDesignSeparator from "./separator.js";

export * from "./separator.js";
export default EccUtilsDesignSeparator;

// Define the custom element
if (!window.customElements.get("ecc-utils-design-separator")) {
  window.customElements.define(
    "ecc-utils-design-separator",
    EccUtilsDesignSeparator
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-separator": EccUtilsDesignSeparator;
  }
}
