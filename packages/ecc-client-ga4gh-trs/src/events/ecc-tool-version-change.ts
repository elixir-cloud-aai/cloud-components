export type EccToolVersionChangeEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-version-change": EccToolVersionChangeEvent;
  }
}
