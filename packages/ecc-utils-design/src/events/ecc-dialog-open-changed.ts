import type { EccDialogOpenChangeReason } from "../components/dialog/dialog.js";

export type EccDialogOpenChangedEvent = CustomEvent<{
  open: boolean;
  reason: EccDialogOpenChangeReason;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-dialog-open-changed": EccDialogOpenChangedEvent;
  }
}
