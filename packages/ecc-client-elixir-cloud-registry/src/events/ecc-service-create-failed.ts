export type EccServiceCreateFailedEvent = CustomEvent<{
  error: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-failed": EccServiceCreateFailedEvent;
  }
}
