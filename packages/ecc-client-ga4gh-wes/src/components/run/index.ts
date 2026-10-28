import ECCClientGa4ghWesRun from "./run.js";

export * from "./run.js";
export default ECCClientGa4ghWesRun;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-wes-run")
) {
  window.customElements.define(
    "ecc-client-ga4gh-wes-run",
    ECCClientGa4ghWesRun
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-run": ECCClientGa4ghWesRun;
  }
}
