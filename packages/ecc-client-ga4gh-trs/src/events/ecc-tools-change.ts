export type EccToolsChangeEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tools-change": EccToolsChangeEvent;
  }
}
