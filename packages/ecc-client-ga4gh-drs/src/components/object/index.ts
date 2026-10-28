import ECCClientGa4ghDrsObject from "./object.js";

export * from "./object.js";

// SSR guard: customElements is not available in Node.js
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-client-ga4gh-drs-object")
) {
  window.customElements.define(
    "ecc-client-ga4gh-drs-object",
    ECCClientGa4ghDrsObject
  );
}

export default ECCClientGa4ghDrsObject;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-ga4gh-drs-object": ECCClientGa4ghDrsObject;
  }
}
