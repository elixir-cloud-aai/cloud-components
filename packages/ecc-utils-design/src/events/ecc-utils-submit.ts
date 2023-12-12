export type EccUtilsSubmitEvent = CustomEvent<{ form: object }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-submit": EccUtilsSubmitEvent;
  }
}
