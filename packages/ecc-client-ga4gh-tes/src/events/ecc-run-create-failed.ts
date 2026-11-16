export type EccRunCreateFailedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-run-create-failed": EccRunCreateFailedEvent;
  }
}
