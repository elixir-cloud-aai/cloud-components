/* eslint-disable import/named */
/**
 * Types for the GA4GH Service Registry API based on OpenAPI specification v1.0.0
 */

/**
 * ServiceType interface matching the Service Registry API schema
 */
export interface ServiceType {
  group: string;
  artifact: string;
  version: string;
}

/**
 * Organization interface matching the Service Registry API schema
 */
export interface Organization {
  name: string;
  url: string;
}

/**
 * Service interface matching the Service Registry API schema
 */
export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description?: string;
  organization: Organization;
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
  version: string;
}

/**
 * ExternalService interface extending Service with a URL
 */
export interface ExternalService extends Service {
  url: string;
}

/**
 * Error interface for API errors
 */
export interface Error {
  status: number;
  title: string;
  detail?: string;
}

/**
 * Interface defining the operations required for Service Registry data providers
 * Implementations could use REST API, GraphQL, or any other data source
 */
export interface ServiceRegistryProvider {
  // List services
  getServices(): Promise<ExternalService[]>;

  // Get service by ID
  getServiceById(id: string): Promise<ExternalService>;

  // Get service types
  getServiceTypes(): Promise<ServiceType[]>;

  // Get registry info
  getServiceInfo(): Promise<Service>;
}
