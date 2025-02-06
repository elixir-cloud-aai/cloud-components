import ECCClientGa4ghServiceRegistryServices from "./services.js";

export * from "./services.js";
export default ECCClientGa4ghServiceRegistryServices;

window.customElements.define(
  "ecc-client-ga4gh-service-registry-services",
  ECCClientGa4ghServiceRegistryServices
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-services": ECCClientGa4ghServiceRegistryServices;
  }
}
