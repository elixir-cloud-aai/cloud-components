export type EccChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-change": EccChangeEvent;
  }
}
