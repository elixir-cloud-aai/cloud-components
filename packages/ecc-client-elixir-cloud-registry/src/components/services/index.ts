import ECCClientElixirCloudRegistryServices from "./services.js";

export * from "./services.js";
export default ECCClientElixirCloudRegistryServices;

// Only in browsers, and only once
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-elixir-cloud-registry-services")
) {
  window.customElements.define(
    "ecc-client-elixir-cloud-registry-services",
    ECCClientElixirCloudRegistryServices
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-cloud-registry-services": ECCClientElixirCloudRegistryServices;
  }
}
