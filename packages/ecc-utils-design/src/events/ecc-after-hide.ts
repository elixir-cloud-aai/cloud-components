export type EccAfterHideEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-after-hide": EccAfterHideEvent;
  }
}
