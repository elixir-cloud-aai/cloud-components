export type EccToolsClickEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tools-click": EccToolsClickEvent;
  }
}
