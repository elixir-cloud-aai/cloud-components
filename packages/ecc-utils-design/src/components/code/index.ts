import EccUtilsDesignCode from "./code.js";

export * from "./code.js";
export default EccUtilsDesignCode;

window.customElements.define("ecc-d-code", EccUtilsDesignCode);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-d-code": EccUtilsDesignCode;
  }
}
