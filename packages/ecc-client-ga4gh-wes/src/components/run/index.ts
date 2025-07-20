import ECCClientGa4ghWesRun from "./run.js";

export * from "./run.js";
export default ECCClientGa4ghWesRun;

// Define the custom element
customElements.define("ecc-client-ga4gh-wes-run", ECCClientGa4ghWesRun);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-run": ECCClientGa4ghWesRun;
  }
}
