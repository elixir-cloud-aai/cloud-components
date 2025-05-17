import { TrsAPI } from "../API/trs-api.js";
import { TrsProvider, DescriptorType } from "../providers/trs-provider.js";

/**
 * Default implementation of the TrsProvider interface using the REST API
 * This wraps the existing TrsAPI class to maintain backward compatibility
 */
export class RestTrsProvider implements TrsProvider {
  private api: TrsAPI;

  constructor(baseUrl: string) {
    this.api = new TrsAPI(baseUrl);
  }

  async getToolClasses() {
    return this.api.getToolClasses();
  }

  async getToolsList(
    limit: number,
    offset: number,
    filters: Record<string, string | undefined | boolean>,
    query: string
  ) {
    return this.api.getToolsList(limit, offset, filters, query);
  }

  async getTool(id: string) {
    return this.api.getTool(id);
  }

  async getToolVersions(id: string) {
    return this.api.getToolVersions(id);
  }

  async getToolVersion(id: string, versionId: string) {
    return this.api.getToolVersion(id, versionId);
  }

  async getToolFiles(
    id: string,
    version: string,
    descriptorType: DescriptorType,
    format?: "zip"
  ) {
    return this.api.getToolFiles(id, version, descriptorType, format);
  }

  async getToolDescriptor(
    id: string,
    version: string,
    descriptorType: DescriptorType
  ) {
    return this.api.getToolDescriptor(id, version, descriptorType);
  }

  async getToolDescriptorByPath(
    id: string,
    version: string,
    descriptorType: DescriptorType,
    path: string
  ) {
    return this.api.getToolDescriptorByPath(id, version, descriptorType, path);
  }

  async getContainerfile(id: string, version: string) {
    return this.api.getContainerfile(id, version);
  }

  async getToolTests(
    id: string,
    version: string,
    descriptorType: DescriptorType
  ) {
    return this.api.getToolTests(id, version, descriptorType);
  }
}
