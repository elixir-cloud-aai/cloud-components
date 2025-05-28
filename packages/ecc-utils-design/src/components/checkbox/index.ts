import EccUtilsDesignCheckbox from "./checkbox.js";

export * from "./checkbox.js";

// Define the custom element
if (!window.customElements.get("ecc-utils-design-checkbox")) {
  window.customElements.define(
    "ecc-utils-design-checkbox",
    EccUtilsDesignCheckbox
  );
}

export default EccUtilsDesignCheckbox;
declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-checkbox": EccUtilsDesignCheckbox;
  }
}
