export type EccInputChangedEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-input-changed": EccInputChangedEvent;
  }
}
