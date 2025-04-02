export type EccSubmitEvent = CustomEvent<{ form: object }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-submit": EccSubmitEvent;
  }
}
