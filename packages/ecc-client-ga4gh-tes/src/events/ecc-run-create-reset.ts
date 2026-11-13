export type EccRunCreateResetEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-run-create-reset": EccRunCreateResetEvent;
  }
}
