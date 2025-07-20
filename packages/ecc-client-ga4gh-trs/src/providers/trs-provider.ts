/**
 * Types for the GA4GH TRS API based on OpenAPI specification v2.0.1
 */

// Descriptor types supported by the TRS API
export type DescriptorType = "CWL" | "WDL" | "NFL" | "GALAXY" | "SMK";

// DescriptorTypeWithPlain includes plain types that return raw text
export type DescriptorTypeWithPlain =
  | DescriptorType
  | "PLAIN_CWL"
  | "PLAIN_WDL"
  | "PLAIN_NFL"
  | "PLAIN_GALAXY"
  | "PLAIN_SMK";

// DescriptorTypeVersion describes the language version for a given descriptor type
export type DescriptorTypeVersion = string;

// Checksum interface for cryptographic file verification
export interface Checksum {
  checksum: string;
  type: string;
}

// ImageType enum
export type ImageType = "Docker" | "Singularity" | "Conda";

// ImageData interface
export interface ImageData {
  registry_host?: string;
  image_name?: string;
  size?: number;
  updated?: string;
  checksum?: Checksum[];
  image_type?: ImageType;
}

// ToolClass interface
export interface ToolClass {
  id: string;
  name: string;
  description?: string;
}

// ToolVersion interface matching TRS API schema
export interface ToolVersion {
  author?: string[];
  name?: string;
  url: string;
  id: string;
  is_production?: boolean;
  images?: ImageData[];
  descriptor_type?: DescriptorType[];
  descriptor_type_version?: Record<DescriptorType, DescriptorTypeVersion[]>;
  containerfile?: boolean;
  description?: string;
  meta_version?: string;
  verified?: boolean;
  verified_source?: string[];
  signed?: boolean;
  included_apps?: string[];
}

// Tool interface matching TRS API schema
export interface Tool {
  url: string;
  id: string;
  aliases?: string[];
  organization: string;
  name?: string;
  toolclass: ToolClass;
  description?: string;
  meta_version?: string;
  has_checker?: boolean;
  checker_url?: string;
  versions: ToolVersion[];
}

// ToolFile interface for file entries
export interface ToolFile {
  path: string;
  file_type?:
    | "TEST_FILE"
    | "PRIMARY_DESCRIPTOR"
    | "SECONDARY_DESCRIPTOR"
    | "CONTAINERFILE"
    | "OTHER";
  checksum?: Checksum;
}

// FileWrapper interface for file content
export interface FileWrapper {
  content?: string;
  url?: string;
  checksum?: Checksum[];
  image_type?: ImageType | DescriptorType;
}

// Error interface for API errors
export interface Error {
  code: number;
  message?: string;
}

/**
 * Interface defining the operations required for TRS data providers
 * Implementations could use REST API, GraphQL, or any other data source
 */
export interface TrsProvider {
  // List view methods
  getToolClasses(): Promise<ToolClass[]>;
  getToolsList(
    limit: number,
    offset: number,
    filters: Record<string, string | undefined | boolean>,
    query: string
  ): Promise<Tool[]>;

  // Detail view methods
  getTool(url: string, id: string): Promise<Tool>;
  getToolVersions(url: string, id: string): Promise<ToolVersion[]>;
  getToolVersion(
    url: string,
    id: string,
    versionId: string
  ): Promise<ToolVersion>;
  getToolFiles(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType,
    format?: "zip"
  ): Promise<ToolFile[]>;
  getToolDescriptor(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType
  ): Promise<FileWrapper>;
  getToolDescriptorByPath(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType,
    path: string
  ): Promise<FileWrapper>;
  getContainerfile(
    url: string,
    id: string,
    version: string
  ): Promise<FileWrapper[]>;
  getToolTests(
    url: string,
    id: string,
    version: string,
    descriptorType: DescriptorType
  ): Promise<FileWrapper[]>;
}
