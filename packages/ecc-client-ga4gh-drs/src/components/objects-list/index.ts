import ECCClientGa4ghDrsObjects from "./objects.js";

export * from "./objects.js";
export default ECCClientGa4ghDrsObjects;

window.customElements.define(
  "ecc-client-ga4gh-drs-objects",
  ECCClientGa4ghDrsObjects
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-drs-objects": ECCClientGa4ghDrsObjects;
  }
}
