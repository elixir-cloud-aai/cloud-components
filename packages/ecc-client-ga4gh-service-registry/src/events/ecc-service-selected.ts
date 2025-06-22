export type EccServiceSelectedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-selected": EccServiceSelectedEvent;
  }
}
