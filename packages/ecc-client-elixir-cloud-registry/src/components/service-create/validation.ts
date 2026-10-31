/**
 * Checks of the create form, as Cloud Registry checks registrations
 * (`ExternalServiceRegister` of its API specification, cloud-registry 0.6.0,
 * and FOCA's `check_url()`), so that the form flags inputs that the API
 * would reject with `400` before sending them. The registry stays the
 * authority: these checks may miss rare cases (e.g. of international domain
 * names), which the registry then reports.
 */

/** Schemes of HTTP(S) URLs */
export const HTTP_SCHEMES = ["http", "https"];

/** Maximum lengths of fields, in characters (code points) */
export const MAX_LENGTHS = {
  name: 1024,
  organizationName: 1024,
  description: 4096,
  version: 256,
  environment: 256,
  type: 256,
  url: 2048,
} as const;

// Whitespace, control and format characters, surrogates (so unpaired ones
// too) and separators, which URLs must not contain (except joiners in host
// names)
const REJECTED_CHARACTER = /[\s\p{Cc}\p{Cf}\p{Cs}\p{Zl}\p{Zp}\p{Zs}]/u;
// Zero width non-joiner and joiner, allowed in international host names
const JOINERS = /[\u200c\u200d]/g;
// Percent signs that don't start a percent-encoding
const MALFORMED_PERCENT = /%(?![0-9A-Fa-f]{2})/;
// ASCII characters allowed in paths, queries and fragments (RFC 3986):
// unreserved characters, sub-delimiters, `:`, `@`, `/`, `?` and `%`
const URI_CHARACTERS = /^[A-Za-z0-9\-._~!$&'()*+,;=:@/?%]$/;
// HTTP(S) URLs: scheme, authority, path, query, fragment
const HTTP_URL =
  /^([A-Za-z][A-Za-z0-9+.-]*):\/\/([^/?#]*)([^?#]*)(\?[^#]*)?(#.*)?$/s;
// `mailto:` URLs after the scheme: addresses, query, fragment
const MAILTO_PARTS = /^([^?#]*)(\?[^#]*)?(#.*)?$/s;
// Hosts with optional port: IPv6 address in brackets, or a name
const IPV6_AUTHORITY =
  /^\[([0-9A-Fa-f:.]+)(%25[A-Za-z0-9\-._~]+)?\](?::(\d*))?$/;
const NAME_AUTHORITY = /^([^:]*)(?::(\d*))?$/;
// Characters of registered names (RFC 3986) and non-ASCII characters
const REG_NAME = /^[A-Za-z0-9\-._~!$&'()*+,;=\u0080-\uffff]+$/;
// Last labels that browsers take as IPv4 addresses (e.g. `127.1`)
const NUMERIC_LABEL = /^(?:[0-9]+|0[xX][0-9A-Fa-f]*)$/;
const IPV4 =
  /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
// Labels of domain names (letters, digits, hyphens)
const LDH_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
// RFC 3339 date-times (cf. `is_date_time()` of cloud-registry)
const DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:[Zz]|[+-](\d{2}):(\d{2}))$/;
// Unpaired surrogates, which the registry can't store
const UNPAIRED_SURROGATE =
  /[\ud800-\udbff](?![\udc00-\udfff])|(?:^|[^\ud800-\udbff])[\udc00-\udfff]/;

/** Number of characters (code points), as the registry counts them */
export function length(value: string): number {
  return [...value].length;
}

/**
 * Check the characters of a part of a URL
 * @returns Why the part is invalid, or undefined
 */
function checkCharacters(
  part: string,
  uriCharacters = true
): string | undefined {
  if (REJECTED_CHARACTER.test(part)) {
    return "must not contain spaces or control characters";
  }
  if (MALFORMED_PERCENT.test(part)) {
    return "must not contain % other than in percent-encodings (e.g. %20)";
  }
  if (
    uriCharacters &&
    [...part].some((char) => char < "\u0080" && !URI_CHARACTERS.test(char))
  ) {
    return "must percent-encode characters such as <, >, |, \\, [ or ]";
  }
  return undefined;
}

/** Check a host name; returns why it is invalid, or undefined */
function checkHostName(host: string): string | undefined {
  if (host === "") return "needs a host";
  if (host.includes("%") || !REG_NAME.test(host.replace(JOINERS, ""))) {
    return "needs a valid host";
  }
  const labels = host.replace(/\.$/, "").split(".");
  const last = labels[labels.length - 1];
  if (NUMERIC_LABEL.test(last)) {
    return IPV4.test(host.replace(/\.$/, ""))
      ? undefined
      : "needs a valid host or IPv4 address";
  }
  // international names: as browsers encode them (UTS 46)
  let ascii: string;
  try {
    ascii = new URL(`http://${host}/`).hostname;
  } catch {
    return "needs a valid host";
  }
  const asciiLabels = ascii.replace(/\.$/, "").split(".");
  if (
    ascii.length > 253 ||
    asciiLabels.some((label) => label === "" || label.length > 63)
  ) {
    return "needs a valid host";
  }
  return undefined;
}

/** Check an HTTP(S) URL; returns why it is invalid, or undefined */
function checkHttpUrl(url: string, schemes: string[]): string | undefined {
  const match = HTTP_URL.exec(url);
  if (!match) return "must be a URL such as https://example.org";
  const [, scheme, authority, path, query = "", fragment = ""] = match;
  if (!schemes.includes(scheme.toLowerCase())) {
    return `must be ${schemes.map((s) => `an ${s}`).join(" or ")} URL`;
  }
  if (authority.includes("@"))
    return "must not contain a user name or password";
  const authorityError = checkCharacters(authority.replace(JOINERS, ""), false);
  if (authorityError) return authorityError;
  const ipv6 = IPV6_AUTHORITY.exec(authority);
  const name = ipv6 ? null : NAME_AUTHORITY.exec(authority);
  if (!ipv6 && !name) return "needs a valid host";
  const port = ipv6 ? ipv6[3] : name?.[2];
  if (port && (Number(port) === 0 || Number(port) > 65535)) {
    return "needs a valid port";
  }
  if (name) {
    const hostError = checkHostName(name[1]);
    if (hostError) return hostError;
  }
  for (const part of [path, query.slice(1), fragment.slice(1)]) {
    const error = checkCharacters(part);
    if (error) return error;
  }
  // browsers don't take zone IDs (RFC 6874), which the registry allows
  const zone = ipv6?.[2];
  try {
    // eslint-disable-next-line no-new
    new URL(zone ? url.replace(zone, "") : url);
  } catch {
    return ipv6 ? "needs a valid host" : "must be a valid URL";
  }
  return undefined;
}

/** Check a `mailto:` URL; returns why it is invalid, or undefined */
function checkMailto(url: string): string | undefined {
  const rest = url.slice("mailto:".length);
  const invalid =
    "needs valid email addresses (e.g. mailto:support@example.org)";
  if (rest.startsWith("//")) return invalid;
  const [, path = "", query = "", fragment = ""] =
    MAILTO_PARTS.exec(rest) ?? [];
  for (const part of [path, query.slice(1), fragment.slice(1)]) {
    const error = checkCharacters(part);
    if (error) return error;
  }
  if (path === "") return invalid;
  // addresses as written (not decoded), as the registry checks them
  for (const address of path.split(",")) {
    const at = address.lastIndexOf("@");
    const domain = address.slice(at + 1);
    if (at <= 0 || address.slice(0, at).includes("@") || domain === "") {
      return invalid;
    }
    // letters, digits, hyphens and dots, or international names
    if (/[^A-Za-z0-9.\-\u0080-\uffff]/.test(domain)) return invalid;
    let ascii = domain;
    if (/[^\0-\x7f]/.test(domain)) {
      try {
        // a stand-in last label, so that browsers don't take numeric ones
        // (e.g. `0x1`) as IPv4 addresses
        ascii = new URL(`http://${domain}.invalid/`).hostname.replace(
          /\.invalid$/,
          ""
        );
      } catch {
        return invalid;
      }
    }
    const labels = ascii.split(".");
    if (
      ascii.length > 253 ||
      labels.length < 2 ||
      !labels.every((label) => LDH_LABEL.test(label)) ||
      /^\d+$/.test(labels[labels.length - 1])
    ) {
      return invalid;
    }
  }
  return undefined;
}

/**
 * Check a URL as the registry does
 * @param url URL
 * @param schemes Allowed schemes of HTTP(S) URLs, lowercase
 * @param mailto Whether `mailto:` URLs are allowed
 * @returns Why the URL is invalid (to follow the field's label), or
 * undefined
 */
export function checkUrl(
  url: string,
  schemes: string[],
  mailto = false
): string | undefined {
  if (length(url) > MAX_LENGTHS.url) {
    return `must be at most ${MAX_LENGTHS.url} characters`;
  }
  if (mailto && /^mailto:/i.test(url)) return checkMailto(url);
  if (mailto && /^[^:/@\s]+@[^@\s]+$/.test(url)) {
    return `needs mailto: for email addresses (e.g. mailto:${url})`;
  }
  return checkHttpUrl(url, schemes);
}

/** Whether a value is an RFC 3339 date-time, as the registry checks it */
export function isDateTime(value: string): boolean {
  const match = DATE_TIME.exec(value);
  if (!match) return false;
  const [year, month, day, hour, minute, second, offsetHour, offsetMinute] =
    match.slice(1).map((part) => Number(part ?? 0));
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return (
    year >= 1 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= days[month - 1] &&
    hour < 24 &&
    minute < 60 &&
    second <= 60 &&
    offsetHour < 24 &&
    offsetMinute < 60
  );
}

/** Whether a string has unpaired surrogates, which can't be stored */
export function hasUnpairedSurrogates(value: string): boolean {
  return UNPAIRED_SURROGATE.test(value);
}

/**
 * Check a chosen service ID (`PUT /services/{id}`)
 * @returns Why the ID is invalid, or undefined
 */
export function checkServiceId(id: string): string | undefined {
  if ([".", "..", "types"].includes(id)) return "must not be ., .. or types";
  if (id.includes("/")) return "must not contain slashes";
  if (/[,\r\n]/.test(id)) return "must not contain commas or line breaks";
  return undefined;
}
