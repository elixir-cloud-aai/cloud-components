export type EccUtilsButtonClickEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-button-click": EccUtilsButtonClickEvent;
  }
}
