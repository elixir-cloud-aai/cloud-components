import { ExternalServiceRegister } from "../providers/index.js";

export type EccServiceCreateSuccessEvent = CustomEvent<{
  serviceId: string;
  serviceData: ExternalServiceRegister;
  message: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-create-success": EccServiceCreateSuccessEvent;
  }
}
