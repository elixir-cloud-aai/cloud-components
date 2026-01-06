export type EccObjectsChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-objects-changed": EccObjectsChangedEvent;
  }
}
