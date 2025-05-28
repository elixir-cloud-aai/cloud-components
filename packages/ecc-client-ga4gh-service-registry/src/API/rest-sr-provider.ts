import { ServiceRegistryAPI } from "./sr-api.js";
import { ServiceRegistryProvider } from "../providers/sr-provider.js";

/**
 * Default implementation of the ServiceRegistryProvider interface using the REST API
 * This wraps the existing ServiceRegistryAPI class
 */
export class RestServiceRegistryProvider implements ServiceRegistryProvider {
  private api: ServiceRegistryAPI;

  constructor(baseUrl: string) {
    this.api = new ServiceRegistryAPI(baseUrl);
  }

  async getServices() {
    return this.api.getServices();
  }

  async getServiceById(id: string) {
    return this.api.getServiceById(id);
  }

  async getServiceTypes() {
    return this.api.getServiceTypes();
  }

  async getServiceInfo() {
    return this.api.getServiceInfo();
  }
}
