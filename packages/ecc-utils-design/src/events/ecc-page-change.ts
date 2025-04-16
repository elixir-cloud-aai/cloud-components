export type EccPageChangeEvent = CustomEvent<{ page: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-page-change": EccPageChangeEvent;
  }
}
