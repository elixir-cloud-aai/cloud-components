import EccUtilsDesignCode from "./code.js";

export * from "./code.js";
export default EccUtilsDesignCode;

window.customElements.define("ecc-utils-design-code", EccUtilsDesignCode);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-code": EccUtilsDesignCode;
  }
}
