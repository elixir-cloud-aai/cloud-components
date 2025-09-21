export type EccDrsObjectCreatedEvent = CustomEvent<{
  objectId: string;
  objectData: Record<string, any>;
  message: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-object-created": EccDrsObjectCreatedEvent;
  }
}
