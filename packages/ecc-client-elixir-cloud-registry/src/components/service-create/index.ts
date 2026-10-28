import ECCClientElixirCloudRegistryServiceCreate from "./service-create.js";

export * from "./service-create.js";
export default ECCClientElixirCloudRegistryServiceCreate;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-elixir-cloud-registry-service-create")
) {
  window.customElements.define(
    "ecc-client-elixir-cloud-registry-service-create",
    ECCClientElixirCloudRegistryServiceCreate
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-cloud-registry-service-create": ECCClientElixirCloudRegistryServiceCreate;
  }
}
