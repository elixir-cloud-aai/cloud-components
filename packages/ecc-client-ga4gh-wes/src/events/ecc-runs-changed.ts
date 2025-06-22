export type EccRunsChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-runs-changed": EccRunsChangedEvent;
  }
}
