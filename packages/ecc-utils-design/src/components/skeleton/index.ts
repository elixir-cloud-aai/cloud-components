import EccUtilsDesignSkeleton from "./skeleton.js";

export * from "./skeleton.js";

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-skeleton")
) {
  window.customElements.define(
    "ecc-utils-design-skeleton",
    EccUtilsDesignSkeleton
  );
}

export default EccUtilsDesignSkeleton;

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-skeleton": EccUtilsDesignSkeleton;
  }
}
