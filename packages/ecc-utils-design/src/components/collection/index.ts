import EccUtilsDesignCollection from "./collection.js";

export * from "./collection.js";
export default EccUtilsDesignCollection;

window.customElements.define(
  "ecc-utils-design-collection",
  EccUtilsDesignCollection
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-collection": EccUtilsDesignCollection;
  }
}
