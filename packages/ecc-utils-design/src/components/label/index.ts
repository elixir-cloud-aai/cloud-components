import EccUtilsDesignLabel from "./label.js";

export * from "./label.js";
export default EccUtilsDesignLabel;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-label")
) {
  window.customElements.define("ecc-utils-design-label", EccUtilsDesignLabel);
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-label": EccUtilsDesignLabel;
  }
}
