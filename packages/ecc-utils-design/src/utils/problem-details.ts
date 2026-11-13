/**
 * Problem details (RFC 9457, `application/problem+json`) and their field
 * errors, for components that submit data to an API and show its errors at
 * their form fields.
 *
 * Nothing here is specific to a server: field errors are read in the form of
 * the example of RFC 9457, section 3 (`errors[]` with `detail` and
 * `pointer`, a JSON Pointer in URI fragment form like `#/organization/url`),
 * with plain JSON Pointers like `/organization/url` and `parameter` (the
 * name of a query, path, header or cookie parameter) accepted too.
 */

/** A field error: one entry of the `errors` member of problem details. */
export interface ProblemFieldError {
  /** Readable message, e.g. `Must be a valid URI.` */
  detail: string;
  /**
   * The field in the request body as a plain JSON Pointer (RFC 6901), e.g.
   * `/organization/url`, decoded from the URI fragment form (`""` for the
   * whole body). Absent for parameters and entries without a location.
   */
  pointer?: string;
  /** Name of the request parameter, e.g. `limit`. */
  parameter?: string;
  /** Machine-readable code of what is wrong, e.g. `too-long`, if any. */
  code?: string;
  /** All members of the entry as received, including extension members. */
  raw: Record<string, unknown>;
}

/** Problem details (RFC 9457), with their field errors. */
export interface ProblemDetails {
  /** Problem type URI; `about:blank` if absent, as per RFC 9457. */
  type: string;
  /** Short summary of the problem type. */
  title?: string;
  /** HTTP status code. */
  status?: number;
  /** Explanation of this occurrence of the problem. */
  detail?: string;
  /** URI of this occurrence of the problem. */
  instance?: string;
  /** Field errors with a readable `detail`; empty if there are none. */
  errors: ProblemFieldError[];
  /**
   * Extension members, e.g. `code`, as received (all members but `type`,
   * `title`, `status`, `detail`, `instance` and `errors`).
   */
  extensions: Record<string, unknown>;
}

/**
 * Location of a form field in a request: a JSON Pointer to it in the request
 * body (plain, e.g. `/organization/url`, or in URI fragment form, e.g.
 * `#/organization/url`), or `{ parameter: "<name>" }` for a request
 * parameter.
 */
export type FieldLocation =
  | string
  | { pointer: string }
  | { parameter: string };

/** Problem details mapped to the fields of a form. */
export interface MappedFieldErrors {
  /** The parsed problem details; `undefined` if the body isn't any. */
  problem: ProblemDetails | undefined;
  /**
   * Message per field key (the keys of the `fields` passed), for fields with
   * errors only. Several messages for the same field are joined by a space.
   */
  fieldErrors: Record<string, string>;
  /** Field errors that match no field. */
  unmatched: ProblemFieldError[];
  /**
   * Message to show as a general error, or `undefined` if every error is
   * shown at a field: the `detail` (or else the `title`) of problem details
   * without field errors, or the fallback for responses that aren't problem
   * details; otherwise the field errors that match no field, each with its
   * location (e.g. `organization/url: Is required.`).
   */
  generalError: string | undefined;
}

const STANDARD_MEMBERS_LIST = [
  "type",
  "title",
  "status",
  "detail",
  "instance",
  "errors",
];
const STANDARD_MEMBERS = new Set(STANDARD_MEMBERS_LIST);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Normalize a JSON Pointer to its plain form (RFC 6901).
 *
 * @param pointer - Pointer in plain form (`/a/b`, `""` for the whole
 *   document) or in URI fragment form (`#/a/b`, `#` for the whole document;
 *   percent-encoded characters are decoded).
 * @returns The plain pointer, or `undefined` if `pointer` is neither.
 */
export function normalizePointer(pointer: string): string | undefined {
  let plain = pointer;
  if (pointer.startsWith("#")) {
    try {
      plain = decodeURIComponent(pointer.slice(1));
    } catch {
      return undefined;
    }
  }
  if (plain !== "" && !plain.startsWith("/")) return undefined;
  // `~` only as `~0` or `~1` (RFC 6901)
  if (/~(?![01])/.test(plain)) return undefined;
  return plain;
}

// Set a member as own data, also for keys like `__proto__`
function setOwn(target: Record<string, unknown>, key: string, value: unknown) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    writable: true,
    configurable: true,
  });
}

function parseFieldError(entry: unknown): ProblemFieldError | undefined {
  if (!isObject(entry)) return undefined;
  const detail = optionalString(entry.detail);
  if (!detail) return undefined;
  const fieldError: ProblemFieldError = { detail, raw: entry };
  const pointer =
    typeof entry.pointer === "string"
      ? normalizePointer(entry.pointer)
      : undefined;
  const parameter = optionalString(entry.parameter);
  if (pointer !== undefined) fieldError.pointer = pointer;
  else if (parameter) fieldError.parameter = parameter;
  const code = optionalString(entry.code);
  if (code) fieldError.code = code;
  return fieldError;
}

/**
 * Parse a response body as problem details (RFC 9457).
 *
 * Members of the wrong type are ignored, as the RFC requires; so are entries
 * of `errors` without a readable `detail`.
 *
 * @param body - The parsed JSON body of a response.
 * @returns The problem details, or `undefined` if `body` isn't a JSON object
 *   or has none of the members `type`, `title`, `status`, `detail` and
 *   `errors`.
 */
export function parseProblemDetails(body: unknown): ProblemDetails | undefined {
  if (!isObject(body)) return undefined;
  if (!STANDARD_MEMBERS_LIST.some((member) => member in body)) return undefined;
  const extensions: Record<string, unknown> = {};
  Object.keys(body).forEach((key) => {
    if (!STANDARD_MEMBERS.has(key)) setOwn(extensions, key, body[key]);
  });
  const errors = Array.isArray(body.errors)
    ? body.errors
        .map(parseFieldError)
        .filter((e): e is ProblemFieldError => e !== undefined)
    : [];
  const problem: ProblemDetails = {
    type: optionalString(body.type) ?? "about:blank",
    title: optionalString(body.title),
    status: typeof body.status === "number" ? body.status : undefined,
    detail: optionalString(body.detail),
    instance: optionalString(body.instance),
    errors,
    extensions,
  };
  return problem;
}

/**
 * Read the problem details of a `fetch` response.
 *
 * The body is read only if the response is JSON (`application/problem+json`,
 * `application/json` or another `+json` type); reading it consumes it.
 *
 * @param response - The response, e.g. of a request that failed.
 * @returns The problem details, or `undefined` if the body isn't JSON or
 *   isn't problem details.
 */
export async function readProblemDetails(
  response: Response
): Promise<ProblemDetails | undefined> {
  const mediaType = (response.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json" && !mediaType.endsWith("+json"))
    return undefined;
  try {
    return parseProblemDetails(await response.json());
  } catch {
    return undefined;
  }
}

type NormalizedLocation = { pointer: string } | { parameter: string };

function normalizeLocation(
  location: FieldLocation
): NormalizedLocation | undefined {
  if (typeof location === "string") {
    const pointer = normalizePointer(location);
    return pointer === undefined ? undefined : { pointer };
  }
  if ("parameter" in location) return { parameter: location.parameter };
  const pointer = normalizePointer(location.pointer);
  return pointer === undefined ? undefined : { pointer };
}

function isAncestor(ancestor: string, pointer: string): boolean {
  return ancestor !== "" && pointer.startsWith(`${ancestor}/`);
}

function findField(
  error: ProblemFieldError,
  locations: [string, NormalizedLocation][]
): string | undefined {
  if (error.parameter !== undefined) {
    return locations.find(
      ([, loc]) => "parameter" in loc && loc.parameter === error.parameter
    )?.[0];
  }
  if (error.pointer === undefined) return undefined;
  const { pointer } = error;
  const exact = locations.find(
    ([, loc]) => "pointer" in loc && loc.pointer === pointer
  );
  if (exact) return exact[0];
  // Else the closest containing field, e.g. `/tags` for `/tags/0`
  let best: [string, string] | undefined;
  locations.forEach(([key, loc]) => {
    if (
      "pointer" in loc &&
      isAncestor(loc.pointer, pointer) &&
      (!best || loc.pointer.length > best[1].length)
    ) {
      best = [key, loc.pointer];
    }
  });
  return best?.[0];
}

function describeUnmatched(error: ProblemFieldError): string {
  // E.g. `organization/url`, with keys unescaped (RFC 6901)
  if (error.parameter) return `${error.parameter}: ${error.detail}`;
  // No location for the whole body (`""`)
  if (!error.pointer) return error.detail;
  const location = error.pointer
    .slice(1)
    .split("/")
    .map((key) => key.replace(/~1/g, "/").replace(/~0/g, "~"))
    .join("/");
  // `/` points to the member with the empty key
  return `${location || error.pointer}: ${error.detail}`;
}

/**
 * Map the field errors of problem details to the fields of a form.
 *
 * A field error belongs to the field with the same pointer or parameter or,
 * failing that, to the closest field that contains it (e.g. an error at
 * `/tags/0` to a field at `/tags`). Errors that match no field, problem
 * details without field errors and responses that aren't problem details
 * give a general error instead.
 *
 * @param problem - Problem details, as returned by `readProblemDetails()` or
 *   `parseProblemDetails()`; `undefined` if the response has none.
 * @param fields - The form's fields: their keys (e.g. the names the
 *   component uses for them) and their locations in the request.
 * @param fallback - General error for responses without problem details or
 *   with neither `detail` nor `title`.
 * @returns The messages per field and the general error.
 */
export function mapFieldErrors(
  problem: ProblemDetails | undefined,
  fields: Record<string, FieldLocation>,
  fallback = "The request failed."
): MappedFieldErrors {
  const fieldErrors: Record<string, string> = {};
  const unmatched: ProblemFieldError[] = [];
  if (!problem || !Array.isArray(problem.errors) || !problem.errors.length) {
    return {
      problem,
      fieldErrors,
      unmatched,
      generalError: problem?.detail || problem?.title || fallback,
    };
  }
  const locations: [string, NormalizedLocation][] = [];
  Object.entries(fields).forEach(([key, location]) => {
    const normalized = normalizeLocation(location);
    if (normalized) locations.push([key, normalized]);
  });
  problem.errors.forEach((error) => {
    const key = findField(error, locations);
    if (key === undefined) unmatched.push(error);
    else
      setOwn(
        fieldErrors,
        key,
        Object.prototype.hasOwnProperty.call(fieldErrors, key)
          ? `${fieldErrors[key]} ${error.detail}`
          : error.detail
      );
  });
  return {
    problem,
    fieldErrors,
    unmatched,
    generalError: unmatched.length
      ? unmatched.map(describeUnmatched).join(" ")
      : undefined,
  };
}
