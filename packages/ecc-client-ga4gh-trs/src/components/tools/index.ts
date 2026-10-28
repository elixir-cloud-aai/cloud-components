import ECCClientGa4ghTrsTools from "./tools.js";

export * from "./tools.js";
export default ECCClientGa4ghTrsTools;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-trs-tools")
) {
  window.customElements.define(
    "ecc-client-ga4gh-trs-tools",
    ECCClientGa4ghTrsTools
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-trs-tools": ECCClientGa4ghTrsTools;
  }
}
