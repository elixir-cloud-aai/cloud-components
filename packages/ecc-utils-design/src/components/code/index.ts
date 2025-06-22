import EccUtilsDesignCode from "./code.js";

export * from "./code.js";
export default EccUtilsDesignCode;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-code")
) {
  window.customElements.define("ecc-utils-design-code", EccUtilsDesignCode);
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-code": EccUtilsDesignCode;
  }
}
