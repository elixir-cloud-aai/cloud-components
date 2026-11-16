/**
 * Which services are verified. A verification (from `GET /verifications` or
 * `GET /services/{serviceId}/verification`) only counts while the service
 * still has the verified URL and API type (`type.group` and
 * `type.artifact`; not `type.version`). The registry stores them as it read
 * them from the service and removes the verification when either changes,
 * so they are compared exactly; but a list of services and a list of
 * verifications loaded one after the other may disagree.
 */

import type {
  ExternalService,
  ServiceType,
  ServiceTypeRegister,
  ServiceVerification,
} from "./cr-provider.js";

/**
 * Whether a verification still matches a service: the same URL and API type
 * (`group` and `artifact`), compared exactly
 * @param service URL and API type of the service, e.g. as registered
 * @param verification URL and API type that were verified
 * @returns `true` if they match
 */
export function matchesVerification(
  service: { url: string; type: ServiceType | ServiceTypeRegister },
  verification: { url: string; type: ServiceType | ServiceTypeRegister }
): boolean {
  return (
    service.url === verification.url &&
    service.type.group === verification.type.group &&
    service.type.artifact === verification.type.artifact
  );
}

/**
 * The verifications that still match their services, e.g. to show which
 * services of a list are verified with one request for all
 * @param services Services as registered (`GET /services`)
 * @param verifications Verifications (`GET /verifications`)
 * @returns The matching verifications by service ID; services without one
 * aren't verified
 */
export function verifiedServices(
  services: ExternalService[],
  verifications: ServiceVerification[]
): Map<string, ServiceVerification> {
  const servicesById = new Map(
    services.map((service) => [service.id, service])
  );
  return new Map(
    verifications
      .filter((verification) => {
        const service = servicesById.get(verification.serviceId);
        return !!service && matchesVerification(service, verification);
      })
      .map((verification) => [verification.serviceId, verification])
  );
}
