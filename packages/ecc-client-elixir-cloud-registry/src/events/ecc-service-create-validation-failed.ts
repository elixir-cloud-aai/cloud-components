export type EccServiceCreateValidationFailedEvent = CustomEvent<{
  error: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-validation-failed": EccServiceCreateValidationFailedEvent;
  }
}
