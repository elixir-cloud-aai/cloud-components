export type EccRunLogChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-run-log-changed": EccRunLogChangedEvent;
  }
}
