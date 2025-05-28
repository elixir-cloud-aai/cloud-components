export type EccServiceChangeEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-change": EccServiceChangeEvent;
  }
}
