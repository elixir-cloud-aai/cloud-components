export type EccUtilsArrayDeleteEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-array-delete": EccUtilsArrayDeleteEvent;
  }
}
