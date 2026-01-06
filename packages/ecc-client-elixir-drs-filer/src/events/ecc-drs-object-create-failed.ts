export type EccDrsObjectCreateFailedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-object-create-failed": EccDrsObjectCreateFailedEvent;
  }
}
