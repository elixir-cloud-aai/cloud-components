import ECCClientElixirTrsToolCreate from "./tool-create.js";

export * from "./tool-create.js";
export default ECCClientElixirTrsToolCreate;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-elixir-trs-tool-create")
) {
  window.customElements.define(
    "ecc-client-elixir-trs-tool-create",
    ECCClientElixirTrsToolCreate
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-trs-tool-create": ECCClientElixirTrsToolCreate;
  }
}
