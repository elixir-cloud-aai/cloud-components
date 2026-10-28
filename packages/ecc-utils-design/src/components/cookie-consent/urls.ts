/**
 * Checks of configured URLs, so that configuration can't run scripts
 * (e.g. `javascript:` links).
 */

const SAFE_LINK_PROTOCOLS = ["http:", "https:", "mailto:"];

/**
 * The URL if it is safe as a link: `http(s)`, `mailto` or relative.
 * @param url URL from the configuration or a Markdown page
 * @returns The URL, or `undefined` if it isn't safe
 */
export function safeHref(url: unknown): string | undefined {
  if (typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed, window.location.href);
    return SAFE_LINK_PROTOCOLS.includes(parsed.protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The URL if it may be embedded in a frame: absolute `https`, or relative
 * on a page loaded over `https` or from localhost.
 * @param url URL from the configuration
 * @returns The URL, or `undefined` if it isn't allowed
 */
export function safeEmbedSrc(url: unknown): string | undefined {
  if (typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed, window.location.href);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
    return parsed.protocol === "https:" ||
      (parsed.protocol === "http:" && local)
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * A `mailto:` link for an address, or `undefined` if it isn't one.
 * @param email E-mail address
 * @param subject Optional subject
 * @returns The link
 */
export function mailtoHref(
  email: unknown,
  subject?: unknown
): string | undefined {
  if (typeof email !== "string" || !/^[^\s@?&#/]+@[^\s@?&#/]+$/.test(email)) {
    return undefined;
  }
  const query =
    typeof subject === "string" && subject
      ? `?subject=${encodeURIComponent(subject)}`
      : "";
  return `mailto:${email}${query}`;
}
