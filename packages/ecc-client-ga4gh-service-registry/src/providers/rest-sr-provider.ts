import {
  fetchWithTimeout,
  resolveRequestTimeout,
} from "@elixir-cloud/design/utils";
import type { RestProviderOptions } from "@elixir-cloud/design/utils";
import {
  ServiceRegistryProvider,
  ExternalService,
  Service,
  ServiceType,
} from "./sr-provider.js";

/**
 * Implementation of the ServiceRegistryProvider interface using direct REST API calls
 * This class combines the functionality of ServiceRegistryAPI and RestServiceRegistryProvider
 */
export class RestServiceRegistryProvider implements ServiceRegistryProvider {
  /** Deadline of each request in milliseconds, `0` for none. */
  public readonly timeout: number;

  /**
   * @param baseUrl Base URL of the Service Registry API
   * @param options `timeout`: deadline of each request in milliseconds
   *   (default 30 s, `0` for none)
   */
  constructor(
    public readonly baseUrl: string,
    options: RestProviderOptions = {}
  ) {
    this.timeout = resolveRequestTimeout(options);
  }

  /**
   * Sends every request of this provider, with the provider's deadline.
   * Override it in a subclass to add headers (e.g. `Authorization`) or
   * otherwise change requests; call `super.fetch()` to keep the deadline.
   */
  protected fetch(input: RequestInfo | URL, init?: RequestInit) {
    return fetchWithTimeout(input, init, this.timeout);
  }

  /**
   * Fetch list of services from the registry
   * @returns Promise resolving to array of services
   */
  async getServices(): Promise<ExternalService[]> {
    const url = `${this.baseUrl}/services`;
    const response = await this.fetch(url);
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
    const response = await this.fetch(url);
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
    const response = await this.fetch(url);
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
    const response = await this.fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch service info: ${response.statusText}`);
    }
    return response.json();
  }
}
