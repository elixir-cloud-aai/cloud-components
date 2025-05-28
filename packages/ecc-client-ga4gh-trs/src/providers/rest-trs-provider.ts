import {
  TrsProvider,
  DescriptorType,
  Tool,
  ToolClass,
  ToolFile,
  ToolVersion,
  FileWrapper,
} from "./trs-provider.js";

/**
 * Implementation of the TrsProvider interface using direct REST API calls
 * This class combines the functionality of TrsAPI and RestTrsProvider
 */
export class RestTrsProvider implements TrsProvider {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) {}

  async getToolClasses(): Promise<ToolClass[]> {
    const url = `${this.baseUrl}/toolClasses`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tool classes: ${response.statusText}`);
    }
    return response.json();
  }

  async getToolsList(
    limit: number,
    offset: number,
    filters: Record<string, string | undefined | boolean>,
    query: string
  ): Promise<Tool[]> {
    let url = `${this.baseUrl}/tools?${limit ? `limit=${limit}&` : ""}${
      offset ? `offset=${offset}&` : ""
    }`;

    // Add search query if provided
    if (query && query.length > 0) {
      url += `&name=${encodeURIComponent(query)}`;
    }

    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined && key !== "offset") {
        url += `&${key}=${encodeURIComponent(String(value))}`;
      }
    });

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tools: ${response.statusText}`);
    }
    return response.json();
  }

  async getTool(url: string, id: string): Promise<Tool> {
    const encodedToolId = encodeURIComponent(id);
    const response = await fetch(`${this.baseUrl}/tools/${encodedToolId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tool: ${response.statusText}`);
    }
    return response.json();
  }

  async getToolVersions(url: string, id: string): Promise<ToolVersion[]> {
    const encodedToolId = encodeURIComponent(id);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tool versions: ${response.statusText}`);
    }
    return response.json();
  }

  async getToolVersion(
    url: string,
    id: string,
    versionId: string
  ): Promise<ToolVersion> {
    const encodedToolId = encodeURIComponent(id);
    const version = versionId.split(":")[1]
      ? versionId.split(":")[1]
      : versionId;
    const encodedVersionId = encodeURIComponent(version);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tool version: ${response.statusText}`);
    }
    return response.json();
  }

  async getToolFiles(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType,
    format?: "zip"
  ): Promise<ToolFile[]> {
    const encodedToolId = encodeURIComponent(id);
    const versionPart = version.split(":")[1] ? version.split(":")[1] : version;
    const encodedVersionId = encodeURIComponent(versionPart);
    const encodedType = encodeURIComponent(descriptorType);

    let requestUrl = `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/files`;
    if (format) {
      requestUrl += `?format=${format}`;
    }
    const response = await fetch(requestUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch tool files: ${response.statusText}`);
    }
    return response.json();
  }

  async getToolDescriptor(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType
  ): Promise<FileWrapper> {
    const encodedToolId = encodeURIComponent(id);
    const versionPart = version.split(":")[1] ? version.split(":")[1] : version;
    const encodedVersionId = encodeURIComponent(versionPart);
    const encodedType = encodeURIComponent(descriptorType);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/descriptor`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch tool descriptor: ${response.statusText}`
      );
    }
    return response.json();
  }

  async getToolDescriptorByPath(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType,
    path: string
  ): Promise<FileWrapper> {
    const encodedToolId = encodeURIComponent(id);
    const versionPart = version.split(":")[1] ? version.split(":")[1] : version;
    const encodedVersionId = encodeURIComponent(versionPart);
    const encodedType = encodeURIComponent(descriptorType);

    // Try with unencoded path first
    try {
      const response = await fetch(
        `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/descriptor/${path}`
      );

      if (response.ok) {
        return response.json();
      }

      // If unencoded path fails, try with encoded path
      const encodedPath = encodeURIComponent(path);
      const encodedResponse = await fetch(
        `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/descriptor/${encodedPath}`
      );

      if (encodedResponse.ok) {
        return encodedResponse.json();
      }

      // If both attempts fail, throw error from the second attempt
      throw new Error(
        `Failed to fetch tool descriptor by path: ${encodedResponse.statusText}`
      );
    } catch (error) {
      // If there's a network error or other exception, try encoded path
      const encodedPath = encodeURIComponent(path);
      try {
        const encodedResponse = await fetch(
          `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/descriptor/${encodedPath}`
        );

        if (encodedResponse.ok) {
          return encodedResponse.json();
        }

        throw new Error(
          `Failed to fetch tool descriptor by path: ${encodedResponse.statusText}`
        );
      } catch (encodedError) {
        // Throw the original error if both attempts fail
        throw error;
      }
    }
  }

  async getContainerfile(
    url: string,
    id: string,
    version: string
  ): Promise<FileWrapper[]> {
    const encodedToolId = encodeURIComponent(id);
    const versionPart = version.split(":")[1] ? version.split(":")[1] : version;
    const encodedVersionId = encodeURIComponent(versionPart);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/containerfile`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch containerfile: ${response.statusText}`);
    }
    return response.json();
  }

  async getToolTests(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType
  ): Promise<FileWrapper[]> {
    const encodedToolId = encodeURIComponent(id);
    const versionPart = version.split(":")[1] ? version.split(":")[1] : version;
    const encodedVersionId = encodeURIComponent(versionPart);
    const encodedType = encodeURIComponent(descriptorType);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/tests`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tool tests: ${response.statusText}`);
    }
    return response.json();
  }
}
