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
    limit = 5,
    offset = 0,
    filterParams: { [key: string]: string | undefined | boolean } = {},
    searchQuery = ""
  ) {
    let url = `${this.baseUrl}/tools?limit=${limit}&offset=${offset}`;

    // Add search query if provided
    if (searchQuery && searchQuery.length > 0) {
      url += `&toolname=${encodeURIComponent(searchQuery)}`;
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
  async getToolClasses() {
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
  async getTool(toolId: string) {
    const response = await fetch(`${this.baseUrl}/tools/${toolId}`);
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
  async getToolVersions(toolId: string) {
    const response = await fetch(`${this.baseUrl}/tools/${toolId}/versions`);
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
  async getToolVersion(toolId: string, versionId: string) {
    const response = await fetch(
      `${this.baseUrl}/tools/${toolId}/versions/${versionId}`
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
  async getToolDescriptor(toolId: string, versionId: string, type: string) {
    const response = await fetch(
      `${this.baseUrl}/tools/${toolId}/versions/${versionId}/${type}/descriptor`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch tool descriptor: ${response.statusText}`
      );
    }
    return response.json();
  }
}
