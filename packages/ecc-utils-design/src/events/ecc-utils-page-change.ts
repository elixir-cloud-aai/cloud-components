export type EccUtilsPageChangeEvent = CustomEvent<{ page: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-utils-page-change": EccUtilsPageChangeEvent;
  }
}
