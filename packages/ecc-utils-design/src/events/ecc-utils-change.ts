export type EccUtilsChangeEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    "sl-change": EccUtilsChangeEvent;
  }
}
