import {
  DrsProvider, DrsObject, AccessURL,
  Service,
} from "./drs-provider.js";
import { fetcher } from "@elixir-cloud/design";

/**
 * Implementation of the DrsProvider interface using direct REST API calls
 * This class provides standard GA4GH DRS API functionality
 */
export class RestDrsProvider implements DrsProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) { }

  async getObjects(
    limit?: number,
    offset = 0
  ): Promise<{
    objects: DrsObject[];
    pagination?: {
      offset: number;
      limit: number;
      total: number;
    };
  }> {
    let url = `${this.baseUrl}/objects`;
    const params = new URLSearchParams();

    if (offset > 0) {
      params.append("offset", offset.toString());
    }

    if (limit !== undefined) {
      params.append("limit", limit.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetcher(url, undefined, "ga4gh-drs/objects/get");
    if (!response.ok) {
      throw new Error(`Failed to fetch objects: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      objects: data.objects || [],
      pagination: data.pagination,
    };
  }

  async getObject(objectId: string, expand = false): Promise<DrsObject> {
    const encodedObjectId = encodeURIComponent(objectId);
    let url = `${this.baseUrl}/objects/${encodedObjectId}`;

    if (expand) {
      url += "?expand=true";
    }

    const response = await fetcher(url, undefined, "ga4gh-drs/objects/id");
    if (!response.ok) {
      throw new Error(`Failed to fetch object: ${response.statusText}`);
    }
    return response.json();
  }

  async getAccessURL(objectId: string, accessId: string): Promise<AccessURL> {
    const encodedObjectId = encodeURIComponent(objectId);
    const encodedAccessId = encodeURIComponent(accessId);
    const response = await fetcher(
      `${this.baseUrl}/objects/${encodedObjectId}/access/${encodedAccessId}`,
      undefined,
      "ga4gh-drs/objects/access"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch access URL: ${response.statusText}`);
    }
    return response.json();
  }

  async getServiceInfo(): Promise<Service> {
    const response = await fetcher(`${this.baseUrl}/service-info`, undefined, "ga4gh-drs/service-info");
    if (!response.ok) {
      throw new Error(`Failed to fetch service info: ${response.statusText}`);
    }
    return response.json();
  }
}
