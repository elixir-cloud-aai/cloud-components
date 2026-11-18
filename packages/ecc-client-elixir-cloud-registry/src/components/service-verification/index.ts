import ECCClientElixirCloudRegistryServiceVerification from "./service-verification.js";

export * from "./service-verification.js";
export default ECCClientElixirCloudRegistryServiceVerification;

// Only in browsers, and only once (the services list of the
// cloud-registry package may have defined it already)
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get(
    "ecc-client-elixir-cloud-registry-service-verification"
  )
) {
  window.customElements.define(
    "ecc-client-elixir-cloud-registry-service-verification",
    ECCClientElixirCloudRegistryServiceVerification
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-cloud-registry-service-verification": ECCClientElixirCloudRegistryServiceVerification;
  }
}
