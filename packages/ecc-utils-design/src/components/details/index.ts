import EccUtilsDesignDetails from "./details.js";

export * from "./details.js";
export default EccUtilsDesignDetails;

window.customElements.define("ecc-utils-design-details", EccUtilsDesignDetails);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-details": EccUtilsDesignDetails;
  }
}
