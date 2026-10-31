import {
  CloudRegistryProvider,
  ExternalService,
  ServiceType,
  ExternalServiceRegister,
  ServiceRegister,
  RegistryServiceInfo,
} from "./cr-provider.js";
import { CloudRegistryError } from "./errors.js";

/**
 * Implementation of the CloudRegistryProvider interface using direct REST API calls
 * This class combines the functionality of ServiceRegistryAPI and RestCloudRegistryProvider
 *
 * Methods reject with a {@link CloudRegistryError} if the registry answers
 * with an error status; it carries the status and the problem details.
 */
export class RestCloudRegistryProvider implements CloudRegistryProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) {}

  /**
   * Sends every request of this provider. Override it in a subclass to add
   * headers (e.g. `Authorization`) or otherwise change requests.
   */
  // eslint-disable-next-line class-methods-use-this
  protected fetch(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(input, init);
  }

  /**
   * Fetch list of services from the registry
   * @returns Promise resolving to array of services
   */
  async getServices(): Promise<ExternalService[]> {
    const url = `${this.baseUrl}/services`;
    const response = await this.fetch(url);
    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to fetch services"
      );
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
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to fetch service"
      );
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
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to fetch service types"
      );
    }
    return response.json();
  }

  /**
   * Fetch information about the registry
   * @returns Promise resolving to service information
   */
  async getServiceInfo(): Promise<RegistryServiceInfo> {
    const url = `${this.baseUrl}/service-info`;
    const response = await this.fetch(url);
    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to fetch service info"
      );
    }
    return response.json();
  }

  /**
   * Create a service in the registry
   * @param service Service metadata to register
   * @returns Promise resolving to service identifier
   */
  async createService(service: ExternalServiceRegister): Promise<string> {
    const url = `${this.baseUrl}/services`;
    const response = await this.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to create service"
      );
    }

    return response.json();
  }

  /**
   * Create or update a service with a specific ID
   * @param id Service identifier
   * @param service Service metadata to register
   * @returns Promise resolving to service identifier
   */
  async createServiceWithId(
    id: string,
    service: ExternalServiceRegister
  ): Promise<string> {
    const encodedServiceId = encodeURIComponent(id);
    const url = `${this.baseUrl}/services/${encodedServiceId}`;
    const response = await this.fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to create service with ID"
      );
    }

    return response.json();
  }

  /**
   * Update a service in the registry
   * @param id Service identifier
   * @param service Service metadata to update
   * @returns Promise resolving to service identifier
   */
  async updateService(
    id: string,
    service: ExternalServiceRegister
  ): Promise<string> {
    const encodedServiceId = encodeURIComponent(id);
    const url = `${this.baseUrl}/services/${encodedServiceId}`;
    const response = await this.fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to update service"
      );
    }

    return response.json();
  }

  /**
   * Delete a service from the registry
   * @param id Service identifier
   * @returns Promise resolving to service identifier
   */
  async deleteService(id: string): Promise<string> {
    const encodedServiceId = encodeURIComponent(id);
    const url = `${this.baseUrl}/services/${encodedServiceId}`;
    const response = await this.fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to delete service"
      );
    }

    return response.json();
  }

  /**
   * Create or update the service info
   * @param service Service info to register
   * @returns Promise resolving when service info is updated
   */
  async createOrUpdateServiceInfo(service: ServiceRegister): Promise<void> {
    const url = `${this.baseUrl}/service-info`;
    const response = await this.fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to create/update service info"
      );
    }
  }
}
