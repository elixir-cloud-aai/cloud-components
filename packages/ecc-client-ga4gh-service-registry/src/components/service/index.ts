import ECCClientGa4ghServiceRegistryService from "./service.js";

export * from "./service.js";

// Define the custom element
customElements.define(
  "ecc-client-ga4gh-service-registry-service",
  ECCClientGa4ghServiceRegistryService
);

export default ECCClientGa4ghServiceRegistryService;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-service": ECCClientGa4ghServiceRegistryService;
  }
}
