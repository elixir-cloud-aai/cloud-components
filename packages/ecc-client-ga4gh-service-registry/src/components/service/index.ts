import ECCClientGa4ghServiceRegistryService from "./service.js";

export * from "./service.js";

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-service-registry-service")
) {
  window.customElements.define(
    "ecc-client-ga4gh-service-registry-service",
    ECCClientGa4ghServiceRegistryService
  );
}

export default ECCClientGa4ghServiceRegistryService;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-service": ECCClientGa4ghServiceRegistryService;
  }
}
