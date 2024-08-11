import ECCCLientElixirDrsCreateObject from "./create-object.js";

export * from "./create-object.js";
export default ECCCLientElixirDrsCreateObject;

window.customElements.define(
  "ecc-client-elixir-drs-create-object",
  ECCCLientElixirDrsCreateObject
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-drs-create-object": ECCCLientElixirDrsCreateObject;
  }
}
