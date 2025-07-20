export type EccToolVersionChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-version-changed": EccToolVersionChangedEvent;
  }
}
