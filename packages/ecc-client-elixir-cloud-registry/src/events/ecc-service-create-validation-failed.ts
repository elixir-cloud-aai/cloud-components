export type EccServiceCreateValidationFailedEvent = CustomEvent<{
  // Messages of all invalid fields
  error: string;
  // Message by field (ID of its input, e.g. `service-url`); not set if the
  // component is misconfigured
  errors?: Record<string, string>;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-validation-failed": EccServiceCreateValidationFailedEvent;
  }
}
