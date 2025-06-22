export type EccServicesSelectedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-services-selected": EccServicesSelectedEvent;
  }
}
