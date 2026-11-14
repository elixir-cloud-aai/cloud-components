import { ECCClientGa4ghServiceRegistryServices } from "./services.js";

export * from "./services.js";
export default ECCClientGa4ghServiceRegistryServices;

// Only in browsers, and only once (the services list of the
// cloud-registry package may have defined it already)
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-service-registry-services")
) {
  window.customElements.define(
    "ecc-client-ga4gh-service-registry-services",
    ECCClientGa4ghServiceRegistryServices
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-service-registry-services": ECCClientGa4ghServiceRegistryServices;
  }
}
