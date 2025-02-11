export type EccHideEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-hide": EccHideEvent;
  }
}
