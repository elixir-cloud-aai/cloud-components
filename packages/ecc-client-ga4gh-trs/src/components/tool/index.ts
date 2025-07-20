import ECCClientGa4ghTrsTool from "./tool.js";

export * from "./tool.js";

// Define the custom element
customElements.define("ecc-client-ga4gh-trs-tool", ECCClientGa4ghTrsTool);

export default ECCClientGa4ghTrsTool;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-trs-tool": ECCClientGa4ghTrsTool;
  }
}
