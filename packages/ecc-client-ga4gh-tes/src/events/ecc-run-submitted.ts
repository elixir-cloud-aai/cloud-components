export type EccRunSubmittedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-run-submitted": EccRunSubmittedEvent;
  }
}
