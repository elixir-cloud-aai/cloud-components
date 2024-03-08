import ECCCLientGa4ghTesCreateRun from "./create-run.js";

export * from "./create-run.js";
export default ECCCLientGa4ghTesCreateRun;

window.customElements.define(
  "ecc-client-lit-ga4gh-tes-create-run",
  ECCCLientGa4ghTesCreateRun
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-lit-ga4gh-tes-create-run": ECCCLientGa4ghTesCreateRun;
  }
}
