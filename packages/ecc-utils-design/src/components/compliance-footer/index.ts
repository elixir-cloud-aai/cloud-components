import EccUtilsDesignComplianceFooter from "./compliance-footer.js";

export * from "./compliance-footer.js";
export default EccUtilsDesignComplianceFooter;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-compliance-footer")
) {
  window.customElements.define(
    "ecc-utils-design-compliance-footer",
    EccUtilsDesignComplianceFooter
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-compliance-footer": EccUtilsDesignComplianceFooter;
  }
}
