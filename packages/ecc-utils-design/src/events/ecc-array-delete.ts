export type EccArrayDeleteEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-array-delete": EccArrayDeleteEvent;
  }
}
