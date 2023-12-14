import Details from "./details.js";

export * from "./details.js";
export default Details;

window.customElements.define("ecc-utils-design-details", Details);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-details": Details;
  }
}
