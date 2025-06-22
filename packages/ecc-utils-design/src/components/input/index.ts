import EccUtilsDesignInput from "./input.js";

export * from "./input.js";
export default EccUtilsDesignInput;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-input")
) {
  window.customElements.define("ecc-utils-design-input", EccUtilsDesignInput);
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-input": EccUtilsDesignInput;
  }
}
