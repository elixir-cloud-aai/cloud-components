export type EccDrsObjectCreateInputChangedEvent = CustomEvent<
  Record<string, any>
>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-object-create-input-changed": EccDrsObjectCreateInputChangedEvent;
  }
}
