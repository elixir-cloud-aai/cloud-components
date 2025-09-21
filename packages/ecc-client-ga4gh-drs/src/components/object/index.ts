import ECCClientGa4ghDrsObject from "./object.js";

export * from "./object.js";

// Define the custom element
customElements.define("ecc-client-ga4gh-drs-object", ECCClientGa4ghDrsObject);

export default ECCClientGa4ghDrsObject;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-drs-object": ECCClientGa4ghDrsObject;
  }
}
