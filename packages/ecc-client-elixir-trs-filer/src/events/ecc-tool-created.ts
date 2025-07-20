export type EccToolCreatedEvent = CustomEvent<{
  toolId: string;
  toolData: Record<string, any>;
  message: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-created": EccToolCreatedEvent;
  }
}
