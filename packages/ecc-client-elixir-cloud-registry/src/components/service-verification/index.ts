import ECCClientElixirCloudRegistryServiceVerification from "./service-verification.js";

export * from "./service-verification.js";
export default ECCClientElixirCloudRegistryServiceVerification;

window.customElements.define(
  "ecc-client-elixir-cloud-registry-service-verification",
  ECCClientElixirCloudRegistryServiceVerification
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-cloud-registry-service-verification": ECCClientElixirCloudRegistryServiceVerification;
  }
}
