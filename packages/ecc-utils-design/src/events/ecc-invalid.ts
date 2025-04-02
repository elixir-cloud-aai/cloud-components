export type EccInvalidEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-invalid": EccInvalidEvent;
  }
}
