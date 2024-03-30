import ECCClientGa4ghWesRuns from "./runs.js";

export * from "./runs.js";
export default ECCClientGa4ghWesRuns;

window.customElements.define(
  "ecc-client-ga4gh-wes-runs",
  ECCClientGa4ghWesRuns
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-runs": ECCClientGa4ghWesRuns;
  }
}
