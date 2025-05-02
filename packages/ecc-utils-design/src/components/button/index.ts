import EccUtilsDesignButton from "./button.js";

export * from "./button.js";

// Define the custom element
if (!window.customElements.get("ecc-utils-design-button")) {
  window.customElements.define("ecc-utils-design-button", EccUtilsDesignButton);
}

export default EccUtilsDesignButton;
declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-button": EccUtilsDesignButton;
  }
}
