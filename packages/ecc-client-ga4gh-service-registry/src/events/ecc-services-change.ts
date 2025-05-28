export type EccServicesChangeEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-services-change": EccServicesChangeEvent;
  }
}
