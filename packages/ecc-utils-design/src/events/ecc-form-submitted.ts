export type EccFormSubmittedEvent = CustomEvent<{ form: object }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-form-submitted": EccFormSubmittedEvent;
  }
}
