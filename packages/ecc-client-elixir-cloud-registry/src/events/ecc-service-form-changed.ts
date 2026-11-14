export type EccServiceFormChangedEvent = CustomEvent<{
  dirty: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-form-changed": EccServiceFormChangedEvent;
  }
}
