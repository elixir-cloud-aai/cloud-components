import EccUtilsDesignCookieConsent from "./cookie-consent.js";

export * from "./cookie-consent.js";
export * from "./consent.js";
export * from "./urls.js";
export default EccUtilsDesignCookieConsent;

// Define the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ecc-utils-design-cookie-consent")
) {
  window.customElements.define(
    "ecc-utils-design-cookie-consent",
    EccUtilsDesignCookieConsent
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-utils-design-cookie-consent": EccUtilsDesignCookieConsent;
  }
}
