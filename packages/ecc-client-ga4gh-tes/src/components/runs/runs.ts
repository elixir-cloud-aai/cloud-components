import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  TesProvider,
  Task,
  State,
  STATE_INFO,
  CANCELLABLE_STATES,
} from "../../providers/tes-provider.js";
import { RestTesProvider } from "../../providers/rest-tes-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/pagination/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";

const NO_SOURCE_ERROR =
  "Please provide either a base URL for the TES API or a custom provider.";

/**
 * @summary Component for listing tasks from a TES service
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the TES instance/gateway
 * @property {number} pageSize - Number of tasks per page
 * @property {boolean} search - Show the task name prefix search field
 * @property {boolean} filter - Show the state filter (applied server-side)
 * @property {TesProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-runs-changed - Fired when the list of tasks changes
 * @fires ecc-runs-selected - Fired when a task is selected
 */
export class ECCClientGa4ghTesRuns extends LitElement {
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

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ type: Number, reflect: true }) pageSize = 10;
  @property({ type: Boolean, reflect: true }) search = true;
  @property({ type: Boolean, reflect: true }) filter = true;
  @property({ attribute: false }) provider?: TesProvider;

  @state() private currentPage = 1;
  @state() private runs: Task[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private namePrefix = "";
  @state() private stateFilter = "";

  // Token needed to fetch page N; page 1 has none.
  private pageTokens: Map<number, string | undefined> = new Map([
    [1, undefined],
  ]);

  private _provider: TesProvider | null = null;

  private searchTimer?: ReturnType<typeof setTimeout>;

  private initialized = false;

  protected firstUpdated(): void {
    this.initializeProvider();
    this.reset();
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    const isFirstUpdate = !this.initialized;
    this.initialized = true;
    if (isFirstUpdate) return;

    if (
      changed.has("provider") ||
      changed.has("baseUrl") ||
      changed.has("pageSize")
    ) {
      this.initializeProvider();
      this.reset();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    clearTimeout(this.searchTimer);
  }

  private initializeProvider(): void {
    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestTesProvider(this.baseUrl);
    } else {
      this.error =
        "Please provide either a base URL for the TES API or a custom provider.";
    }
  }

  private reset(): void {
    this.pageTokens = new Map([[1, undefined]]);
    this.currentPage = 1;
    this.loadData();
  }

  private async loadData(): Promise<void> {
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      const response = await this._provider.listTasks({
        pageSize: this.pageSize,
        pageToken: this.pageTokens.get(this.currentPage),
        view: "BASIC",
        namePrefix: this.namePrefix || undefined,
        state: (this.stateFilter as State) || undefined,
      });

      this.runs = response.tasks;
      if (response.next_page_token) {
        this.pageTokens.set(this.currentPage + 1, response.next_page_token);
      }

      this.dispatchEvent(
        new CustomEvent("ecc-runs-changed", {
          detail: { runs: this.runs },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load tasks";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghTesRuns.loadData",
      });
    } finally {
      this.loading = false;
    }
  }

  private goToPage(page: number): void {
    if (page < 1 || page === this.currentPage) return;
    if (!this.pageTokens.has(page)) return;
    this.currentPage = page;
    this.loadData();
  }

  private handleSearch(value: string): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.namePrefix = value.trim();
      this.reset();
    }, 300);
  }

  private handleViewDetails(runId: string): void {
    this.dispatchEvent(
      new CustomEvent("ecc-runs-selected", {
        detail: { runId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async handleDelete(runId: string): Promise<void> {
    if (!this._provider) return;

    try {
      await this._provider.cancelTask(runId);
      await this.loadData();
    } catch (err) {
      this.error = `Failed to cancel task ${runId}: ${
        err instanceof Error ? err.message : String(err)
      }`;
    }
  }

  private static getStateInfo(taskState: State) {
    return STATE_INFO[taskState] || { variant: "outline", label: taskState };
  }

  private static formatRunId(runId: string): string {
    if (runId.length > 20) {
      return `${runId.substring(0, 8)}...${runId.substring(runId.length - 8)}`;
    }
    return runId;
  }

  private static formatDateTime(dateTime?: string): string {
    if (!dateTime) return "N/A";

    try {
      const date = new Date(dateTime);
      return Number.isNaN(date.getTime()) ? dateTime : date.toLocaleString();
    } catch {
      return dateTime;
    }
  }

  private renderToolbar() {
    if (!this.search && !this.filter) return html``;

    return html`
      <div class="flex flex-col gap-2 md:flex-row">
        ${this.search
          ? html`
              <ecc-utils-design-input
                class="flex-1"
                placeholder="Search by name prefix"
                .value=${this.namePrefix}
                @ecc-input-changed=${(e: CustomEvent) =>
                  this.handleSearch(e.detail.value)}
              ></ecc-utils-design-input>
            `
          : ""}
        ${this.filter
          ? html`
              <ecc-utils-design-select
                class="md:w-56"
                .value=${this.stateFilter}
                @ecc-input-changed=${(e: CustomEvent) => {
                  this.stateFilter = e.detail.value;
                  this.reset();
                }}
              >
                <ecc-utils-design-select-trigger>
                  <ecc-utils-design-select-value
                    placeholder="Filter by status"
                  ></ecc-utils-design-select-value>
                </ecc-utils-design-select-trigger>
                <ecc-utils-design-select-content>
                  <ecc-utils-design-select-item value="">
                    All
                  </ecc-utils-design-select-item>
                  ${(Object.keys(STATE_INFO) as State[]).map(
                    (s) => html`
                      <ecc-utils-design-select-item value=${s}>
                        ${STATE_INFO[s].label}
                      </ecc-utils-design-select-item>
                    `
                  )}
                </ecc-utils-design-select-content>
              </ecc-utils-design-select>
            `
          : ""}
      </div>
    `;
  }

  private renderPagination() {
    const hasPrevious = this.currentPage > 1;
    const hasNext = this.pageTokens.has(this.currentPage + 1);
    const link = (page: number) => html`
      <ecc-utils-design-pagination-item>
        <ecc-utils-design-pagination-link
          @ecc-button-clicked=${() => this.goToPage(page)}
          >${page}</ecc-utils-design-pagination-link
        >
      </ecc-utils-design-pagination-item>
    `;

    return html`
      <ecc-utils-design-pagination>
        <ecc-utils-design-pagination-content>
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-previous
              ?disabled=${!hasPrevious}
              @ecc-button-clicked=${() => this.goToPage(this.currentPage - 1)}
            ></ecc-utils-design-pagination-previous>
          </ecc-utils-design-pagination-item>
          ${hasPrevious ? link(this.currentPage - 1) : ""}
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-link isActive>
              ${this.currentPage}
            </ecc-utils-design-pagination-link>
          </ecc-utils-design-pagination-item>
          ${hasNext ? link(this.currentPage + 1) : ""}
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-next
              ?disabled=${!hasNext}
              @ecc-button-clicked=${() => this.goToPage(this.currentPage + 1)}
            ></ecc-utils-design-pagination-next>
          </ecc-utils-design-pagination-item>
        </ecc-utils-design-pagination-content>
      </ecc-utils-design-pagination>
    `;
  }

  private renderSkeletonRows() {
    return Array.from({ length: this.pageSize }).map(
      () => html`
        <ecc-utils-design-table-row>
          <ecc-utils-design-table-cell>
            <ecc-utils-design-skeleton
              class="part:h-5 part:w-64"
            ></ecc-utils-design-skeleton>
          </ecc-utils-design-table-cell>
          <ecc-utils-design-table-cell>
            <ecc-utils-design-skeleton
              class="part:h-6 part:w-20 part:rounded-full"
            ></ecc-utils-design-skeleton>
          </ecc-utils-design-table-cell>
          <ecc-utils-design-table-cell>
            <ecc-utils-design-skeleton
              class="part:h-4 part:w-32"
            ></ecc-utils-design-skeleton>
          </ecc-utils-design-table-cell>
          <ecc-utils-design-table-cell>
            <ecc-utils-design-skeleton
              class="part:h-8 part:w-8 part:rounded"
            ></ecc-utils-design-skeleton>
          </ecc-utils-design-table-cell>
        </ecc-utils-design-table-row>
      `
    );
  }

  private renderRow(run: Task) {
    const info = ECCClientGa4ghTesRuns.getStateInfo(run.state);

    return html`
      <ecc-utils-design-table-row>
        <ecc-utils-design-table-cell class="w-5/12">
          <slot name=${`run-name-${run.id}`}>
            <div class="flex flex-col gap-1">
              ${run.name ? html`<span>${run.name}</span>` : ""}
              <ecc-utils-design-button
                class="part:font-mono part:text-sm part:w-fit part:cursor-pointer part:p-0"
                variant="link"
                title=${run.id}
                @click=${() => this.handleViewDetails(run.id)}
              >
                ${ECCClientGa4ghTesRuns.formatRunId(run.id)}
              </ecc-utils-design-button>
            </div>
          </slot>
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-2/12">
          <ecc-utils-design-badge variant=${info.variant}>
            ${info.label}
          </ecc-utils-design-badge>
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-2/12">
          ${ECCClientGa4ghTesRuns.formatDateTime(run.creation_time)}
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-3/12">
          <slot name=${`actions-${run.id}`}>
            <div class="flex gap-2">
              <ecc-utils-design-button
                size="sm"
                variant="outline"
                @click=${() => this.handleViewDetails(run.id)}
              >
                View Details
              </ecc-utils-design-button>
              ${CANCELLABLE_STATES.includes(run.state)
                ? html`
                    <ecc-utils-design-button
                      size="sm"
                      variant="destructive"
                      @click=${() => this.handleDelete(run.id)}
                    >
                      Delete
                    </ecc-utils-design-button>
                  `
                : ""}
            </div>
          </slot>
        </ecc-utils-design-table-cell>
      </ecc-utils-design-table-row>
    `;
  }

  private renderRows() {
    if (this.loading) return this.renderSkeletonRows();

    const visible = this.runs;

    if (visible.length === 0) {
      return html`
        <ecc-utils-design-table-row>
          <ecc-utils-design-table-cell
            colspan="4"
            class="part:text-center part:py-8 part:text-muted-foreground"
          >
            No tasks found
          </ecc-utils-design-table-cell>
        </ecc-utils-design-table-row>
      `;
    }

    return visible.map((run) => this.renderRow(run));
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          ${NO_SOURCE_ERROR}
        </div>
      `;
    }

    return html`
      <div class="flex flex-col gap-4">
        ${this.error
          ? html`
              <div
                class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
              >
                ${this.error}
              </div>
            `
          : ""}
        ${this.renderToolbar()}

        <ecc-utils-design-table>
          <ecc-utils-design-table-header>
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-head class="w-5/12"
                >Task</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >State</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Created</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head
                class="w-3/12"
              ></ecc-utils-design-table-head>
            </ecc-utils-design-table-row>
          </ecc-utils-design-table-header>
          <ecc-utils-design-table-body>
            ${this.renderRows()}
          </ecc-utils-design-table-body>
        </ecc-utils-design-table>

        ${!this.loading && (this.runs.length > 0 || this.currentPage > 1)
          ? this.renderPagination()
          : ""}
      </div>
    `;
  }
}

export default ECCClientGa4ghTesRuns;
