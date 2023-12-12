export type EccUtilsExpandEvent = CustomEvent<{ key?: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-expand": EccUtilsExpandEvent;
  }
}
