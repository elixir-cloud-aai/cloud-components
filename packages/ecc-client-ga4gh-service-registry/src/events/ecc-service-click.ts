export type EccServiceClickEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-click": EccServiceClickEvent;
  }
}
