/**
 * Helpers of `ecc-client-ga4gh-wes-run-output`: the rules of the GA4GH IO
 * Schema profile for showing outputs, as of commit
 * `2c3dc49ad89f0a556272f160369a2a2d7a21dac3` of
 * https://github.com/elixir-cloud-aai/ga4gh-io-schema (version 0.3.0, no
 * release yet): `docs/specification/widgets.md`,
 * `docs/specification/outputs.md`, `docs/specification/files.md` and
 * "Rendering schemas and outputs" in `docs/security.md`.
 */

/** The schema of one output (a property of `outputs` of an IO schema). */
export type OutputSchema = Record<string, unknown>;

/** The viewers of version 0.3.0 of the profile's vocabulary. */
export type Viewer = "table-viewer" | "html-viewer";

/** One file of an output, or a value that isn't a file. */
export type OutputEntry =
  | {
      type: "file";
      /** File name of an item of a list, or key of files keyed by name */
      label?: string;
      uri: string;
      /** Schema of the file reference */
      schema: OutputSchema;
    }
  | { type: "value"; value: unknown };

/** Schemes allowed when the app sets no allow-list. */
export const DEFAULT_ALLOWED_SCHEMES: readonly string[] = ["drs", "https"];

/**
 * Schemes that run code in a browser or refer to local data. They are never
 * allowed, whatever the allow-list says (the list of the profile's
 * meta-schema for `schemes`).
 */
export const FORBIDDEN_SCHEMES: readonly string[] = [
  "javascript",
  "vbscript",
  "livescript",
  "data",
  "blob",
  "filesystem",
  "file",
  "jar",
  "view-source",
  "about",
];

/**
 * Content Security Policy of HTML outputs: no external loads, inline styles
 * and `data:` images only (the profile's example).
 */
export const HTML_OUTPUT_CSP =
  "default-src 'none'; img-src data:; style-src 'unsafe-inline'";

const VIEWERS: readonly string[] = ["table-viewer", "html-viewer"];
const SCHEME = /^([A-Za-z][A-Za-z0-9+.-]*):/;
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u001F\u007F]/;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Whether a schema is a file reference (`x-ga4gh-file`). */
export const isFileReference = (schema: unknown): schema is OutputSchema =>
  isObject(schema) &&
  schema.type === "string" &&
  isObject(schema["x-ga4gh-file"]);

/** The `x-ga4gh-file` annotation of a file reference. */
export const fileOf = (schema: OutputSchema): Record<string, unknown> =>
  schema["x-ga4gh-file"] as Record<string, unknown>;

/**
 * Checks the URI of an output before it is fetched or offered for
 * download.
 *
 * @param uri - The value of the file reference.
 * @param allowedSchemes - The allow-list of the deployment.
 * @param fileSchemes - `schemes` of the file reference, which narrows the
 *   allow-list but never extends it.
 * @returns Why the URI is refused, or `null` if it is allowed.
 */
export function checkOutputUri(
  uri: unknown,
  allowedSchemes: readonly string[],
  fileSchemes?: unknown
): string | null {
  if (typeof uri !== "string") return "The value isn't a URI.";
  if (CONTROL.test(uri) || uri.trim() !== uri) {
    return "The URI contains control characters or surrounding whitespace.";
  }
  const match = SCHEME.exec(uri);
  if (!match) return "The value is a path, not an absolute URI.";
  const scheme = match[1].toLowerCase();
  const allowed = allowedSchemes.map((s) => s.toLowerCase());
  const narrowed = Array.isArray(fileSchemes)
    ? fileSchemes.map((s) => String(s).toLowerCase())
    : null;
  if (
    FORBIDDEN_SCHEMES.includes(scheme) ||
    !allowed.includes(scheme) ||
    (narrowed !== null && !narrowed.includes(scheme))
  ) {
    return `The scheme "${scheme}" is not allowed.`;
  }
  return null;
}

/**
 * Whether a URL (absolute, or relative to the page) is an `http:` or
 * `https:` URL, e.g. one that a provider returns for a download.
 */
export function isHttpUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  try {
    const { protocol } = new URL(url, document.baseURI);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * The viewer of a file reference, if it is one of the profile's viewers and
 * fits the schema (a file, not a directory); `null` means download only.
 */
export function viewerOf(schema: unknown): Viewer | null {
  if (!isFileReference(schema)) return null;
  const file = fileOf(schema);
  const widget = schema["x-ga4gh-ui-widget"];
  if (file.kind !== "file" || typeof widget !== "string") return null;
  return VIEWERS.includes(widget) ? (widget as Viewer) : null;
}

/** The last segment of the path of a URI, for a label. */
function fileName(uri: string): string {
  const path = uri.split(/[?#]/)[0].replace(/\/+$/, "");
  const name = path.slice(path.lastIndexOf("/") + 1);
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}

/**
 * Splits an output into the files it has (one, a list, or files keyed by
 * name) and values that aren't files. Viewers go on the schema of the file
 * reference itself: `items` for a list, `additionalProperties` for files
 * keyed by name.
 */
export function outputEntries(schema: unknown, value: unknown): OutputEntry[] {
  const fileOrValue = (
    fileSchema: OutputSchema,
    item: unknown,
    label?: string
  ): OutputEntry => {
    if (typeof item !== "string") return { type: "value", value: item };
    return label === undefined
      ? { type: "file", uri: item, schema: fileSchema }
      : { type: "file", label, uri: item, schema: fileSchema };
  };

  if (isFileReference(schema)) return [fileOrValue(schema, value)];
  if (isObject(schema)) {
    const { items, additionalProperties } = schema;
    if (
      schema.type === "array" &&
      isFileReference(items) &&
      Array.isArray(value)
    ) {
      return value.map((item) =>
        fileOrValue(
          items,
          item,
          typeof item === "string" ? fileName(item) : undefined
        )
      );
    }
    if (
      schema.type === "object" &&
      isFileReference(additionalProperties) &&
      isObject(value)
    ) {
      return Object.keys(value).map((key) =>
        fileOrValue(additionalProperties, value[key], key)
      );
    }
  }
  return [{ type: "value", value }];
}

/**
 * The delimiter of a tabular file: by its media type, else by the extension
 * of its URI, else a tab if the first line has one, else a comma.
 */
export function delimiterFor(
  mediaType: unknown,
  uri: string,
  text: string
): "\t" | "," {
  const type = typeof mediaType === "string" ? mediaType.toLowerCase() : "";
  if (type === "text/tab-separated-values") return "\t";
  if (type === "text/csv") return ",";
  const path = uri.split(/[?#]/)[0].toLowerCase();
  if (path.endsWith(".tsv") || path.endsWith(".tab")) return "\t";
  if (path.endsWith(".csv")) return ",";
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  return firstLine.includes("\t") ? "\t" : ",";
}

/**
 * The records of TSV: lines split at tabs, without quoting; at most
 * `maxFields` fields per record.
 */
function* tsvRecords(text: string, maxFields: number): Generator<string[]> {
  for (const line of text.split("\n")) {
    yield line.replace(/\r$/, "").split("\t", maxFields);
  }
}

/**
 * The records of CSV (RFC 4180): fields may be quoted with `"`; at most
 * `maxFields` fields per record.
 */
function* csvRecords(text: string, maxFields: number): Generator<string[]> {
  let record: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') field += c;
      else if (text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else quoted = false;
    } else if (c === '"' && field === "") quoted = true;
    else if (c === ",") {
      if (record.length < maxFields) record.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      if (record.length < maxFields) record.push(field);
      yield record;
      record = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || record.length > 0) {
    if (record.length < maxFields) record.push(field);
    yield record;
  }
}

/** A table parsed from CSV or TSV. */
export interface ParsedTable {
  header: string[];
  rows: string[][];
  /** Whether rows were left out */
  more: boolean;
  /** Whether columns were left out */
  moreColumns: boolean;
}

/**
 * Parses CSV or TSV into a header (the first row) and at most `maxRows`
 * rows of at most `maxColumns` cells. Empty lines are skipped.
 */
export function parseDelimited(
  text: string,
  delimiter: "\t" | ",",
  maxRows: number,
  maxColumns: number
): ParsedTable {
  // One more field than shown, to know whether there are more
  const records =
    delimiter === "\t"
      ? tsvRecords(text, maxColumns + 1)
      : csvRecords(text, maxColumns + 1);
  let header: string[] = [];
  const rows: string[][] = [];
  let seenHeader = false;
  let moreColumns = false;
  const cut = (record: string[]) => {
    if (record.length > maxColumns) moreColumns = true;
    return record.slice(0, maxColumns);
  };
  for (const record of records) {
    const empty = record.length === 1 && record[0] === "";
    if (empty) {
      // Skipped
    } else if (!seenHeader) {
      header = cut(record);
      seenHeader = true;
    } else if (rows.length >= maxRows) {
      return { header, rows, more: true, moreColumns };
    } else rows.push(cut(record));
  }
  return { header, rows, more: false, moreColumns };
}

/**
 * Reads the text of a response, but no more than `maxBytes` bytes;
 * `truncated` says whether there was more.
 */
export async function readLimitedText(
  response: Response,
  maxBytes: number
): Promise<{ text: string; truncated: boolean }> {
  const decoder = new TextDecoder();
  if (!response.body) {
    const bytes = new Uint8Array(await response.arrayBuffer());
    return {
      text: decoder.decode(bytes.subarray(0, maxBytes)),
      truncated: bytes.length > maxBytes,
    };
  }
  const reader = response.body.getReader();
  let text = "";
  let read = 0;
  for (;;) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) break;
    if (read + value.length > maxBytes) {
      text += decoder.decode(value.subarray(0, maxBytes - read));
      reader.cancel().catch(() => undefined);
      return { text, truncated: true };
    }
    read += value.length;
    text += decoder.decode(value, { stream: true });
  }
  return { text: text + decoder.decode(), truncated: false };
}

/**
 * The `srcdoc` of a sandboxed frame for an HTML output: a Content Security
 * Policy that blocks external loads, placed before the untrusted markup so
 * that it applies to all of it.
 */
export function htmlSrcdoc(markup: string): string {
  // `base` opens links in a new window, which the sandbox doesn't allow,
  // so that clicked links can't load other pages into the frame
  return `<!DOCTYPE html><meta http-equiv="Content-Security-Policy" content="${HTML_OUTPUT_CSP}"><meta name="referrer" content="no-referrer"><base target="_blank">${markup}`;
}
