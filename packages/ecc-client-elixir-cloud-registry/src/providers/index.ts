// a type export: browsers loading the unbundled modules (e.g. in tests)
// find no value export of an interface
export type { CloudRegistryProvider } from "./cr-provider.js";

export { RestCloudRegistryProvider } from "./rest-cr-provider.js";

export { CloudRegistryError } from "./errors.js";
export type { ProblemDetails } from "./errors.js";

export type {
  Service,
  ServiceType,
  Organization,
  ExternalService,
  Error,
  ServiceTypeRegister,
  ServiceRegister,
  ExternalServiceRegister,
} from "./cr-provider.js";
