import ECCClientElixirDrsFilerObjectCreate from "./object-create.js";

export * from "./object-create.js";

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-elixir-drs-filer-object-create")
) {
  window.customElements.define(
    "ecc-client-elixir-drs-filer-object-create",
    ECCClientElixirDrsFilerObjectCreate
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-drs-filer-object-create": ECCClientElixirDrsFilerObjectCreate;
  }
}

export default ECCClientElixirDrsFilerObjectCreate;
