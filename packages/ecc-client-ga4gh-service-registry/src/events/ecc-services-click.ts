export type EccServicesClickEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-services-click": EccServicesClickEvent;
  }
}
