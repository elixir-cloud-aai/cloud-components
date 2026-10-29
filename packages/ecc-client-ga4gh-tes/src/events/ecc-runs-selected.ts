export type EccRunsSelectedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-runs-selected": EccRunsSelectedEvent;
  }
}
