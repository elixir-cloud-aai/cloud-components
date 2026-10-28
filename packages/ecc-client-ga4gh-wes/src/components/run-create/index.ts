import ECCClientGa4ghWesRunCreate from "./run-create.js";

export * from "./run-create.js";
export default ECCClientGa4ghWesRunCreate;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-wes-run-create")
) {
  window.customElements.define(
    "ecc-client-ga4gh-wes-run-create",
    ECCClientGa4ghWesRunCreate
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-run-create": ECCClientGa4ghWesRunCreate;
  }
}
