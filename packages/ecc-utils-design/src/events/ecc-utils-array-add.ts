export type EccUtilsArrayAddEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-array-add": EccUtilsArrayAddEvent;
  }
}
