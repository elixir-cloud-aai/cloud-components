import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import type { WesOutputProvider } from "../../providers/wes-output-provider.js";
import {
  DEFAULT_ALLOWED_SCHEMES,
  OutputEntry,
  OutputSchema,
  Viewer,
  checkOutputUri,
  delimiterFor,
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
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;

/** What an entry of the output shows below its URI. */
type View =
  | { status: "loading" }
  | { status: "download" }
  | { status: "blocked"; message: string }
  | { status: "error"; message: string }
  | { status: "html"; srcdoc: string }
  | { status: "table"; header: string[]; rows: string[][]; more: boolean };

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : String(err);

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
 *   downloaded (attribute `allowed-schemes`, separated by spaces or commas).
 * @property {number} maxRows - Rows that a table shows at most (attribute
 *   `max-rows`).
 * @property {number} maxBytes - Bytes of a file that a viewer reads at most
 *   (attribute `max-bytes`).
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
    converter: {
      fromAttribute: (value: string | null) =>
        (value ?? "")
          .split(/[\s,]+/)
          .filter(Boolean)
          .map((scheme) => scheme.toLowerCase()),
      toAttribute: (value: string[]) => value.join(" "),
    },
  })
  allowedSchemes: string[] = [...DEFAULT_ALLOWED_SCHEMES];

  @property({ type: Number, attribute: "max-rows" }) maxRows = DEFAULT_MAX_ROWS;

  @property({ type: Number, attribute: "max-bytes" }) maxBytes =
    DEFAULT_MAX_BYTES;

  @state() private entries: OutputEntry[] = [];
  @state() private views = new Map<number, View>();
  @state() private downloadErrors = new Map<number, string>();

  private loads?: AbortController;

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
      changed.has("maxBytes")
    ) {
      this.load();
    }
  }

  private static limit(value: number, fallback: number): number {
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
  }

  /** Splits the output into entries and starts loading their viewers. */
  private load(): void {
    this.loads?.abort();
    const controller = new AbortController();
    this.loads = controller;
    this.entries = outputEntries(this.schema, this.value);
    this.downloadErrors = new Map();
    const views = new Map<number, View>();
    this.entries.forEach((entry, index) => {
      if (entry.type !== "file") return;
      const file = entry.schema["x-ga4gh-file"] as Record<string, unknown>;
      const refused = checkOutputUri(
        entry.uri,
        this.allowedSchemes,
        file.schemes
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
      this.loadView(index, entry, viewer, this.provider, controller.signal);
    });
    this.views = views;
  }

  private setView(index: number, view: View): void {
    this.views = new Map(this.views).set(index, view);
  }

  private async loadView(
    index: number,
    entry: Extract<OutputEntry, { type: "file" }>,
    viewer: Viewer,
    provider: WesOutputProvider,
    signal: AbortSignal
  ): Promise<void> {
    const maxBytes = ECCClientGa4ghWesRunOutput.limit(
      this.maxBytes,
      DEFAULT_MAX_BYTES
    );
    try {
      const response = await provider.fetchOutput(entry.uri, { signal });
      if (signal.aborted) return;
      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}${
            response.statusText ? ` ${response.statusText}` : ""
          }`
        );
      }
      const { text, truncated } = await readLimitedText(response, maxBytes);
      if (signal.aborted) return;
      if (viewer === "html-viewer") {
        // A cut report would be shown incomplete without a hint
        this.setView(
          index,
          truncated
            ? {
                status: "error",
                message: `the file is too large to show (more than ${maxBytes} bytes)`,
              }
            : { status: "html", srcdoc: htmlSrcdoc(text) }
        );
        return;
      }
      // Drop the partial last line of a cut table
      const complete = truncated
        ? text.slice(0, text.lastIndexOf("\n") + 1)
        : text;
      const file = entry.schema["x-ga4gh-file"] as Record<string, unknown>;
      const table = parseDelimited(
        complete,
        delimiterFor(file.mediaType, entry.uri, complete),
        ECCClientGa4ghWesRunOutput.limit(this.maxRows, DEFAULT_MAX_ROWS)
      );
      this.setView(index, {
        status: "table",
        ...table,
        more: table.more || truncated,
      });
    } catch (err) {
      if (signal.aborted) return;
      this.setView(index, { status: "error", message: errorMessage(err) });
    }
  }

  private async download(index: number, uri: string): Promise<void> {
    const errors = new Map(this.downloadErrors);
    errors.delete(index);
    this.downloadErrors = errors;
    try {
      if (!this.provider) throw new Error("no output provider is set");
      const url = await this.provider.getDownloadUrl(uri);
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
    return html`
      ${view.more
        ? html`<p class="text-muted-foreground" data-notice>
            ${shown === 1
              ? "Showing the first row only."
              : `Showing the first ${shown} rows only.`}
            Download the file for all rows.
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
        // Empty sandbox: no scripts, forms, pop-ups or navigation, and an
        // opaque origin; the CSP in srcdoc blocks external loads
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
      </section>
    `;
  }
}

export default ECCClientGa4ghWesRunOutput;
