import {
  CloudRegistryProvider,
  ExternalService,
  ServiceType,
  ExternalServiceRegister,
  ServiceRegister,
  RegistryServiceInfo,
  ServiceVerification,
  Verification,
  VerificationRegister,
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
   * List the verified services (`GET /verifications`). An entry only counts
   * while the service still has its URL and API type; see
   * `verifiedServices()`.
   * @returns Promise resolving to the verifications, sorted by service ID
   */
  async getVerifications(): Promise<ServiceVerification[]> {
    const url = `${this.baseUrl}/verifications`;
    const response = await this.fetch(url);
    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to fetch verifications"
      );
    }
    return response.json();
  }

  /**
   * Get the verification of a service. Rejects with status `404` if the
   * service isn't verified (or unknown).
   * @param id Service identifier
   * @returns Promise resolving to the verification
   */
  async getServiceVerification(id: string): Promise<Verification> {
    const encodedServiceId = encodeURIComponent(id);
    const url = `${this.baseUrl}/services/${encodedServiceId}/verification`;
    const response = await this.fetch(url);
    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to fetch verification"
      );
    }
    return response.json();
  }

  /**
   * Verify a service (admins only). With the URL and API type that were
   * checked, the registry only verifies the service if it still has them,
   * else it rejects with status `409` (problem `code`
   * `verification-mismatch`); without them, it verifies the service as it
   * is registered.
   * @param id Service identifier
   * @param verification URL and API type that were checked (recommended)
   * @returns Promise resolving to the verification
   */
  async verifyService(
    id: string,
    verification?: VerificationRegister
  ): Promise<Verification> {
    const encodedServiceId = encodeURIComponent(id);
    const url = `${this.baseUrl}/services/${encodedServiceId}/verification`;
    const response = await this.fetch(
      url,
      verification
        ? {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(verification),
          }
        : { method: "PUT" }
    );

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to verify service"
      );
    }

    return response.json();
  }

  /**
   * Remove the verification of a service (admins only). Rejects with status
   * `404` if the service isn't verified (or unknown).
   * @param id Service identifier
   * @returns Promise resolving to the service identifier
   */
  async deleteServiceVerification(id: string): Promise<string> {
    const encodedServiceId = encodeURIComponent(id);
    const url = `${this.baseUrl}/services/${encodedServiceId}/verification`;
    const response = await this.fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw await CloudRegistryError.fromResponse(
        response,
        "Failed to remove verification"
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
