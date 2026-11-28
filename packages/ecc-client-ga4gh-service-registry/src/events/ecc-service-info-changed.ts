import type { Service } from "../providers/sr-provider.js";

export type EccServiceInfoChangedEvent = CustomEvent<{
  serviceInfo: Service | null;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-info-changed": EccServiceInfoChangedEvent;
  }
}
