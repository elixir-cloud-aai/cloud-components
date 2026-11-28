import { ECCClientGa4ghServiceRegistryServiceInfo } from "./service-info.js";

export * from "./service-info.js";
export default ECCClientGa4ghServiceRegistryServiceInfo;

window.customElements.define(
  "ecc-client-ga4gh-service-registry-service-info",
  ECCClientGa4ghServiceRegistryServiceInfo
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-service-info": ECCClientGa4ghServiceRegistryServiceInfo;
  }
}
