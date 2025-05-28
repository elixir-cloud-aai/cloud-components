export type EccToolCreateErrorEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-create-error": EccToolCreateErrorEvent;
  }
}
