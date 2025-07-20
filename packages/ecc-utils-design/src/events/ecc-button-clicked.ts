export type EccButtonClickedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-button-clicked": EccButtonClickedEvent;
  }
}
