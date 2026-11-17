export type EccButtonClickedEvent = CustomEvent<{ variant: string }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-button-clicked": EccButtonClickedEvent;
  }
}
