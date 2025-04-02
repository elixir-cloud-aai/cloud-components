export type EccFilterEvent = CustomEvent<{ key: string; value: string }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-filter": EccFilterEvent;
  }
}
