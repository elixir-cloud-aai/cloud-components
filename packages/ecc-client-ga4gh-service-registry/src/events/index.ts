import type { Service } from "../components/services/services.js";

export interface ServiceCreatedEvent extends CustomEvent {
  detail: Service;
}

export interface ServiceDeletedEvent extends CustomEvent {
  detail: {
    id: string;
  };
}

export interface ServiceUpdatedEvent extends CustomEvent {
  detail: Service;
}
