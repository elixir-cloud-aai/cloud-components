import { ExternalServiceRegister } from "../providers/index.js";

export type EccServiceCreatedEvent = CustomEvent<{
  serviceId: string;
  serviceData: ExternalServiceRegister;
  message: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    "ecc-service-created": EccServiceCreatedEvent;
  }
}
