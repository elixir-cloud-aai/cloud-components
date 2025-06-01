import {
  CloudRegistryProvider,
  ExternalService,
  Service,
  ServiceType,
  ExternalServiceRegister,
  ServiceRegister,
} from "./cr-provider.js";

/**
 * Implementation of the CloudRegistryProvider interface using direct REST API calls
 * This class combines the functionality of ServiceRegistryAPI and RestCloudRegistryProvider
 */
export class RestCloudRegistryProvider implements CloudRegistryProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) {}

  /**
   * Fetch list of services from the registry
   * @returns Promise resolving to array of services
   */
  async getServices(): Promise<ExternalService[]> {
    const url = `${this.baseUrl}/services`;
    const response = await fetch(url);
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
    const response = await fetch(url);
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
    const response = await fetch(url);
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
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch service info: ${response.statusText}`);
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error(`Failed to create service: ${response.statusText}`);
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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create service with ID: ${response.statusText}`
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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error(`Failed to update service: ${response.statusText}`);
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
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete service: ${response.statusText}`);
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create/update service info: ${response.statusText}`
      );
    }
  }
}
