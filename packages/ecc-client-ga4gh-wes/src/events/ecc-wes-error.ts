export type EccWesErrorEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-wes-error": EccWesErrorEvent;
  }
}
