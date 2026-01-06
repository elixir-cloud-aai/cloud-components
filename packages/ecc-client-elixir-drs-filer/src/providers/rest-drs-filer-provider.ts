import {
  DrsFilerProvider,
  DrsObject,
  AccessURL,
  Service,
  DrsObjectRegister,
  ServiceRegister,
} from "./drs-filer-provider.js";

/**
 * Implementation of the DrsFilerProvider interface using direct REST API calls
 * This class provides DRS-Filer specific functionality for object management
 */
export class RestDrsFilerProvider implements DrsFilerProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) {}

  // Base DRS operations (inherited from DrsProvider)
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

    const response = await fetch(url);
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

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch object: ${response.statusText}`);
    }
    return response.json();
  }

  async getAccessURL(objectId: string, accessId: string): Promise<AccessURL> {
    const encodedObjectId = encodeURIComponent(objectId);
    const encodedAccessId = encodeURIComponent(accessId);
    const response = await fetch(
      `${this.baseUrl}/objects/${encodedObjectId}/access/${encodedAccessId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch access URL: ${response.statusText}`);
    }
    return response.json();
  }

  async getServiceInfo(): Promise<Service> {
    const response = await fetch(`${this.baseUrl}/service-info`);
    if (!response.ok) {
      throw new Error(`Failed to fetch service info: ${response.statusText}`);
    }
    return response.json();
  }

  // DRS-Filer specific operations
  async createObject(object: DrsObjectRegister): Promise<string> {
    const response = await fetch(`${this.baseUrl}/objects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });

    if (!response.ok) {
      throw new Error(`Failed to create object: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  async createObjectWithId(
    id: string,
    object: DrsObjectRegister
  ): Promise<string> {
    const encodedObjectId = encodeURIComponent(id);
    const response = await fetch(`${this.baseUrl}/objects/${encodedObjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });

    if (!response.ok) {
      throw new Error(`Failed to create/update object: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  async updateObject(id: string, object: DrsObjectRegister): Promise<string> {
    const encodedObjectId = encodeURIComponent(id);
    const response = await fetch(`${this.baseUrl}/objects/${encodedObjectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });

    if (!response.ok) {
      throw new Error(`Failed to update object: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  }

  async deleteObject(id: string): Promise<void> {
    const encodedObjectId = encodeURIComponent(id);
    const response = await fetch(`${this.baseUrl}/objects/${encodedObjectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete object: ${response.statusText}`);
    }
  }

  async deleteAccessMethod(objectId: string, accessId: string): Promise<void> {
    const encodedObjectId = encodeURIComponent(objectId);
    const encodedAccessId = encodeURIComponent(accessId);
    const response = await fetch(
      `${this.baseUrl}/objects/${encodedObjectId}/access/${encodedAccessId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete access method: ${response.statusText}`);
    }
  }

  async updateServiceInfo(service: ServiceRegister): Promise<void> {
    const response = await fetch(`${this.baseUrl}/service-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error(`Failed to update service info: ${response.statusText}`);
    }
  }
}
