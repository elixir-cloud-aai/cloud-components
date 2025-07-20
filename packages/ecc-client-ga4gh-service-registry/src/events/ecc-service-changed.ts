export type EccServiceChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-changed": EccServiceChangedEvent;
  }
}
