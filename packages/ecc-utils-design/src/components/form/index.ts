import EccUtilsDesignForm from "./form.js";

export * from "./form.js";
export default EccUtilsDesignForm;

window.customElements.define("ecc-utils-design-form", EccUtilsDesignForm);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-form": EccUtilsDesignForm;
  }
}
