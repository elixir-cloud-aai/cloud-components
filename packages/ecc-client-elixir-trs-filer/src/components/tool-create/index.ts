import ECCClientElixirTrsToolCreate from "./tool-create.js";

export * from "./tool-create.js";
export default ECCClientElixirTrsToolCreate;

window.customElements.define(
  "ecc-client-elixir-trs-tool-create",
  ECCClientElixirTrsToolCreate
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-trs-tool-create": ECCClientElixirTrsToolCreate;
  }
}
