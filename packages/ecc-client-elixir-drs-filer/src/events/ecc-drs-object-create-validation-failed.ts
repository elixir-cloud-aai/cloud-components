export type EccDrsObjectCreateValidationFailedEvent = CustomEvent<
  Record<string, any>
>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-object-create-validation-failed": EccDrsObjectCreateValidationFailedEvent;
  }
}
