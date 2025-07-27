import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { WesProvider, RunStatus, State } from "../../providers/wes-provider.js";
import { RestWesProvider } from "../../providers/rest-wes-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/pagination/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";

/**
 * @summary Component for listing workflow runs from a WES service
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the WES instance/gateway
 * @property {number} pageSize - Number of runs per page
 * @property {WesProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-runs-changed - Fired when runs data changes
 * @fires ecc-runs-selected - Fired when a run is selected
 */
export class ECCClientGa4ghWesRuns extends LitElement {
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
  @property({ attribute: false, reflect: true }) provider?: WesProvider;

  @state() private currentPage = 1;
  @state() private runs: RunStatus[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private nextPageToken: string | null = null;
  @state() private hasMorePages = true;
  @state() private lastPage = -1;
  @state() private pageTokens: Map<number, string | undefined> = new Map();

  private _provider: WesProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the WES API or a custom provider.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestWesProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider) {
      // Initialize page tokens - page 1 doesn't need a token
      this.pageTokens.set(1, undefined);
      await this.loadData();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("pageSize")) {
      this.pageTokens.clear();
      this.pageTokens.set(1, undefined);
      this.currentPage = 1;
      this.lastPage = -1;
      this.loadData();
    }

    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this._provider = new RestWesProvider(this.baseUrl);
      this.pageTokens.clear();
      this.pageTokens.set(1, undefined);
      this.currentPage = 1;
      this.lastPage = -1;
      this.loadData();
    }

    if (changedProperties.has("provider") && this.provider) {
      this._provider = this.provider;
      this.pageTokens.clear();
      this.pageTokens.set(1, undefined);
      this.currentPage = 1;
      this.lastPage = -1;
      this.loadData();
    }
  }

  private async loadData(): Promise<void> {
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      // Get the token for the current page
      const pageToken = this.pageTokens.get(this.currentPage);
      const response = await this._provider.listRuns(this.pageSize, pageToken);

      this.runs = response.runs;
      this.nextPageToken = response.next_page_token || null;
      this.hasMorePages = !!response.next_page_token;

      // Store the token for the next page if it exists
      if (response.next_page_token) {
        this.pageTokens.set(this.currentPage + 1, response.next_page_token);
      }

      // Update lastPage based on returned items
      if (this.runs.length === 0) {
        this.lastPage = this.currentPage - 1;
        // Clear any tokens beyond the last valid page
        for (
          let page = this.currentPage;
          page <= this.currentPage + 10;
          page += 1
        ) {
          this.pageTokens.delete(page);
        }
      } else if (
        this.runs.length < this.pageSize ||
        !response.next_page_token
      ) {
        // This is the last page if we got fewer items than pageSize OR no next token
        this.lastPage = this.currentPage;
        // Clear any tokens beyond the last page
        for (
          let page = this.currentPage + 1;
          page <= this.currentPage + 10;
          page += 1
        ) {
          this.pageTokens.delete(page);
        }
      }

      // Update UI based on returned items
      if (this.runs.length === 0 && this.currentPage > 1) {
        // If we get no results and we're not on the first page, go back a page
        this.currentPage -= 1;
        this.loadData();
        return;
      }

      // Emit an event with the updated runs
      this.dispatchEvent(
        new CustomEvent("ecc-runs-changed", {
          detail: { runs: this.runs },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load runs";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghWesRuns.loadData",
      });
    } finally {
      this.loading = false;
    }
  }

  private handleViewDetails(runId: string): void {
    const event = new CustomEvent("ecc-runs-selected", {
      detail: { runId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private goToPage(page: number): void {
    if (page < 1) return;

    // Don't allow going beyond last known page
    if (this.lastPage !== -1 && page > this.lastPage) return;

    // Don't allow going forward if we don't have a token for that page and no more pages available
    if (
      page > this.currentPage &&
      !this.pageTokens.has(page) &&
      !this.hasMorePages
    )
      return;

    this.currentPage = page;
    this.loadData();
  }

  private renderPagination() {
    return html`
      <ecc-utils-design-pagination>
        <ecc-utils-design-pagination-content>
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-previous
              ?disabled=${this.currentPage === 1}
              @ecc-button-clicked=${(e: CustomEvent) => {
                if (e.detail.variant === "previous") {
                  this.goToPage(this.currentPage - 1);
                }
              }}
            ></ecc-utils-design-pagination-previous>
          </ecc-utils-design-pagination-item>

          ${this.currentPage > 2
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-link
                    @ecc-button-clicked=${(e: CustomEvent) => {
                      if (e.detail.variant === "link") {
                        this.goToPage(1);
                      }
                    }}
                    >1</ecc-utils-design-pagination-link
                  >
                </ecc-utils-design-pagination-item>
              `
            : ""}
          ${this.currentPage > 3
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-ellipsis></ecc-utils-design-pagination-ellipsis>
                </ecc-utils-design-pagination-item>
              `
            : ""}
          ${this.currentPage > 1
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-link
                    @ecc-button-clicked=${(e: CustomEvent) => {
                      if (e.detail.variant === "link") {
                        this.goToPage(this.currentPage - 1);
                      }
                    }}
                    >${this.currentPage - 1}</ecc-utils-design-pagination-link
                  >
                </ecc-utils-design-pagination-item>
              `
            : ""}

          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-link isActive>
              ${this.currentPage}
            </ecc-utils-design-pagination-link>
          </ecc-utils-design-pagination-item>

          ${this.lastPage === -1
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-link
                    @ecc-button-clicked=${(e: CustomEvent) => {
                      if (e.detail.variant === "link") {
                        this.goToPage(this.currentPage + 1);
                      }
                    }}
                    >${this.currentPage + 1}
                  </ecc-utils-design-pagination-link>
                </ecc-utils-design-pagination-item>
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-ellipsis></ecc-utils-design-pagination-ellipsis>
                </ecc-utils-design-pagination-item>
              `
            : ""}
          ${this.lastPage !== -1 && this.currentPage < this.lastPage
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-link
                    @ecc-button-clicked=${(e: CustomEvent) => {
                      if (e.detail.variant === "link") {
                        this.goToPage(this.currentPage + 1);
                      }
                    }}
                    >${this.currentPage + 1}
                  </ecc-utils-design-pagination-link>
                </ecc-utils-design-pagination-item>
              `
            : ""}
          ${this.lastPage !== -1 && this.currentPage < this.lastPage - 2
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-ellipsis></ecc-utils-design-pagination-ellipsis>
                </ecc-utils-design-pagination-item>
              `
            : ""}
          ${this.lastPage !== -1 && this.currentPage < this.lastPage - 1
            ? html`
                <ecc-utils-design-pagination-item>
                  <ecc-utils-design-pagination-link
                    @ecc-button-clicked=${(e: CustomEvent) => {
                      if (e.detail.variant === "link") {
                        this.goToPage(this.lastPage);
                      }
                    }}
                    >${this.lastPage}
                  </ecc-utils-design-pagination-link>
                </ecc-utils-design-pagination-item>
              `
            : ""}

          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-next
              ?disabled=${(this.lastPage !== -1 &&
                this.lastPage === this.currentPage) ||
              (this.lastPage === -1 && !this.hasMorePages)}
              @ecc-button-clicked=${(e: CustomEvent) => {
                if (e.detail.variant === "next") {
                  this.goToPage(this.currentPage + 1);
                }
              }}
            ></ecc-utils-design-pagination-next>
          </ecc-utils-design-pagination-item>
        </ecc-utils-design-pagination-content>
      </ecc-utils-design-pagination>
    `;
  }

  /**
   * Get badge variant and label for workflow run state
   */
  static getStateInfo(runState: State): {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  } {
    const stateInfo: Record<
      State,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      UNKNOWN: { variant: "outline", label: "Unknown" },
      QUEUED: { variant: "secondary", label: "Queued" },
      INITIALIZING: { variant: "secondary", label: "Initializing" },
      RUNNING: { variant: "default", label: "Running" },
      PAUSED: { variant: "outline", label: "Paused" },
      COMPLETE: { variant: "default", label: "Complete" },
      EXECUTOR_ERROR: { variant: "destructive", label: "Executor Error" },
      SYSTEM_ERROR: { variant: "destructive", label: "System Error" },
      CANCELED: { variant: "outline", label: "Canceled" },
      CANCELING: { variant: "outline", label: "Canceling" },
    };

    return stateInfo[runState] || { variant: "outline", label: runState };
  }

  private renderSkeletonRows() {
    return html`
      ${Array(this.pageSize)
        .fill(0)
        .map(
          () => html`
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-cell class="w-6/12">
                <ecc-utils-design-skeleton
                  class="part:h-5 part:w-64"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-2/12">
                <ecc-utils-design-skeleton
                  class="part:h-6 part:w-20 part:rounded-full"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-3/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-32"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-1/12">
                <ecc-utils-design-skeleton
                  class="part:h-8 part:w-8 part:rounded"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
            </ecc-utils-design-table-row>
          `
        )}
    `;
  }

  /**
   * Format run ID for display (truncate if too long)
   */
  static formatRunId(runId: string): string {
    if (runId.length > 20) {
      return `${runId.substring(0, 8)}...${runId.substring(runId.length - 8)}`;
    }
    return runId;
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the WES API or a custom provider.
        </div>
      `;
    }

    return html`
      <div class="flex flex-col gap-4">
        ${this.error
          ? html`
              <div
                class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10 my-4"
              >
                ${this.error}
              </div>
            `
          : ""}

        <ecc-utils-design-table>
          <ecc-utils-design-table-header>
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-head class="w-6/12"
                >Run ID</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >State</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-3/12"
                >Actions</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head
                class="w-1/12"
              ></ecc-utils-design-table-head>
            </ecc-utils-design-table-row>
          </ecc-utils-design-table-header>
          <ecc-utils-design-table-body>
            ${(() => {
              if (this.loading) {
                return this.renderSkeletonRows();
              }
              if (this.runs.length === 0) {
                return html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell
                      colspan="4"
                      class="part:text-center part:py-8 part:text-muted-foreground"
                    >
                      No workflow runs found
                    </ecc-utils-design-table-cell>
                  </ecc-utils-design-table-row>
                `;
              }
              return this.runs.map(
                (run) => html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell class="w-6/12">
                      <ecc-utils-design-button
                        class="part:font-mono part:text-sm part:w-fit part:cursor-pointer part:p-0"
                        variant="link"
                        @click=${() => this.handleViewDetails(run.run_id)}
                        title=${run.run_id}
                      >
                        ${ECCClientGa4ghWesRuns.formatRunId(run.run_id)}
                      </ecc-utils-design-button>
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-2/12">
                      ${(() => {
                        const stateInfo = ECCClientGa4ghWesRuns.getStateInfo(
                          run.state
                        );
                        return html`
                          <ecc-utils-design-badge variant=${stateInfo.variant}>
                            ${stateInfo.label}
                          </ecc-utils-design-badge>
                        `;
                      })()}
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-3/12">
                      <div class="flex gap-2">
                        <ecc-utils-design-button
                          size="sm"
                          variant="outline"
                          @click=${() => this.handleViewDetails(run.run_id)}
                        >
                          View Details
                        </ecc-utils-design-button>
                        ${run.state === "RUNNING" ||
                        run.state === "QUEUED" ||
                        run.state === "INITIALIZING"
                          ? html`
                              <ecc-utils-design-button
                                size="sm"
                                variant="destructive"
                                @click=${() => this.handleCancelRun(run.run_id)}
                              >
                                Cancel
                              </ecc-utils-design-button>
                            `
                          : ""}
                      </div>
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-1/12">
                      <slot name=${`actions-${run.run_id}`}> </slot>
                    </ecc-utils-design-table-cell>
                  </ecc-utils-design-table-row>
                `
              );
            })()}
          </ecc-utils-design-table-body>
        </ecc-utils-design-table>

        ${!this.loading && this.runs.length > 0 ? this.renderPagination() : ""}
      </div>
    `;
  }

  private async handleCancelRun(runId: string): Promise<void> {
    if (!this._provider) return;

    try {
      await this._provider.cancelRun(runId);
      // Reload data to refresh the state
      await this.loadData();
    } catch (err) {
      console.error("Failed to cancel run:", err);
      // You might want to emit an error event here
    }
  }
}

export default ECCClientGa4ghWesRuns;
