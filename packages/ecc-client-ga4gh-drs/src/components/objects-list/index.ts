import ECCClientGa4ghDrsObjects from "./objects.js";

export * from "./objects.js";
export default ECCClientGa4ghDrsObjects;

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-drs-objects")
) {
  window.customElements.define(
    "ecc-client-ga4gh-drs-objects",
    ECCClientGa4ghDrsObjects
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-drs-objects": ECCClientGa4ghDrsObjects;
  }
}
