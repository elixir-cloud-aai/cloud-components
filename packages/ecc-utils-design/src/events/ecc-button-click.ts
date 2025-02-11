export type EccButtonClickEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-button-click": EccButtonClickEvent;
  }
}
