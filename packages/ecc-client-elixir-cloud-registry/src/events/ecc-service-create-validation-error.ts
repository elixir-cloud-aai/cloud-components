export type EccServiceCreateValidationErrorEvent = CustomEvent<{
  error: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-validation-error": EccServiceCreateValidationErrorEvent;
  }
}
