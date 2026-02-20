import ECCClientGa4ghTrsTool from "./tool.js";

export * from "./tool.js";

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-trs-tool")
) {
  window.customElements.define(
    "ecc-client-ga4gh-trs-tool",
    ECCClientGa4ghTrsTool
  );
}

export default ECCClientGa4ghTrsTool;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-trs-tool": ECCClientGa4ghTrsTool;
  }
}
