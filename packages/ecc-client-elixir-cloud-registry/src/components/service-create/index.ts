import ECCClientElixirCloudRegistryServiceCreate from "./service-create.js";

export * from "./service-create.js";
export default ECCClientElixirCloudRegistryServiceCreate;

window.customElements.define(
  "ecc-client-elixir-cloud-registry-service-create",
  ECCClientElixirCloudRegistryServiceCreate
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-elixir-cloud-registry-service-create": ECCClientElixirCloudRegistryServiceCreate;
  }
}
