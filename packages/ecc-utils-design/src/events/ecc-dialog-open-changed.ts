/** What opened or closed an `ecc-utils-design-dialog` */
export type EccDialogOpenChangeReason =
  | "trigger"
  | "escape"
  | "overlay"
  | "close-button"
  | "close";

export type EccDialogOpenChangedEvent = CustomEvent<{
  open: boolean;
  reason: EccDialogOpenChangeReason;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-dialog-open-changed": EccDialogOpenChangedEvent;
  }
}
