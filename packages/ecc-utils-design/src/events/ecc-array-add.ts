export type EccArrayAddEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-array-add": EccArrayAddEvent;
  }
}
