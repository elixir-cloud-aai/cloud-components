import ECCClientGa4ghWesRunCreate from "./run-create.js";

export * from "./run-create.js";
export default ECCClientGa4ghWesRunCreate;

// Define the custom element
customElements.define(
  "ecc-client-ga4gh-wes-run-create",
  ECCClientGa4ghWesRunCreate
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-run-create": ECCClientGa4ghWesRunCreate;
  }
}
