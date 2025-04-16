export type EccExpandEvent = CustomEvent<{ key?: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-expand": EccExpandEvent;
  }
}
