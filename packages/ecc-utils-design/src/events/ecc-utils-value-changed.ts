export type EccUtilsValueChangedEvent = CustomEvent<{ key?: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-value-changed": EccUtilsValueChangedEvent;
  }
}
