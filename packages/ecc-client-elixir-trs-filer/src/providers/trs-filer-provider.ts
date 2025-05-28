/* eslint-disable import/named */
/**
 * Types for the GA4GH TRS API based on OpenAPI specification v2.0.1
 */

// Import base types from the GA4GH TRS package

import {
  TrsProvider,
  DescriptorType,
  DescriptorTypeWithPlain,
  DescriptorTypeVersion,
  ImageType,
  Tool,
  ToolClass,
  ToolVersion,
  ToolFile,
  FileWrapper,
  Checksum,
  ImageData,
  Error,
} from "@elixir-cloud/trs/providers";

/**
 * TRS-Filer specific types that extend the base GA4GH TRS types
 */

// ChecksumRegister interface for tool registration (TRS-Filer specific)
export interface ChecksumRegister {
  checksum: string;
  type: string;
}

// ImageDataRegister interface for tool registration (TRS-Filer specific)
export interface ImageDataRegister {
  registry_host?: string;
  image_name?: string;
  size?: number;
  updated?: string;
  checksum?: ChecksumRegister[];
  image_type?: ImageType;
}

// ToolClassRegister interface for tool class creation (TRS-Filer specific)
export interface ToolClassRegister {
  name: string;
  description?: string;
}

// ToolClassRegisterId interface for tool class creation with ID (TRS-Filer specific)
export interface ToolClassRegisterId {
  id: string;
  name: string;
  description?: string;
}

// ToolFileRegister interface for tool registration (TRS-Filer specific)
export interface ToolFileRegister {
  path: string;
  file_type:
    | "TEST_FILE"
    | "PRIMARY_DESCRIPTOR"
    | "SECONDARY_DESCRIPTOR"
    | "CONTAINERFILE"
    | "OTHER";
}

// FileWrapperRegister interface for tool registration (TRS-Filer specific)
export interface FileWrapperRegister {
  content?: string;
  url?: string;
  checksum?: ChecksumRegister[];
}

// TypeRegister type for tool registration (TRS-Filer specific)
export type TypeRegister = DescriptorType | ImageType;

// FilesRegister interface for tool registration (TRS-Filer specific)
export interface FilesRegister {
  tool_file: ToolFileRegister;
  file_wrapper: FileWrapperRegister;
  type: TypeRegister;
}

// ToolVersionRegister interface for tool version creation (TRS-Filer specific)
export interface ToolVersionRegister {
  author?: string[];
  descriptor_type?: DescriptorType[];
  files?: FilesRegister[];
  images?: ImageDataRegister[];
  included_apps?: string[];
  is_production?: boolean;
  name?: string;
  signed?: boolean;
  verified?: boolean;
  verified_source?: string[];
}

// ToolVersionRegisterId interface for tool version creation with ID (TRS-Filer specific)
export interface ToolVersionRegisterId {
  id: string;
  author?: string[];
  descriptor_type?: DescriptorType[];
  files?: FilesRegister[];
  images?: ImageDataRegister[];
  included_apps?: string[];
  is_production?: boolean;
  name?: string;
  signed?: boolean;
  verified?: boolean;
  verified_source?: string[];
}

// ToolRegister interface for tool creation (TRS-Filer specific)
export interface ToolRegister {
  aliases?: string[];
  checker_url?: string;
  description?: string;
  has_checker?: boolean;
  name?: string;
  organization: string;
  toolclass: ToolClassRegisterId;
  versions: (ToolVersionRegister | ToolVersionRegisterId)[];
}

// Service-related types for TRS-Filer

// ServiceType interface for GA4GH service type
export interface ServiceType {
  group: string;
  artifact: string;
  version: string;
}

// ServiceTypeRegister interface for service type registration
export interface ServiceTypeRegister {
  group: string;
  artifact: string;
  version: string;
}

// Organization interface for service organization
export interface Organization {
  name: string;
  url: string;
}

// Service interface for GA4GH service
export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  organization: Organization;
  version: string;
  description?: string;
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
}

// ServiceRegister interface for service creation
export interface ServiceRegister {
  id: string;
  name: string;
  type: ServiceTypeRegister;
  organization: Organization;
  version: string;
  description?: string;
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
}

/**
 * Interface defining the operations required for TRS-Filer data providers
 * Extends the base TrsProvider with TRS-Filer specific creation and deletion operations
 */
export interface TrsFilerProvider extends TrsProvider {
  // Creation methods (TRS-Filer specific)
  createTool(tool: ToolRegister): Promise<string>;
  createToolWithId(id: string, tool: ToolRegister): Promise<string>;
  createToolVersion(
    toolId: string,
    version: ToolVersionRegister
  ): Promise<string>;
  createToolVersionWithId(
    toolId: string,
    versionId: string,
    version: ToolVersionRegister
  ): Promise<string>;
  createToolClass(toolClass: ToolClassRegister): Promise<string>;
  createToolClassWithId(
    id: string,
    toolClass: ToolClassRegister
  ): Promise<string>;

  // Deletion methods (TRS-Filer specific)
  deleteTool?(id: string): Promise<string>;
  deleteToolVersion?(toolId: string, versionId: string): Promise<string>;
  deleteToolClass?(id: string): Promise<string>;

  // Service info methods (TRS-Filer specific)
  getServiceInfo?(): Promise<Service>;
  createOrUpdateServiceInfo?(service: ServiceRegister): Promise<void>;
}

// Re-export base types from GA4GH TRS for convenience
export {
  TrsProvider,
  DescriptorType,
  DescriptorTypeWithPlain,
  DescriptorTypeVersion,
  ImageType,
  Tool,
  ToolClass,
  ToolVersion,
  ToolFile,
  FileWrapper,
  Checksum,
  ImageData,
  Error,
};
