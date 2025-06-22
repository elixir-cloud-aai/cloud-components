export type EccCollapsibleToggledEvent = CustomEvent<{ key?: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-collapsible-toggled": EccCollapsibleToggledEvent;
  }
}
