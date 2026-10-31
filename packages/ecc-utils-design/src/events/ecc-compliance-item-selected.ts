import type { FooterItem } from "../components/cookie-consent/consent.js";

export type EccComplianceItemSelectedEvent = CustomEvent<{
  /** The selected item. */
  item: FooterItem;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-compliance-item-selected": EccComplianceItemSelectedEvent;
  }
}
