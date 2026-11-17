import ECCClientElixirCloudRegistryServiceVerificationBadge from "./service-verification-badge.js";

export * from "./service-verification-badge.js";
export default ECCClientElixirCloudRegistryServiceVerificationBadge;

window.customElements.define(
  "ecc-client-elixir-cloud-registry-service-verification-badge",
  ECCClientElixirCloudRegistryServiceVerificationBadge
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-cloud-registry-service-verification-badge": ECCClientElixirCloudRegistryServiceVerificationBadge;
  }
}
