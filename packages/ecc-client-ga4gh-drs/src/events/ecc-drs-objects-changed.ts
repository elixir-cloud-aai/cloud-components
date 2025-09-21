export type EccDrsObjectsChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-objects-changed": EccDrsObjectsChangedEvent;
  }
}
