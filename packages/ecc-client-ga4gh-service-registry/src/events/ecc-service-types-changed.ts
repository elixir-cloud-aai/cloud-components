import type { ServiceType } from "../providers/sr-provider.js";

export type EccServiceTypesChangedEvent = CustomEvent<{
  serviceTypes: ServiceType[];
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-types-changed": EccServiceTypesChangedEvent;
  }
}
