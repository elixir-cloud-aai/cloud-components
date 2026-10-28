/**
 * SSR (Server-Side Rendering) Utility Helpers
 *
 * These utilities ensure that Web Components can be safely imported
 * during SSR (e.g. Next.js, Remix) without crashing due to missing
 * browser globals (`window`, `document`, `customElements`).
 *
 * Note: This library does not render component templates on the server.
 * Components are safe to *load* during SSR; rendering and hydration
 * occur on the client.
 *
 * @module ssr
 */

/**
 * Returns `true` when running in a browser environment.
 *
 * Why: Node.js (used by SSR frameworks) does not have a `window` global.
 * Any code that touches `window`, `document`, or `customElements` must be
 * gated behind this check to avoid `ReferenceError` on the server.
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Returns `true` when running on the server (Node.js / SSR).
 */
export function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * Safely registers a custom element, skipping registration on the server
 * and preventing duplicate registrations on the client.
 *
 * Why:
 * - `customElements` does not exist in Node.js → calling it crashes the import.
 * - Calling `customElements.define()` twice with the same tag name throws a
 *   `DOMException` → the duplicate check prevents this in HMR / dev scenarios.
 *
 * @param tagName - The custom element tag name (e.g. "ecc-utils-design-button")
 * @param constructor - The custom element class
 */
export function ssrSafeDefine(
  tagName: string,
  constructor: CustomElementConstructor
): void {
  if (
    typeof window !== "undefined" &&
    window.customElements &&
    !window.customElements.get(tagName)
  ) {
    window.customElements.define(tagName, constructor);
  }
}

/**
 * Monotonically increasing counter used by `generateDeterministicId`.
 * Resets per JS context (server request vs client page load), which is
 * exactly what we need for SSR hydration: both server and client start
 * counting from 0 in the same order, producing matching IDs.
 */
let idCounter = 0;

/**
 * Generates a deterministic, incrementing ID string.
 *
 * Why: `Math.random()` produces different values on server vs client,
 * causing hydration mismatches. A monotonic counter produces the same
 * sequence as long as components are instantiated in the same order.
 *
 * @param prefix - A human-readable prefix (e.g. "select", "multi-select")
 * @returns A unique ID like "select-0", "select-1", etc.
 */
export function generateDeterministicId(prefix: string): string {
  const id = idCounter;
  idCounter += 1;
  return `${prefix}-${id}`;
}

/**
 * Resets the deterministic ID counter.
 *
 * Useful in testing or when a fresh SSR request starts.
 * Frameworks typically create a new JS context per request, so this
 * is rarely needed in production.
 */
export function resetIdCounter(): void {
  idCounter = 0;
}
