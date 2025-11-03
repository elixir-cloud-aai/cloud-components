import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { DrsProvider, DrsObject } from "../../providers/drs-provider.js";
import { RestDrsProvider } from "../../providers/rest-drs-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/pagination/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";

/**
 * @summary This component is used to display data from DRS API.
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the DRS instance/gateway
 * @property {number} pageSize - Number of objects per page
 * @property {boolean} search - Determines if the search field should be rendered
 * @property {DrsProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-objects-changed - Fired when objects data changes
 * @fires ecc-objects-selected - Fired when an object is selected
 */
export class ECCClientGa4ghDrsObjects extends LitElement {
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
  @property({ attribute: false, reflect: true }) provider?: DrsProvider;

  @state() private currentPage = 1;
  @state() private searchQuery = "";
  @state() private objects: DrsObject[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  @state() private totalObjects = 0;
  @state() private lastPage = -1;

  private _provider: DrsProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the DRS API or a custom provider.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestDrsProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider) {
      await this.loadData();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("pageSize")) {
      this.loadData();
    }

    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this._provider = new RestDrsProvider(this.baseUrl);
      this.loadData();
    }
  }

  private async loadData(): Promise<void> {
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      const offset = (this.currentPage - 1) * this.pageSize;
      const result = await this._provider.getObjects(this.pageSize, offset);
      this.objects = result.objects;

      if (this.objects.length === 0) {
        this.lastPage = this.currentPage - 1;
      } else if (this.objects.length < this.pageSize) {
        this.lastPage = this.currentPage;
      }

      // Update UI based on returned items
      if (this.objects.length === 0 && this.currentPage > 1) {
        // If we get no results and we're not on the first page, go back a page
        this.currentPage -= 1;
        this.loadData();
        return;
      }

      // Emit an event with the updated objects
      this.dispatchEvent(
        new CustomEvent("ecc-objects-changed", {
          detail: { objects: this.objects },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to load objects";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghDrsObjects.loadData",
      });
    } finally {
      this.loading = false;
    }
  }

  private handleSearch(e: CustomEvent): void {
    this.searchQuery = e.detail.value;

    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a new timeout for debouncing
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1; // Reset to first page on search
      this.lastPage = -1; // Reset lastPage when search changes
      this.loadData();
    }, 500); // 500ms debounce time
  }

  private handleObjectSelect(objectId: string): void {
    const event = new CustomEvent("ecc-objects-selected", {
      detail: { objectId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private goToPage(page: number): void {
    if (page < 1) return;
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
                    >${this.lastPage}</ecc-utils-design-pagination-link
                  >
                </ecc-utils-design-pagination-item>
              `
            : ""}

          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-next
              ?disabled=${this.lastPage !== -1 &&
              this.lastPage === this.currentPage}
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

  private renderSkeletonRows() {
    return html`
      ${Array(this.pageSize)
        .fill(0)
        .map(
          () => html`
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-cell class="w-6/12">
                <div class="flex flex-col w-full gap-2">
                  <ecc-utils-design-skeleton
                    class="part:h-5 part:w-40"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-3 part:w-full"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-3 part:w-4/5"
                  ></ecc-utils-design-skeleton>
                </div>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-2/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-20"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-2/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-24"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-2/12">
                <ecc-utils-design-skeleton
                  class="part:h-8 part:w-8 part:rounded"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
            </ecc-utils-design-table-row>
          `
        )}
    `;
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }

  private static formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  private static getObjectType(object: DrsObject): {
    label: string;
    variant: "default" | "secondary";
  } {
    if (object.contents && object.contents.length > 0) {
      return { label: "Bundle", variant: "default" };
    }
    return { label: "Blob", variant: "secondary" };
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the DRS API or a custom provider.
        </div>
      `;
    }

    return html`
      <div class="flex flex-col gap-4">
        ${this.search
          ? html`
              <div class="flex flex-wrap gap-4 items-end">
                <div class="flex-1 flex flex-col gap-1">
                  <ecc-utils-design-label
                    >Search Objects</ecc-utils-design-label
                  >
                  <div class="flex">
                    <ecc-utils-design-input
                      class="part:w-full w-full"
                      placeholder="Search by object name or ID..."
                      @ecc-input-changed=${this.handleSearch}
                    ></ecc-utils-design-input>
                  </div>
                </div>
              </div>
            `
          : ""}
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
                >Object Info</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Size</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Created</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head
                class="w-2/12"
              ></ecc-utils-design-table-head>
            </ecc-utils-design-table-row>
          </ecc-utils-design-table-header>
          <ecc-utils-design-table-body>
            ${(() => {
              if (this.loading) {
                return this.renderSkeletonRows();
              }
              if (this.objects.length === 0) {
                return html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell
                      colspan="5"
                      class="part:text-center part:py-8 part:text-muted-foreground"
                    >
                      No objects found
                    </ecc-utils-design-table-cell>
                  </ecc-utils-design-table-row>
                `;
              }
              return this.objects.map(
                (object) => html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell class="w-6/12">
                      <div class="flex flex-col w-full">
                        <ecc-utils-design-button
                          class="part:font-medium part:text-primary part:w-fit part:cursor-pointer part:p-0"
                          variant="link"
                          @click=${() => this.handleObjectSelect(object.id)}
                        >
                          ${object.name || object.id}
                        </ecc-utils-design-button>
                        ${object.description
                          ? html`<div
                              class="text-xs text-muted-foreground line-clamp-2 break-all whitespace-normal overflow-hidden max-w-full"
                            >
                              ${object.description}
                            </div>`
                          : ""}
                        ${object.mime_type
                          ? html`<div class="text-xs text-muted-foreground">
                              MIME: ${object.mime_type}
                            </div>`
                          : ""}
                      </div>
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-2/12">
                      <span class="text-sm"
                        >${ECCClientGa4ghDrsObjects.formatFileSize(
                          object.size
                        )}</span
                      >
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-2/12">
                      <span class="text-sm"
                        >${ECCClientGa4ghDrsObjects.formatDate(
                          object.created_time
                        )}</span
                      >
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-2/12">
                      <slot name=${`actions-${object.id}`}>
                        <ecc-utils-design-button
                          size="sm"
                          @click=${() => this.handleObjectSelect(object.id)}
                        >
                          View Details
                        </ecc-utils-design-button>
                      </slot>
                    </ecc-utils-design-table-cell>
                  </ecc-utils-design-table-row>
                `
              );
            })()}
          </ecc-utils-design-table-body>
        </ecc-utils-design-table>

        ${!this.loading && this.objects.length > 0
          ? this.renderPagination()
          : ""}
      </div>
    `;
  }
}

export default ECCClientGa4ghDrsObjects;
