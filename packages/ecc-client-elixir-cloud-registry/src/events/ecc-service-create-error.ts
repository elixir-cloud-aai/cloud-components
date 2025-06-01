export type EccServiceCreateErrorEvent = CustomEvent<{
  error: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-error": EccServiceCreateErrorEvent;
  }
}
