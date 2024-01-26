import WESCreateRuns from "./create-run.js";

export * from "./create-run.js";
export default WESCreateRuns;

window.customElements.define("ecc-client-ga4gh-wes-create-runs", WESCreateRuns);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-create-runs": WESCreateRuns;
  }
}
