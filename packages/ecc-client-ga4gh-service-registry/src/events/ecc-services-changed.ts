export type EccServicesChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-services-changed": EccServicesChangedEvent;
  }
}
