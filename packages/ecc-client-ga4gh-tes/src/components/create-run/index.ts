import ECCCLientGa4ghTesCreateRun from "./create-run.js";

export * from "./create-run.js";
export default ECCCLientGa4ghTesCreateRun;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-tes-create-run")
) {
  window.customElements.define(
    "ecc-client-ga4gh-tes-create-run",
    ECCCLientGa4ghTesCreateRun
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-tes-create-run": ECCCLientGa4ghTesCreateRun;
  }
}
