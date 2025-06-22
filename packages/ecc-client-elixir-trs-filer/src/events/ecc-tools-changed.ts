export type EccToolsChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tools-changed": EccToolsChangedEvent;
  }
}
