import {
  Tool,
  ToolClass,
  ToolFile,
  ToolVersion,
  FileWrapper,
  DescriptorType,
} from "../providers/trs-provider.js";

/**
 * API class for interacting with GA4GH TRS API
 */
export class TrsAPI {
  // eslint-disable-next-line no-useless-constructor
  constructor(public readonly baseUrl: string) {}

  /**
   * Fetch list of tools with optional filters
   * @param limit Maximum number of tools to return
   * @param offset Offset for pagination (number of tools to skip)
   * @param filterParams Object containing filter parameters
   * @param searchQuery Optional search query
   * @returns Promise resolving to array of tools
   */
  async getToolsList(
    limit?: number,
    offset?: number,
    filterParams: { [key: string]: string | undefined | boolean } = {},
    searchQuery = ""
  ): Promise<Tool[]> {
    let url = `${this.baseUrl}/tools?${limit ? `limit=${limit}&` : ""}${
      offset ? `offset=${offset}&` : ""
    }`;

    // Add search query if provided
    if (searchQuery && searchQuery.length > 0) {
      url += `&name=${encodeURIComponent(searchQuery)}`;
    }

    // Add filter parameters
    Object.entries(filterParams).forEach(([key, value]) => {
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

  /**
   * Fetch tool classes
   * @returns Promise resolving to array of tool classes
   */
  async getToolClasses(): Promise<ToolClass[]> {
    const url = `${this.baseUrl}/toolClasses`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tool classes: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch a specific tool by ID
   * @param toolId ID of the tool to fetch
   * @returns Promise resolving to tool details
   */
  async getTool(toolId: string): Promise<Tool> {
    const encodedToolId = encodeURIComponent(toolId);
    const response = await fetch(`${this.baseUrl}/tools/${encodedToolId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tool: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch versions of a specific tool
   * @param toolId ID of the tool
   * @returns Promise resolving to array of tool versions
   */
  async getToolVersions(toolId: string): Promise<ToolVersion[]> {
    const encodedToolId = encodeURIComponent(toolId);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tool versions: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch specific version of a tool
   * @param toolId ID of the tool
   * @param versionId ID of the version
   * @returns Promise resolving to tool version details
   */
  async getToolVersion(
    toolId: string,
    versionId: string
  ): Promise<ToolVersion> {
    const encodedToolId = encodeURIComponent(toolId);
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

  /**
   * Fetch the descriptor file for a tool version
   * @param toolId ID of the tool
   * @param versionId ID of the version
   * @param type Type of the descriptor (CWL, WDL, etc.)
   * @returns Promise resolving to descriptor file
   */
  async getToolDescriptor(
    toolId: string,
    versionId: string,
    type: DescriptorType
  ): Promise<FileWrapper> {
    const encodedToolId = encodeURIComponent(toolId);
    const version = versionId.split(":")[1]
      ? versionId.split(":")[1]
      : versionId;
    const encodedVersionId = encodeURIComponent(version);
    const encodedType = encodeURIComponent(type);
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

  /**
   * Fetch containerfile for a tool version
   * @param toolId ID of the tool
   * @param versionId ID of the version
   * @returns Promise resolving to containerfile
   */
  async getContainerfile(
    toolId: string,
    versionId: string
  ): Promise<FileWrapper[]> {
    const encodedToolId = encodeURIComponent(toolId);
    const version = versionId.split(":")[1]
      ? versionId.split(":")[1]
      : versionId;
    const encodedVersionId = encodeURIComponent(version);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/containerfile`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch containerfile: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch test files for a tool version
   * @param toolId ID of the tool
   * @param versionId ID of the version
   * @param type Type of the descriptor (CWL, WDL, etc.)
   * @returns Promise resolving to test files
   */
  async getToolTests(
    toolId: string,
    versionId: string,
    type: DescriptorType
  ): Promise<FileWrapper[]> {
    const encodedToolId = encodeURIComponent(toolId);
    const version = versionId.split(":")[1]
      ? versionId.split(":")[1]
      : versionId;
    const encodedVersionId = encodeURIComponent(version);
    const encodedType = encodeURIComponent(type);
    const response = await fetch(
      `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/tests`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch tool tests: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch file listing for a tool version
   * @param toolId ID of the tool
   * @param versionId ID of the version
   * @param type Type of the descriptor (CWL, WDL, etc.)
   * @param format Optional format parameter (zip)
   * @returns Promise resolving to file listing
   */
  async getToolFiles(
    toolId: string,
    versionId: string,
    type: DescriptorType,
    format?: "zip"
  ): Promise<ToolFile[]> {
    const encodedToolId = encodeURIComponent(toolId);
    const version = versionId.split(":")[1]
      ? versionId.split(":")[1]
      : versionId;
    const encodedVersionId = encodeURIComponent(version);
    const encodedType = encodeURIComponent(type);

    let url = `${this.baseUrl}/tools/${encodedToolId}/versions/${encodedVersionId}/${encodedType}/files`;
    if (format) {
      url += `?format=${format}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tool files: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Fetch the descriptor file content by relative path
   * @param toolId ID of the tool
   * @param versionId ID of the version
   * @param type Type of the descriptor (CWL, WDL, etc.)
   * @param path Relative path to the descriptor file
   * @returns Promise resolving to file content
   */
  async getToolDescriptorByPath(
    toolId: string,
    versionId: string,
    type: DescriptorType,
    path: string
  ): Promise<FileWrapper> {
    const encodedToolId = encodeURIComponent(toolId);
    const version = versionId.split(":")[1]
      ? versionId.split(":")[1]
      : versionId;
    const encodedVersionId = encodeURIComponent(version);
    const encodedType = encodeURIComponent(type);

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
}
