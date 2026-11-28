import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import type { WesOutputProvider } from "../../providers/wes-output-provider.js";
import {
  DEFAULT_ALLOWED_SCHEMES,
  OutputEntry,
  OutputSchema,
  ParsedTable,
  Viewer,
  checkOutputUri,
  delimiterFor,
  fileOf,
  htmlSrcdoc,
  isHttpUrl,
  outputEntries,
  parseDelimited,
  readLimitedText,
  viewerOf,
} from "./utils.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/table/index.js";

const DEFAULT_MAX_ROWS = 1000;
const DEFAULT_MAX_COLUMNS = 100;
const DEFAULT_MAX_FILES = 50;
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

type FileEntry = Extract<OutputEntry, { type: "file" }>;

/** What an entry of the output shows below its URI. */
type View =
  | { status: "loading" }
  | { status: "download" }
  | { status: "blocked"; message: string }
  | { status: "error"; message: string }
  | { status: "html"; srcdoc: string }
  | ({ status: "table" } & ParsedTable);

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

/** Compares lists of schemes by content, ignoring case. */
const sameSchemes = (a: unknown, b: unknown): boolean =>
  Array.isArray(a) && Array.isArray(b)
    ? a.join(" ").toLowerCase() === b.join(" ").toLowerCase()
    : a === b;

/**
 * @summary Shows one output of a workflow run, as its viewer hint in the
 * workflow's GA4GH IO Schema says.
 * @since 2.0.0
 *
 * @property {string} name - Name of the output (its key in the normalised
 *   outputs object); the title if the schema has none.
 * @property {object} schema - Schema of the output: the property of
 *   `outputs` of the IO schema with the output's name.
 * @property {unknown} value - Value of the output in the normalised outputs
 *   object: a URI, a list of URIs, URIs keyed by name, or another value.
 * @property {WesOutputProvider} provider - Fetches files for viewers and
 *   returns download URLs; without it, files are shown as URIs only.
 * @property {string[]} allowedSchemes - URI schemes that may be fetched or
 *   downloaded (attribute `allowed-schemes`, separated by spaces or commas);
 *   anything other than an array, or no attribute, means the default.
 * @property {number} maxRows - Rows that a table shows at most (attribute
 *   `max-rows`).
 * @property {number} maxColumns - Columns that a table shows at most
 *   (attribute `max-columns`).
 * @property {number} maxFiles - Files of a list, or of files keyed by name,
 *   that are shown at most (attribute `max-files`).
 * @property {number} maxBytes - Bytes of a file that a viewer reads at most
 *   (attribute `max-bytes`).
 *
 * @method reload - Loads the output again, e.g. to retry failed viewers.
 *
 * @csspart base - The container of the output.
 */
export class ECCClientGa4ghWesRunOutput extends LitElement {
  static styles = [
    TailwindStyles,
    GlobalStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ];

  @property({ type: String, reflect: true }) name = "";
  @property({ attribute: false }) schema?: OutputSchema;
  @property({ attribute: false }) value?: unknown;
  @property({ attribute: false }) provider?: WesOutputProvider;
  @property({
    attribute: "allowed-schemes",
    hasChanged: (value: unknown, old: unknown) => !sameSchemes(value, old),
    converter: {
      fromAttribute: (value: string | null) =>
        value === null
          ? [...DEFAULT_ALLOWED_SCHEMES]
          : value
              .split(/[\s,]+/)
              .filter(Boolean)
              .map((scheme) => scheme.toLowerCase()),
      toAttribute: (value: string[]) => value.join(" "),
    },
  })
  allowedSchemes: string[] = [...DEFAULT_ALLOWED_SCHEMES];

  @property({ type: Number, attribute: "max-rows" }) maxRows = DEFAULT_MAX_ROWS;

  @property({ type: Number, attribute: "max-columns" }) maxColumns =
    DEFAULT_MAX_COLUMNS;

  @property({ type: Number, attribute: "max-files" }) maxFiles =
    DEFAULT_MAX_FILES;

  @property({ type: Number, attribute: "max-bytes" }) maxBytes =
    DEFAULT_MAX_BYTES;

  @state() private entries: OutputEntry[] = [];
  /** Entries left out by `maxFiles` */
  @state() private hiddenEntries = 0;
  @state() private views = new Map<number, View>();
  @state() private downloadErrors = new Map<number, string>();

  /**
   * Milliseconds that a viewer waits for its file, and a download for its
   * URL, at most
   */
  static loadTimeout = 30000;

  /** Table cells that all tables of the element show together at most */
  static maxCells = 200000;

  /** Cells that tables of the current output may still show */
  private cellBudget = 0;

  /** Number of the latest download request per entry */
  private downloadRequests = new Map<number, number>();

  private loads?: AbortController;

  /** What the current views were loaded for, to skip needless reloads */
  private loadedFor?: { key: string; provider?: WesOutputProvider };

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.loads?.abort();
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Reconnected after a disconnect aborted the loads: load again
    if (this.loads?.signal.aborted) this.load();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (
      changed.has("schema") ||
      changed.has("value") ||
      changed.has("provider") ||
      changed.has("allowedSchemes") ||
      changed.has("maxRows") ||
      changed.has("maxColumns") ||
      changed.has("maxFiles") ||
      changed.has("maxBytes")
    ) {
      this.load();
    }
  }

  /**
   * Loads the output again, e.g. to retry viewers that failed. Setting
   * equal properties doesn't reload.
   */
  reload(): void {
    this.loadedFor = undefined;
    this.load();
  }

  /** Rejects if a promise takes longer than `loadTimeout`. */
  private static withTimeout<T>(
    promise: Promise<T>,
    onTimeout?: () => void
  ): Promise<T> {
    const timeout = ECCClientGa4ghWesRunOutput.loadTimeout;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timedOut = new Promise<never>((_resolve, reject) => {
      timer = setTimeout(() => {
        onTimeout?.();
        reject(new Error(`no response within ${timeout / 1000} s`));
      }, timeout);
    });
    return Promise.race([promise, timedOut]).then(
      (value) => {
        clearTimeout(timer);
        return value;
      },
      (err) => {
        clearTimeout(timer);
        throw err;
      }
    );
  }

  private static limit(value: number, fallback: number): number {
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
  }

  private get schemes(): readonly string[] {
    return Array.isArray(this.allowedSchemes)
      ? this.allowedSchemes
      : DEFAULT_ALLOWED_SCHEMES;
  }

  /**
   * Splits the output into entries and loads their viewers, one file at a
   * time. Skipped if nothing that the views depend on changed (e.g. React
   * sets equal but new objects on every render).
   */
  private load(): void {
    const maxFiles = ECCClientGa4ghWesRunOutput.limit(
      this.maxFiles,
      DEFAULT_MAX_FILES
    );
    const { entries, total } = outputEntries(this.schema, this.value, maxFiles);
    const key = JSON.stringify({
      entries,
      total,
      schemes: this.schemes,
      limits: [this.maxRows, this.maxColumns, this.maxFiles, this.maxBytes],
    });
    if (
      this.loads &&
      !this.loads.signal.aborted &&
      this.loadedFor?.key === key &&
      this.loadedFor.provider === this.provider
    ) {
      return;
    }
    this.loadedFor = { key, provider: this.provider };
    this.loads?.abort();
    const controller = new AbortController();
    this.loads = controller;
    this.entries = entries;
    this.hiddenEntries = total - entries.length;
    this.downloadErrors = new Map();
    this.cellBudget = ECCClientGa4ghWesRunOutput.maxCells;
    const views = new Map<number, View>();
    const jobs: { index: number; entry: FileEntry; viewer: Viewer }[] = [];
    entries.forEach((entry, index) => {
      if (entry.type !== "file") return;
      const refused = checkOutputUri(
        entry.uri,
        this.schemes,
        fileOf(entry.schema).schemes
      );
      if (refused) {
        views.set(index, { status: "blocked", message: refused });
        return;
      }
      const viewer = viewerOf(entry.schema);
      if (!viewer || !this.provider) {
        views.set(index, { status: "download" });
        return;
      }
      views.set(index, { status: "loading" });
      jobs.push({ index, entry, viewer });
    });
    this.views = views;
    if (this.provider && jobs.length > 0) {
      this.loadViews(jobs, this.provider, controller.signal);
    }
  }

  /** Loads viewers one after the other, so a long list can't flood. */
  private async loadViews(
    jobs: { index: number; entry: FileEntry; viewer: Viewer }[],
    provider: WesOutputProvider,
    signal: AbortSignal
  ): Promise<void> {
    for (const { index, entry, viewer } of jobs) {
      if (signal.aborted) return;
      // eslint-disable-next-line no-await-in-loop
      await this.loadView(index, entry, viewer, provider, signal);
    }
  }

  private setView(index: number, view: View): void {
    this.views = new Map(this.views).set(index, view);
  }

  /**
   * Loads the viewer of one file; gives up after `loadTimeout` milliseconds,
   * so that one file that never arrives doesn't hold up the others.
   */
  private async loadView(
    index: number,
    entry: FileEntry,
    viewer: Viewer,
    provider: WesOutputProvider,
    signal: AbortSignal
  ): Promise<void> {
    const job = new AbortController();
    const stop = () => job.abort();
    signal.addEventListener("abort", stop);
    try {
      const view = await ECCClientGa4ghWesRunOutput.withTimeout(
        this.readView(entry, viewer, provider, job.signal),
        stop
      );
      if (!signal.aborted) this.setView(index, view);
    } catch (err) {
      if (!signal.aborted) {
        this.setView(index, { status: "error", message: errorMessage(err) });
      }
    } finally {
      signal.removeEventListener("abort", stop);
    }
  }

  /** Fetches a file and turns it into the view of its viewer. */
  private async readView(
    entry: FileEntry,
    viewer: Viewer,
    provider: WesOutputProvider,
    signal: AbortSignal
  ): Promise<View> {
    const maxBytes = ECCClientGa4ghWesRunOutput.limit(
      this.maxBytes,
      DEFAULT_MAX_BYTES
    );
    const tooLarge: View = {
      status: "error",
      message: `the file is too large to show (more than ${maxBytes} bytes)`,
    };
    const response = await provider.fetchOutput(entry.uri, { signal });
    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}${
          response.statusText ? ` ${response.statusText}` : ""
        }`
      );
    }
    const { text, truncated } = await readLimitedText(response, maxBytes);
    if (viewer === "html-viewer") {
      // A cut report would be shown incomplete without a hint
      return truncated
        ? tooLarge
        : { status: "html", srcdoc: htmlSrcdoc(text) };
    }
    // Drop the partial last line of a cut table
    const complete = truncated
      ? text.slice(0, text.lastIndexOf("\n") + 1)
      : text;
    // Not even the header fits
    if (truncated && !complete) return tooLarge;
    const table = parseDelimited(
      complete,
      delimiterFor(fileOf(entry.schema).mediaType, entry.uri, complete),
      ECCClientGa4ghWesRunOutput.limit(this.maxRows, DEFAULT_MAX_ROWS),
      ECCClientGa4ghWesRunOutput.limit(this.maxColumns, DEFAULT_MAX_COLUMNS)
    );
    // A budget for all tables, so that many files can't add up
    const width = Math.max(1, table.header.length);
    const fit = Math.floor(this.cellBudget / width) - 1;
    if (fit < 0) {
      return {
        status: "error",
        message: "the tables of this output are too large to show together",
      };
    }
    const rows = table.rows.slice(0, fit);
    this.cellBudget -= width * (rows.length + 1);
    return {
      status: "table",
      ...table,
      rows,
      more: table.more || truncated || rows.length < table.rows.length,
    };
  }

  /** The URI of the entry at `index` of the output as set now. */
  private uriAt(index: number): string | undefined {
    const entry = outputEntries(this.schema, this.value, index + 1).entries[
      index
    ];
    return entry?.type === "file" ? entry.uri : undefined;
  }

  private async download(index: number, uri: string): Promise<void> {
    const { loads } = this;
    const request = (this.downloadRequests.get(index) ?? 0) + 1;
    this.downloadRequests.set(index, request);
    // Whether this is still the latest request for the file shown, also if
    // the output was set again and the update is still pending
    const current = () =>
      this.loads === loads &&
      this.downloadRequests.get(index) === request &&
      this.uriAt(index) === uri;
    const errors = new Map(this.downloadErrors);
    errors.delete(index);
    this.downloadErrors = errors;
    try {
      if (!this.provider) throw new Error("no output provider is set");
      const url = await ECCClientGa4ghWesRunOutput.withTimeout(
        this.provider.getDownloadUrl(uri)
      );
      // The output changed meanwhile, or a newer click took over
      if (!current()) return;
      if (!isHttpUrl(url)) {
        throw new Error("the provider returned no http or https URL");
      }
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "";
      anchor.rel = "noopener noreferrer";
      this.renderRoot.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (err) {
      if (!current()) return;
      this.downloadErrors = new Map(this.downloadErrors).set(
        index,
        `Download failed: ${errorMessage(err)}`
      );
    }
  }

  private get heading(): string {
    const title = this.schema?.title;
    return typeof title === "string" && title ? title : this.name;
  }

  private static renderTable(view: Extract<View, { status: "table" }>) {
    const shown = view.rows.length;
    const columns = view.header.length;
    return html`
      ${view.more || view.moreColumns
        ? html`<p class="text-muted-foreground" data-notice>
            ${view.more && shown === 1 ? "Showing the first row only." : ""}
            ${view.more && shown !== 1
              ? `Showing the first ${shown} rows only.`
              : ""}
            ${view.moreColumns
              ? `Showing the first ${columns} columns only.`
              : ""}
            Download the file for all of it.
          </p>`
        : nothing}
      <div class="max-h-[480px] overflow-auto">
        <ecc-utils-design-table>
          <ecc-utils-design-table-header>
            <ecc-utils-design-table-row>
              ${view.header.map(
                (cell) =>
                  html`<ecc-utils-design-table-head
                    >${cell}</ecc-utils-design-table-head
                  >`
              )}
            </ecc-utils-design-table-row>
          </ecc-utils-design-table-header>
          <ecc-utils-design-table-body>
            ${view.rows.map(
              (row) => html`<ecc-utils-design-table-row>
                ${row.map(
                  (cell) =>
                    html`<ecc-utils-design-table-cell
                      >${cell}</ecc-utils-design-table-cell
                    >`
                )}
              </ecc-utils-design-table-row>`
            )}
          </ecc-utils-design-table-body>
        </ecc-utils-design-table>
      </div>
    `;
  }

  private renderView(view: View | undefined, frameTitle: string) {
    switch (view?.status) {
      case "loading":
        return html`<ecc-utils-design-skeleton
          data-loading
          class="part:h-24 part:w-full"
        ></ecc-utils-design-skeleton>`;
      case "blocked":
        return html`<p class="text-destructive" data-blocked>
          Not shown or linked: the URI is not allowed. ${view.message}
        </p>`;
      case "error":
        return html`<p class="text-destructive" data-error>
          Can't show the file: ${view.message}. Download it instead.
        </p>`;
      case "html":
        // Empty sandbox: no scripts, forms, pop-ups or navigation of the
        // page, and an opaque origin; the CSP in srcdoc blocks external
        // loads, and links without targets can't load other pages into the
        // frame (see htmlSrcdoc)
        return html`<iframe
          sandbox=""
          referrerpolicy="no-referrer"
          title=${frameTitle}
          srcdoc=${view.srcdoc}
          class="h-[480px] w-full rounded-md border bg-white"
        ></iframe>`;
      case "table":
        return ECCClientGa4ghWesRunOutput.renderTable(view);
      case "download":
        return this.provider
          ? nothing
          : html`<p class="text-muted-foreground">
              Download isn't available: no output provider is set.
            </p>`;
      default:
        return nothing;
    }
  }

  private renderFile(
    entry: Extract<OutputEntry, { type: "file" }>,
    index: number
  ) {
    const view = this.views.get(index);
    const canDownload = !!this.provider && view?.status !== "blocked";
    const downloadError = this.downloadErrors.get(index);
    const frameTitle = entry.label
      ? `${this.heading}: ${entry.label}`
      : this.heading;
    return html`
      <div class="flex flex-col gap-2 rounded-md border p-3" data-entry>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex min-w-0 flex-col">
            ${entry.label
              ? html`<span class="font-medium" data-label>${entry.label}</span>`
              : nothing}
            <span
              class="break-all font-mono text-xs text-muted-foreground"
              data-uri
              >${entry.uri}</span
            >
          </div>
          ${canDownload
            ? html`<ecc-utils-design-button
                variant="outline"
                size="sm"
                data-download
                @click=${() => this.download(index, entry.uri)}
                >Download</ecc-utils-design-button
              >`
            : nothing}
        </div>
        ${this.renderView(view, frameTitle)}
        ${downloadError
          ? html`<p class="text-destructive" data-download-error>
              ${downloadError}
            </p>`
          : nothing}
      </div>
    `;
  }

  private static renderValue(value: unknown) {
    if (value === undefined) {
      return html`<p class="text-muted-foreground" data-value>No value.</p>`;
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return html`<p class="break-all" data-value>${String(value)}</p>`;
    }
    return html`<pre
      class="whitespace-pre-wrap break-all font-mono text-xs"
      data-value
    >
${JSON.stringify(value, null, 2)}</pre
    >`;
  }

  render() {
    const description = this.schema?.description;
    return html`
      <section part="base" class="flex flex-col gap-2 text-sm">
        <div class="text-base font-bold" data-title>${this.heading}</div>
        ${typeof description === "string" && description
          ? // A property binding: as text, without the template's
            // whitespace, which pre-line would keep as line breaks
            html`<p
              class="whitespace-pre-line text-muted-foreground"
              data-description
              .textContent=${description}
            ></p>`
          : nothing}
        ${this.entries.map((entry, index) =>
          entry.type === "file"
            ? this.renderFile(entry, index)
            : ECCClientGa4ghWesRunOutput.renderValue(entry.value)
        )}
        ${this.hiddenEntries > 0
          ? html`<p class="text-muted-foreground" data-hidden>
              ${this.hiddenEntries} more not shown: showing the first
              ${this.entries.length} only.
            </p>`
          : nothing}
      </section>
    `;
  }
}

export default ECCClientGa4ghWesRunOutput;
