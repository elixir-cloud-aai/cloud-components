export type EccPaginationChangedEvent = CustomEvent<{ page: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-pagination-changed": EccPaginationChangedEvent;
  }
}
