export type EccToolCreateValidationErrorEvent = CustomEvent<
  Record<string, any>
>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-create-validation-error": EccToolCreateValidationErrorEvent;
  }
}
