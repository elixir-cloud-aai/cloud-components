export type EccToolCreateFailedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-create-failed": EccToolCreateFailedEvent;
  }
}
