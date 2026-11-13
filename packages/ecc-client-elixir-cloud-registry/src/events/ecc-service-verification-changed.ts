import { Verification } from "../providers/index.js";

export type EccServiceVerificationChangedEvent = CustomEvent<{
  /** ID of the service. */
  serviceId: string;
  /** The new verification, or `null` if it was removed. */
  verification: Verification | null;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-verification-changed": EccServiceVerificationChangedEvent;
  }
}
