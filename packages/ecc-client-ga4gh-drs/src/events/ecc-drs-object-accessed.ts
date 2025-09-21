export type EccDrsObjectAccessedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-object-accessed": EccDrsObjectAccessedEvent;
  }
}
