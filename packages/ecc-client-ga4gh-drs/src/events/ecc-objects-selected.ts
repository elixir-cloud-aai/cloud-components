export type EccObjectsSelectedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-objects-selected": EccObjectsSelectedEvent;
  }
}
