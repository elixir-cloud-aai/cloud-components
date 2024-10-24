import ECCClientRoCrateAbout from "./about.js";

export * from "./about.js";
export default ECCClientRoCrateAbout;

window.customElements.define(
  "ecc-client-elixir-ro-crate-about",
  ECCClientRoCrateAbout
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-ro-crate-about": ECCClientRoCrateAbout;
  }
}