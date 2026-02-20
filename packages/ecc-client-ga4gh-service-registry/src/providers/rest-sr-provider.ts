import {
  ServiceRegistryProvider,
  ExternalService,
  Service,
  ServiceType,
} from "./sr-provider.js";
import { fetcher } from "@elixir-cloud/design";

/**
 * Implementation of the ServiceRegistryProvider interface using direct REST API calls
 * This class combines the functionality of ServiceRegistryAPI and RestServiceRegistryProvider
 */
export class RestServiceRegistryProvider implements ServiceRegistryProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) { }

  /**
   * Fetch list of services from the registry
   * @returns Promise resolving to array of services
   */
  async getServices(): Promise<ExternalService[]> {
    const url = `${this.baseUrl}/services`;
    const response = await fetcher(url, undefined, "ga4gh-service-registry/services/get");
    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch a specific service by ID
   * @param serviceId ID of the service to fetch
   * @returns Promise resolving to service details
   */
  async getServiceById(serviceId: string): Promise<ExternalService> {
    const encodedServiceId = encodeURIComponent(serviceId);
    const url = `${this.baseUrl}/services/${encodedServiceId}`;
    const response = await fetcher(url, undefined, "ga4gh-service-registry/services/id");
    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch types of services exposed by the registry
   * @returns Promise resolving to array of service types
   */
  async getServiceTypes(): Promise<ServiceType[]> {
    const url = `${this.baseUrl}/services/types`;
    const response = await fetcher(url, undefined, "ga4gh-service-registry/services/types");
    if (!response.ok) {
      throw new Error(`Failed to fetch service types: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch information about the registry
   * @returns Promise resolving to service information
   */
  async getServiceInfo(): Promise<Service> {
    const url = `${this.baseUrl}/service-info`;
    const response = await fetcher(url, undefined, "ga4gh-service-registry/service-info");
    if (!response.ok) {
      throw new Error(`Failed to fetch service info: ${response.statusText}`);
    }
    return response.json();
  }
}
