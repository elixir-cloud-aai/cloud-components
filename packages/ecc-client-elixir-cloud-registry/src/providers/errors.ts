/**
 * Problem details of a failed request (RFC 9457), as the Cloud Registry
 * sends them, e.g. with `serviceId` for duplicate registrations. Bodies
 * of other servers (e.g. proxies) may have other fields, such as
 * `message`.
 */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  serviceId?: string;
  [key: string]: unknown;
}

/**
 * The value if it is a string with more than white space, else `undefined`.
 * @param value Any value, e.g. a field of a response body
 * @returns The string or `undefined`
 */
export const nonBlankString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value : undefined;

/** Largest error body that is read for problem details, in bytes. */
export const MAX_PROBLEM_BYTES = 64 * 1024;

/** Longest time to wait for an error body, in milliseconds. */
export const PROBLEM_TIMEOUT_MS = 5000;

/**
 * Reads at most `maxBytes` of a body within `timeoutMs`, so that a huge or
 * stalled error body (e.g. from a proxy) can't hold up the error.
 * @param response The response
 * @param maxBytes Most bytes to read
 * @param timeoutMs Longest time to wait
 * @returns The body as text, or `undefined` if it was too large, too slow or
 * couldn't be read
 */
async function readBoundedText(
  response: Response,
  maxBytes: number,
  timeoutMs: number
): Promise<string | undefined> {
  const length = Number(response.headers.get("content-length"));
  if (length > maxBytes) return undefined;
  const reader = response.body?.getReader();
  if (!reader) return undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<"timeout">((resolve) => {
    timer = setTimeout(() => resolve("timeout"), timeoutMs);
  });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      // eslint-disable-next-line no-await-in-loop
      const result = await Promise.race([reader.read(), timeout]);
      if (result === "timeout") return undefined;
      if (result.done) break;
      size += result.value.byteLength;
      if (size > maxBytes) return undefined;
      chunks.push(result.value);
    }
  } catch {
    return undefined;
  } finally {
    clearTimeout(timer);
    reader.cancel().catch(() => undefined);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  });
  return new TextDecoder().decode(bytes);
}

/**
 * Error of a request that the Cloud Registry answered with an error status.
 *
 * `status` tells, e.g., a missing login (`401`) from a missing role (`403`).
 * The message is the problem's `detail` (else a `message` field of the
 * body), or names the failed action and the status.
 */
export class CloudRegistryError extends Error {
  /** HTTP status of the response, e.g. `401` or `409`. */
  readonly status: number;

  /** Short summary of the problem type, e.g. "Conflict". */
  readonly title?: string;

  /** Explanation of this occurrence of the problem. */
  readonly detail?: string;

  /** ID of the existing service, for duplicate registrations (`409`). */
  readonly serviceId?: string;

  /** The response body, if it was a JSON object. */
  readonly problem?: ProblemDetails;

  constructor(message: string, status: number, problem?: ProblemDetails) {
    super(message);
    this.name = "CloudRegistryError";
    this.status = status;
    this.problem = problem;
    this.title = nonBlankString(problem?.title);
    this.detail = nonBlankString(problem?.detail);
    this.serviceId = nonBlankString(problem?.serviceId);
  }

  /**
   * Creates the error for a failed response, reading the problem details
   * from its body whatever its content type (also `application/problem+json`;
   * a proxy may send HTML instead). Bodies larger than
   * `MAX_PROBLEM_BYTES`, or slower than `PROBLEM_TIMEOUT_MS`, are skipped.
   * @param response Response with an error status
   * @param action Failed action for the message if the body has no
   * explanation, e.g. "Failed to create service"
   * @returns Promise resolving to the error
   */
  static async fromResponse(
    response: Response,
    action: string
  ): Promise<CloudRegistryError> {
    let problem: ProblemDetails | undefined;
    const text = await readBoundedText(
      response,
      MAX_PROBLEM_BYTES,
      PROBLEM_TIMEOUT_MS
    );
    try {
      const body: unknown = text ? JSON.parse(text) : undefined;
      if (body && typeof body === "object" && !Array.isArray(body)) {
        problem = body as ProblemDetails;
      }
    } catch {
      // no JSON body
    }
    // the status only: HTTP/2 has no status text
    const message =
      nonBlankString(problem?.detail) ??
      nonBlankString(problem?.message) ??
      `${action} (${response.status})`;
    return new CloudRegistryError(message, response.status, problem);
  }
}
