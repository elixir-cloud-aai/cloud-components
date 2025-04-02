export type EccShowEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-show": EccShowEvent;
  }
}
