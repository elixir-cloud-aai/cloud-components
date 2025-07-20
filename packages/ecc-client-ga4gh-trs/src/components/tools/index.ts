import ECCClientGa4ghTrsTools from "./tools.js";

export * from "./tools.js";
export default ECCClientGa4ghTrsTools;

window.customElements.define(
  "ecc-client-ga4gh-trs-tools",
  ECCClientGa4ghTrsTools
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-trs-tools": ECCClientGa4ghTrsTools;
  }
}
