import { ECCClientGa4ghServiceRegistryServiceTypes } from "./service-types.js";

export * from "./service-types.js";
export default ECCClientGa4ghServiceRegistryServiceTypes;

window.customElements.define(
  "ecc-client-ga4gh-service-registry-service-types",
  ECCClientGa4ghServiceRegistryServiceTypes
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-service-types": ECCClientGa4ghServiceRegistryServiceTypes;
  }
}
