import ECCClientGa4ghWesRuns from "./runs.js";

export * from "./runs.js";
export default ECCClientGa4ghWesRuns;

window.customElements.define(
  "ecc-client-lit-ga4gh-wes-runs",
  ECCClientGa4ghWesRuns
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-lit-ga4gh-wes-runs": ECCClientGa4ghWesRuns;
  }
}
