import ECCClientGa4ghTesRuns from "./runs.js";

export * from "./runs.js";
export default ECCClientGa4ghTesRuns;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-tes-runs")
) {
  window.customElements.define(
    "ecc-client-ga4gh-tes-runs",
    ECCClientGa4ghTesRuns
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-tes-runs": ECCClientGa4ghTesRuns;
  }
}
