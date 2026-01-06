import ECCClientElixirDrsFilerObjectCreate from "./object-create.js";

export * from "./object-create.js";

window.customElements.define(
  "ecc-client-elixir-drs-filer-object-create",
  ECCClientElixirDrsFilerObjectCreate
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-drs-filer-object-create": ECCClientElixirDrsFilerObjectCreate;
  }
}

export default ECCClientElixirDrsFilerObjectCreate;
