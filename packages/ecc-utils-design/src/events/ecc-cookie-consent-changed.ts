import type { CookieConsent } from "../components/cookie-consent/consent.js";

export type EccCookieConsentChangedEvent = CustomEvent<{
  /** The saved consent. */
  consent: CookieConsent;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-cookie-consent-changed": EccCookieConsentChangedEvent;
  }
}
