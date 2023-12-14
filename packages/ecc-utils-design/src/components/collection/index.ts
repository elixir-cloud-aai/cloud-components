import Collection from "./collection.js";

export * from "./collection.js";
export default Collection;

window.customElements.define("ecc-utils-design-collection", Collection);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-collection": Collection;
  }
}
