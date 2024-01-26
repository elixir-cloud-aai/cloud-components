import WESCreateRun from "./create-run.js";

export * from "./create-run.js";
export default WESCreateRun;

window.customElements.define("ecc-client-ga4gh-wes-create-run", WESCreateRun);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-wes-create-run": WESCreateRun;
  }
}
