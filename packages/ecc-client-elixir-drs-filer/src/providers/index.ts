// Export providers
export { DrsFilerProvider } from "./drs-filer-provider.js";
export { RestDrsFilerProvider } from "./rest-drs-filer-provider.js";

// Export base types (re-exported from GA4GH DRS)
export type {
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
  DrsProvider,
} from "./drs-filer-provider.js";

// Export DRS-Filer specific types
export type {
  ChecksumRegister,
  AccessURLRegister,
  AccessMethodRegister,
  ContentsObjectRegister,
  DrsObjectRegister,
  ServiceRegister,
  ServiceTypeRegister,
  RegisterResponse,
} from "./drs-filer-provider.js";
