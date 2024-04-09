import ECCClientGa4ghTesRuns from "./runs.js";

export * from "./runs.js";
export default ECCClientGa4ghTesRuns;

window.customElements.define(
  "ecc-client-ga4gh-tes-runs",
  ECCClientGa4ghTesRuns
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-tes-runs": ECCClientGa4ghTesRuns;
  }
}
