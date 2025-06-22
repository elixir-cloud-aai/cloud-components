export type EccToolsSelectedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tools-selected": EccToolsSelectedEvent;
  }
}
