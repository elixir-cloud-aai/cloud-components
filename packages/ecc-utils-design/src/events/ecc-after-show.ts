export type EccAfterShowEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-after-show": EccAfterShowEvent;
  }
}
