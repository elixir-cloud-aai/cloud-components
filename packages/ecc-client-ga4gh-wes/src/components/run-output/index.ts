import ECCClientGa4ghWesRunOutput from "./run-output.js";

export * from "./run-output.js";
export default ECCClientGa4ghWesRunOutput;

// Define the custom element
customElements.define(
  "ecc-client-ga4gh-wes-run-output",
  ECCClientGa4ghWesRunOutput
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-run-output": ECCClientGa4ghWesRunOutput;
  }
}
