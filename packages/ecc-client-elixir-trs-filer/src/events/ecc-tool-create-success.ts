export type EccToolCreateSuccessEvent = CustomEvent<{
  toolId: string;
  toolData: Record<string, any>;
  message: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-tool-create-success": EccToolCreateSuccessEvent;
  }
}
