export type EccToolCreateInputChangedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-create-input-changed": EccToolCreateInputChangedEvent;
  }
}
