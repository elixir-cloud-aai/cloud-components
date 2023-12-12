export type EccUtilsFilterEvent = CustomEvent<{ key: string; value: string }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-filter": EccUtilsFilterEvent;
  }
}
