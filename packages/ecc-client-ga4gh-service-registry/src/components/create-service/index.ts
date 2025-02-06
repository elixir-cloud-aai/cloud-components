import ECCClientGa4ghServiceRegistryCreateService from "./create-service.js";

export * from "./create-service.js";
export default ECCClientGa4ghServiceRegistryCreateService;

window.customElements.define(
  "ecc-client-ga4gh-service-registry-create-service",
  ECCClientGa4ghServiceRegistryCreateService
);

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-create-service": ECCClientGa4ghServiceRegistryCreateService;
  }
}
