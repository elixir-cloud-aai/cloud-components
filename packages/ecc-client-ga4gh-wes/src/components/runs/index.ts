import ECCClientGa4ghWesRuns from "./runs.js";

export * from "./runs.js";
export default ECCClientGa4ghWesRuns;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-wes-runs")
) {
  window.customElements.define(
    "ecc-client-ga4gh-wes-runs",
    ECCClientGa4ghWesRuns
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-runs": ECCClientGa4ghWesRuns;
  }
}
