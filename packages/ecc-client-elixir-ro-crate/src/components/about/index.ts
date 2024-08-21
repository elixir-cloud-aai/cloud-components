import ECCCLientRoCrateAbout from "./about.js";

export * from "./about.js";
export default ECCCLientRoCrateAbout;

window.customElements.define(
  "ecc-client-elixir-ro-crate-about",
  ECCCLientRoCrateAbout
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-ro-crate-about": ECCCLientRoCrateAbout;
  }
}
