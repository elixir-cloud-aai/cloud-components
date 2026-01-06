/* eslint-disable import/named */
/**
 * Types for the GA4GH DRS API based on OpenAPI specification v1.2.0
 */

// Import base types from the GA4GH DRS package

import type {
  DrsProvider,
  AccessMethodType,
  DrsObject,
  AccessMethod,
  AccessURL,
  ContentsObject,
  Checksum,
  Service,
  ServiceType,
  Organization,
  Error,
} from "@elixir-cloud/drs/providers";

/**
 * DRS-Filer specific types that extend the base GA4GH DRS types
 */

// ChecksumRegister interface for object registration (DRS-Filer specific)
export interface ChecksumRegister {
  checksum: string;
  type: string;
}

// AccessURLRegister interface for object registration (DRS-Filer specific)
export interface AccessURLRegister {
  url: string;
  headers?: string[];
}

// AccessMethodRegister interface for object registration (DRS-Filer specific)
export interface AccessMethodRegister {
  type: AccessMethodType;
  access_url?: AccessURLRegister;
  region?: string;
}

// ContentsObjectRegister interface for bundle contents registration (DRS-Filer specific)
export interface ContentsObjectRegister {
  name: string;
  id?: string;
  drs_uri?: string[];
  contents?: ContentsObjectRegister[];
}

// DrsObjectRegister interface for object registration (DRS-Filer specific)
export interface DrsObjectRegister {
  size: number;
  created_time: string;
  checksums: ChecksumRegister[];
  updated_time?: string;
  version?: string;
  mime_type?: string;
  name?: string;
  description?: string;
  aliases?: string[];
  access_methods?: AccessMethodRegister[];
  contents?: ContentsObjectRegister[];
}

// ServiceTypeRegister interface for service type registration (DRS-Filer specific)
export interface ServiceTypeRegister {
  group: string;
  artifact: string;
  version: string;
}

// ServiceRegister interface for service registration (DRS-Filer specific)
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

// RegisterResponse interface for creation responses
export interface RegisterResponse {
  id: string;
}

// Re-export base types for convenience
export type {
  DrsProvider,
  AccessMethodType,
  DrsObject,
  AccessMethod,
  AccessURL,
  ContentsObject,
  Checksum,
  Service,
  ServiceType,
  Organization,
  Error,
};

/**
 * Interface defining the operations required for DRS-Filer data providers
 * Extends the base DrsProvider with DRS-Filer specific creation and deletion operations
 */
export interface DrsFilerProvider extends DrsProvider {
  // Creation methods (DRS-Filer specific)
  createObject(object: DrsObjectRegister): Promise<string>;
  createObjectWithId(id: string, object: DrsObjectRegister): Promise<string>;

  // Update methods (DRS-Filer specific)
  updateObject(id: string, object: DrsObjectRegister): Promise<string>;

  // Deletion methods (DRS-Filer specific)
  deleteObject(id: string): Promise<void>;
  deleteAccessMethod(objectId: string, accessId: string): Promise<void>;

  // Service management (DRS-Filer specific)
  updateServiceInfo(service: ServiceRegister): Promise<void>;
}
