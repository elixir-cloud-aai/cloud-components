/**
 * Types for the GA4GH DRS API based on OpenAPI specification v1.2.0
 */

// Access method types supported by the DRS API
export type AccessMethodType =
  | "s3"
  | "gs"
  | "ftp"
  | "gsiftp"
  | "globus"
  | "htsget"
  | "https"
  | "file";

// Checksum interface for cryptographic file verification
export interface Checksum {
  checksum: string;
  type: string;
}

// AccessURL interface for access URL with optional headers
export interface AccessURL {
  url: string;
  headers?: string[];
}

// AccessMethod interface for object access methods
export interface AccessMethod {
  type: AccessMethodType;
  access_id?: string;
  access_url?: AccessURL;
  region?: string;
}

// ContentsObject interface for bundle contents
export interface ContentsObject {
  name: string;
  id?: string;
  drs_uri?: string[];
  contents?: ContentsObject[];
}

// DrsObject interface matching DRS API schema
export interface DrsObject {
  id: string;
  self_uri: string;
  size: number;
  created_time: string;
  checksums: Checksum[];
  updated_time?: string;
  version?: string;
  mime_type?: string;
  name?: string;
  description?: string;
  aliases?: string[];
  access_methods?: AccessMethod[];
  contents?: ContentsObject[];
}

// ServiceType interface
export interface ServiceType {
  group: string;
  artifact: string;
  version: string;
}

// Organization interface
export interface Organization {
  name: string;
  url: string;
}

// Service interface for DRS service info
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

// Error interface for API errors
export interface Error {
  msg?: string;
  status_code?: number;
}

/**
 * Interface defining the operations required for DRS data providers
 * Implementations could use REST API, GraphQL, or any other data source
 */
export interface DrsProvider {
  // List view methods
  getObjects(
    offset?: number,
    limit?: number
  ): Promise<{
    objects: DrsObject[];
    pagination?: {
      offset: number;
      limit: number;
      total: number;
    };
  }>;

  // Detail view methods
  getObject(objectId: string, expand?: boolean): Promise<DrsObject>;
  getAccessURL(objectId: string, accessId: string): Promise<AccessURL>;

  // Service info
  getServiceInfo(): Promise<Service>;
}
