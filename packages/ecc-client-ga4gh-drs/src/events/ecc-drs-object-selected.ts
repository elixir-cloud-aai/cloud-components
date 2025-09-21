export type EccDrsObjectSelectedEvent = CustomEvent<Record<string, any>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-drs-object-selected": EccDrsObjectSelectedEvent;
  }
}
