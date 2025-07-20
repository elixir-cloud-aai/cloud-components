// Export providers
export { TrsFilerProvider } from "./trs-filer-provider.js";
export { RestTrsFilerProvider } from "./rest-trs-filer-provider.js";

// Export base types (re-exported from GA4GH TRS)
export type {
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
  TrsProvider,
} from "./trs-filer-provider.js";

// Export TRS-Filer specific types
export type {
  TypeRegister,
  ToolRegister,
  ToolClassRegister,
  ToolClassRegisterId,
  ToolVersionRegister,
  ToolVersionRegisterId,
  ToolFileRegister,
  FileWrapperRegister,
  FilesRegister,
  ChecksumRegister,
  ImageDataRegister,
  // Service types
  Service,
  ServiceRegister,
  ServiceType,
  ServiceTypeRegister,
  Organization,
} from "./trs-filer-provider.js";
