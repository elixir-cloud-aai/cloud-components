export type EccToolCreateValidationFailedEvent = CustomEvent<
  Record<string, any>
>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-create-validation-failed": EccToolCreateValidationFailedEvent;
  }
}
