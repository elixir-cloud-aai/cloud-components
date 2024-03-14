export type EccUtilsChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-change": EccUtilsChangeEvent;
  }
}
