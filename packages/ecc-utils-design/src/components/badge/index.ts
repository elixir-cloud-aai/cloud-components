import EccUtilsDesignBadge from "./badge.js";

export * from "./badge.js";
export default EccUtilsDesignBadge;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-badge")
) {
  window.customElements.define("ecc-utils-design-badge", EccUtilsDesignBadge);
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-badge": EccUtilsDesignBadge;
  }
}
