import ECCClientGa4ghTesRunCreate from "./run-create.js";

export * from "./run-create.js";
export default ECCClientGa4ghTesRunCreate;

customElements.define(
  "ecc-client-ga4gh-tes-run-create",
  ECCClientGa4ghTesRunCreate
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-tes-run-create": ECCClientGa4ghTesRunCreate;
  }
}
