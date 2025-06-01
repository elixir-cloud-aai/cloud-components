/* eslint-disable import/named */
/**
 * Types for the ELIXIR Cloud Registry API based on OpenAPI specification v1.0.0
 */

// Import base types from the GA4GH Service Registry package
import {
  ServiceRegistryProvider,
  ServiceType,
  Organization,
  Service,
  ExternalService,
  Error,
} from "@elixir-cloud/service-registry/dist/providers";

// Re-export base types for use in other modules
export type { ServiceType, Organization, Service, ExternalService, Error };

/**
 * Cloud Registry specific types that extend the base GA4GH Service Registry types
 */

// ServiceTypeRegister interface for service type registration (Cloud Registry specific)
export interface ServiceTypeRegister {
  group: string;
  artifact: string;
  version: string;
}

// ServiceRegister interface for service creation (Cloud Registry specific)
export interface ServiceRegister {
  id: string;
  name: string;
  type: ServiceTypeRegister;
  description?: string;
  organization: Organization;
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
  version: string;
}

// ExternalServiceRegister interface for external service creation (Cloud Registry specific)
export interface ExternalServiceRegister {
  name: string;
  type: ServiceTypeRegister;
  description?: string;
  organization: Organization;
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
  version: string;
  url: string;
}

/**
 * Interface defining the operations required for Cloud Registry data providers
 * Extends the base ServiceRegistryProvider with Cloud Registry specific creation and deletion operations
 */
export interface CloudRegistryProvider extends ServiceRegistryProvider {
  // Creation methods (Cloud Registry specific)
  createService(service: ExternalServiceRegister): Promise<string>;
  createServiceWithId(
    id: string,
    service: ExternalServiceRegister
  ): Promise<string>;

  // Update methods (Cloud Registry specific)
  updateService(id: string, service: ExternalServiceRegister): Promise<string>;

  // Deletion methods (Cloud Registry specific)
  deleteService?(id: string): Promise<string>;

  // Service info methods (Cloud Registry specific)
  createOrUpdateServiceInfo?(service: ServiceRegister): Promise<void>;
}
