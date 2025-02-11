export type EccInputEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-input": EccInputEvent;
  }
}
