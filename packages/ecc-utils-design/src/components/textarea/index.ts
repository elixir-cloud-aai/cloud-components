import EccUtilsDesignTextarea from "./textarea.js";

export * from "./textarea.js";
export default EccUtilsDesignTextarea;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-textarea")
) {
  window.customElements.define(
    "ecc-utils-design-textarea",
    EccUtilsDesignTextarea
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-textarea": EccUtilsDesignTextarea;
  }
}
