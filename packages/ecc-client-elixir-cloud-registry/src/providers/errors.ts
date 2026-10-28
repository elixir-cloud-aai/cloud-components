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
   * a proxy may send HTML instead).
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
    try {
      const body: unknown = await response.json();
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
