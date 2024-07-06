export type EccUtilsCodeChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-change": EccUtilsCodeChangeEvent;
  }
}
