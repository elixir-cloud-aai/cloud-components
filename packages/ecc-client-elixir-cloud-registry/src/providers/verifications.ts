/**
 * Which services are verified. A verification (from `GET /verifications` or
 * `GET /services/{serviceId}/verification`) only counts while the service
 * still has the verified URL (as written) and API type (`type.group` and
 * `type.artifact`, trimmed and case-insensitive; not `type.version`), as the
 * registry compares them when it verifies a service. The registry removes a
 * verification when they change, but a list of services and a list of
 * verifications loaded one after the other may disagree.
 *
 * The registry compares with Python's `strip().casefold()`: trimming here
 * uses the same white space (JavaScript's `\s` without U+FEFF, plus
 * U+001C-U+001F and U+0085), and case folding, which JavaScript lacks a
 * built-in for, is approximated (see `caseFold()`; e.g. `ß` and `SS` match).
 */

import type {
  ExternalService,
  ServiceType,
  ServiceTypeRegister,
  ServiceVerification,
} from "./cr-provider.js";

/** Whether a character is white space for Python's `str.strip()` */
function isSpace(char: string): boolean {
  return (
    (/\s/.test(char) && char !== "\uFEFF") ||
    "\x1c\x1d\x1e\x1f\x85".includes(char)
  );
}

/** The text without leading and trailing white space, as Python strips it */
function strip(text: string): string {
  let start = 0;
  let end = text.length;
  while (start < end && isSpace(text[start])) start += 1;
  while (end > start && isSpace(text[end - 1])) end -= 1;
  return text.slice(start, end);
}

/**
 * The text case-folded like Python's `str.casefold()`, approximated by
 * upper- then lower-casing, except for the two characters where that
 * differs: capital sharp s (U+1E9E) folds to `ss`, and dotless i (U+0131)
 * stays as it is (characters added in later Unicode versions may differ)
 */
function caseFold(text: string): string {
  return text
    .replace(/\u1E9E/g, "ss")
    .split("\u0131")
    .map((part) => part.toUpperCase().toLowerCase())
    .join("\u0131");
}

/** Whether two texts are equal, trimmed and case-insensitive */
function sameText(a: string, b: string): boolean {
  return caseFold(strip(a)) === caseFold(strip(b));
}

/**
 * Whether a verification still matches a service: the same URL (as written)
 * and API type (`group` and `artifact`)
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
    sameText(service.type.group, verification.type.group) &&
    sameText(service.type.artifact, verification.type.artifact)
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
