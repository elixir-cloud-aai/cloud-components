import WESRuns from "./runs.js";

export * from "./runs.js";
export default WESRuns;

window.customElements.define("ecc-client-ga4gh-wes-runs", WESRuns);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-runs": WESRuns;
  }
}
