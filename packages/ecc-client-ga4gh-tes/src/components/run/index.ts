import ECCClientGa4ghTesRun from "./run.js";

export * from "./run.js";
export default ECCClientGa4ghTesRun;

customElements.define("ecc-client-ga4gh-tes-run", ECCClientGa4ghTesRun);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-tes-run": ECCClientGa4ghTesRun;
  }
}
