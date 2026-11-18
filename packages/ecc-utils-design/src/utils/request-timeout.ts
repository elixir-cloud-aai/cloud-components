/**
 * Request deadlines for the REST providers of the client packages, so that a
 * request that never settles (e.g. to a server that accepts the connection
 * but never answers) rejects, and components show their usual error instead
 * of loading forever.
 *
 * The deadline covers the whole request: from sending it until its response
 * body has been read (`response.json()` and the like reject too once it has
 * expired).
 */

/** `AbortSignal` with its abort reason (newer than TypeScript 4.3's DOM). */
interface AbortSignalWithReason extends AbortSignal {
  readonly reason: unknown;
}

/** `AbortController` that aborts with a reason. */
interface AbortControllerWithReason extends AbortController {
  readonly signal: AbortSignalWithReason;
  abort(reason?: unknown): void;
}

/** Default deadline of a request of the REST providers: 30 s. */
export const DEFAULT_REQUEST_TIMEOUT = 30_000;

/**
 * Longest deadline that timers support (2^31 - 1 ms, about 24.8 days);
 * longer ones would expire at once.
 */
export const MAX_REQUEST_TIMEOUT = 2_147_483_647;

/** Options of the REST providers of the client packages. */
export interface RestProviderOptions {
  /**
   * Deadline of each request in milliseconds, until its response body has
   * been read; `0` for none. Defaults to `DEFAULT_REQUEST_TIMEOUT` (30 s).
   */
  timeout?: number;
}

/** Reason of a request that was aborted because its deadline expired. */
export class RequestTimeoutError extends Error {
  /** The deadline that expired, in milliseconds. */
  readonly timeout: number;

  constructor(timeout: number) {
    super(`Request timed out after ${timeout} ms`);
    this.name = "RequestTimeoutError";
    this.timeout = timeout;
  }
}

/**
 * Returns the request deadline of the given provider options: the default if
 * none is set, else the value.
 * @param options Options of a REST provider
 * @returns Deadline in milliseconds, `0` for none
 * @throws {RangeError} If the timeout is not an integer from `0` to
 *   `MAX_REQUEST_TIMEOUT`
 */
export function resolveRequestTimeout(
  options: RestProviderOptions = {}
): number {
  const { timeout = DEFAULT_REQUEST_TIMEOUT } = options;
  if (
    !Number.isInteger(timeout) ||
    timeout < 0 ||
    timeout > MAX_REQUEST_TIMEOUT
  ) {
    throw new RangeError(
      `timeout must be an integer from 0 to ${MAX_REQUEST_TIMEOUT} (ms), got ${timeout}`
    );
  }
  return timeout;
}

/**
 * Sends a request with `fetch` that is aborted with a `RequestTimeoutError`
 * once the deadline expires. A `signal` of the request still aborts it, with
 * its own reason.
 * @param input Resource to fetch
 * @param init Options of the request
 * @param timeout Deadline in milliseconds (as by `resolveRequestTimeout()`),
 *   `0` for none
 * @returns The response, as from `fetch`
 */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeout: number = DEFAULT_REQUEST_TIMEOUT
): Promise<Response> {
  // Typed for the DOM library of TypeScript 4.3, which the packages build
  // with: it lacks `URL` inputs, `abort(reason)` and `signal.reason`
  const request = input as RequestInfo;
  if (timeout === 0) {
    return fetch(request, init);
  }
  const controller = new AbortController() as AbortControllerWithReason;
  const timer = setTimeout(
    () => controller.abort(new RequestTimeoutError(timeout)),
    timeout
  );
  const signal = (init.signal ??
    (input instanceof Request ? input.signal : undefined)) as
    | AbortSignalWithReason
    | undefined;
  if (signal) {
    const abort = () => {
      clearTimeout(timer);
      controller.abort(signal.reason);
    };
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener("abort", abort, { once: true });
    }
  }
  return fetch(request, { ...init, signal: controller.signal });
}
