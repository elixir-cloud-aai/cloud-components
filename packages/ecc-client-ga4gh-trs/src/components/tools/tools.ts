import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  TrsProvider,
  Tool,
  ToolClass,
  DescriptorType,
} from "../../providers/trs-provider.js";
import { RestTrsProvider } from "../../providers/rest-trs-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/pagination/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";

/**
 * @summary This component is used to display data from Tool Registry Service API.
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the TRS instance/gateway
 * @property {number} pageSize - Number of tools per page
 * @property {boolean} filter - Determines if the tools filter field should be rendered
 * @property {boolean} search - Determines if the search field should be rendered
 * @property {TrsProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-tools-change - Fired when tools data changes
 * @fires ecc-tools-click - Fired when a tool is clicked
 */
export class ECCClientGa4ghTrsTools extends LitElement {
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
  @property({ type: Number, reflect: true }) pageSize = 5;
  @property({ type: Boolean, reflect: true }) filter = true;
  @property({ type: Boolean, reflect: true }) search = true;
  @property({ attribute: false, reflect: true }) provider?: TrsProvider;

  @state() private toolClasses: ToolClass[] = [];
  @state() private currentPage = 1;
  @state() private searchQuery = "";
  @state() private filterParams: {
    [key: string]: string | undefined | boolean;
  } = {
    id: "",
    alias: "",
    toolClass: "",
    descriptorType: "",
    registry: "",
    organization: "",
    name: "",
    description: "",
    author: "",
    checker: undefined,
    offset: "",
  };

  @state() private tools: Tool[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private toolClassMap: Record<string, string> = {};
  @state() private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  @state() private lastPage = -1;

  private _provider: TrsProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the TRS API or a custom provider.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestTrsProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider) {
      await this.loadData();
      await this.loadToolClasses();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("pageSize")) {
      this.loadData();
    }

    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this._provider = new RestTrsProvider(this.baseUrl);
      this.loadData();
      this.loadToolClasses();
    }
  }

  private async loadToolClasses(): Promise<void> {
    if (!this._provider) return;

    try {
      this.toolClasses = await this._provider.getToolClasses();

      // Store a mapping of name to ID for lookup during filtering
      this.toolClassMap = Object.fromEntries(
        this.toolClasses.map((tc) => [tc.name, tc.id])
      );
    } catch (error) {
      console.error("Failed to load tool classes:", error);
    }
  }

  private async loadData(): Promise<void> {
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      // Calculate offset based on current page
      const offset = (this.currentPage - 1) * this.pageSize;

      // Update offset in filter params
      this.filterParams.offset = String(offset);

      // Clone the filter params to avoid modifying the original
      const apiFilterParams = { ...this.filterParams };

      // We want to send the tool class name directly to the API, not the ID
      // No conversion needed here, the name is already stored in filterParams.toolClass

      const tools = await this._provider.getToolsList(
        this.pageSize < 0 ? 0 : this.pageSize,
        offset < 0 ? 0 : offset,
        apiFilterParams,
        this.searchQuery
      );

      this.tools = tools;

      // Emit an event with the updated tools
      this.dispatchEvent(
        new CustomEvent("ecc-tools-change", {
          detail: { tools },
          bubbles: true,
          composed: true,
        })
      );

      if (this.tools.length === 0) {
        this.lastPage = this.currentPage - 1;
      } else if (this.tools.length < this.pageSize) {
        this.lastPage = this.currentPage;
      }

      // Update UI based on returned items
      if (this.tools.length === 0 && this.currentPage > 1) {
        // If we get no results and we're not on the first page, go back a page
        this.currentPage -= 1;
        this.loadData();
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load tools";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghTrs.loadData",
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

  private handleFilter(key: string, e: CustomEvent): void {
    const { value } = e.detail;

    // Store the value directly, no conversion needed
    this.filterParams[key] = value;

    this.currentPage = 1; // Reset to first page on filter change
    this.lastPage = -1; // Reset lastPage when filter changes
    this.loadData();
  }

  private handleSelectChange(key: string, e: Event): void {
    const target = e.target as HTMLSelectElement;
    const { value } = target;

    // Store the selected value directly, no conversion needed
    this.filterParams[key] = value;

    this.currentPage = 1; // Reset to first page on filter change
    this.lastPage = -1; // Reset lastPage when filter changes
    this.loadData();
  }

  private handleViewDetails(toolId: string): void {
    // You can dispatch a custom event or implement navigation to a details page
    const event = new CustomEvent("ecc-tools-click", {
      detail: { toolId },
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

  private renderFilters() {
    if (!this.filter) return html``;

    return html`
      <div class="flex gap-3 items-end">
        <div class="flex flex-col gap-1">
          <ecc-utils-design-label>Tool Class</ecc-utils-design-label>
          <ecc-utils-design-select
            class="part:w-40"
            @ecc-utils-change=${(e: Event) =>
              this.handleSelectChange("toolClass", e)}
          >
            <ecc-utils-design-select-trigger>
              <ecc-utils-design-select-value
                placeholder="Select tool class"
              ></ecc-utils-design-select-value>
            </ecc-utils-design-select-trigger>
            <ecc-utils-design-select-content>
              <ecc-utils-design-select-item value=""
                >All</ecc-utils-design-select-item
              >
              ${this.toolClasses.map(
                (tc) =>
                  html`<ecc-utils-design-select-item value=${tc.name}
                    >${tc.name}</ecc-utils-design-select-item
                  >`
              )}
            </ecc-utils-design-select-content>
          </ecc-utils-design-select>
        </div>

        <div class="flex flex-col gap-1">
          <ecc-utils-design-label>Language</ecc-utils-design-label>
          <ecc-utils-design-select
            class="part:w-40"
            @ecc-utils-change=${(e: Event) =>
              this.handleSelectChange("descriptorType", e)}
          >
            <ecc-utils-design-select-trigger>
              <ecc-utils-design-select-value
                placeholder="Select language"
              ></ecc-utils-design-select-value>
            </ecc-utils-design-select-trigger>
            <ecc-utils-design-select-content>
              <ecc-utils-design-select-item value=""
                >All</ecc-utils-design-select-item
              >
              <ecc-utils-design-select-item value="CWL"
                >CWL</ecc-utils-design-select-item
              >
              <ecc-utils-design-select-item value="WDL"
                >WDL</ecc-utils-design-select-item
              >
              <ecc-utils-design-select-item value="NFL"
                >Nextflow</ecc-utils-design-select-item
              >
              <ecc-utils-design-select-item value="GALAXY"
                >Galaxy</ecc-utils-design-select-item
              >
              <ecc-utils-design-select-item value="SMK"
                >Snakemake</ecc-utils-design-select-item
              >
            </ecc-utils-design-select-content>
          </ecc-utils-design-select>
        </div>
      </div>
    `;
  }

  private renderPagination() {
    return html`
      <ecc-utils-design-pagination>
        <ecc-utils-design-pagination-content>
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-previous
              ?disabled=${this.currentPage === 1}
              @ecc-utils-button-click=${(e: CustomEvent) => {
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
                    @ecc-utils-button-click=${(e: CustomEvent) => {
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
                    @ecc-utils-button-click=${(e: CustomEvent) => {
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
                    @ecc-utils-button-click=${(e: CustomEvent) => {
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
                    @ecc-utils-button-click=${(e: CustomEvent) => {
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
                    @ecc-utils-button-click=${(e: CustomEvent) => {
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
              @ecc-utils-button-click=${(e: CustomEvent) => {
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

  static getToolClassVariant(
    toolClassName: string
  ): "default" | "secondary" | "destructive" | "outline" {
    // Map tool class names to badge variants
    const toolClassVariants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      Workflow: "default",
      Tool: "secondary",
      Service: "outline",
      CommandLineTool: "secondary",
    };

    return toolClassVariants[toolClassName] || "default";
  }

  /**
   * Extract unique descriptor types from all versions of a tool
   */
  static getToolDescriptorTypes(tool: Tool): DescriptorType[] {
    if (!tool.versions || tool.versions.length === 0) {
      return [];
    }

    // Get all descriptor types from all versions
    const descriptorTypes = new Set<DescriptorType>();
    tool.versions.forEach((version) => {
      if (version.descriptor_type && Array.isArray(version.descriptor_type)) {
        version.descriptor_type.forEach((type: DescriptorType) => {
          descriptorTypes.add(type);
        });
      }
    });

    return Array.from(descriptorTypes);
  }

  /**
   * Map descriptor type to badge variant and display name
   */
  static getDescriptorTypeInfo(type: DescriptorType): {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  } {
    // Map descriptor types to badge variants and display names
    const typeInfo: Record<
      DescriptorType,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      CWL: { variant: "secondary", label: "CWL" },
      WDL: { variant: "secondary", label: "WDL" },
      NFL: { variant: "secondary", label: "Nextflow" },
      GALAXY: { variant: "secondary", label: "Galaxy" },
      SMK: { variant: "secondary", label: "Snakemake" },
    };

    return typeInfo[type] || { variant: "secondary", label: type };
  }

  private renderSkeletonRows() {
    return html`
      ${Array(this.pageSize)
        .fill(0)
        .map(
          () => html`
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-cell class="w-7/12">
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
                <div class="flex gap-1">
                  <ecc-utils-design-skeleton
                    class="part:h-6 part:w-14 part:rounded-full"
                  ></ecc-utils-design-skeleton>
                </div>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-2/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-20"
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
   * Helper method to get author information from a tool
   */
  static getToolAuthor(tool: Tool): string | null {
    // Try to find author information in the newest version
    if (tool.versions && tool.versions.length > 0) {
      const latestVersion = tool.versions[0];
      if (latestVersion.author && latestVersion.author.length > 0) {
        return latestVersion.author.join(", ");
      }
    }
    return null;
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the TRS API or a custom provider.
        </div>
      `;
    }

    return html`
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-4 items-end">
          ${this.search
            ? html`
                <div class="flex-1 flex flex-col gap-1">
                  <ecc-utils-design-label>Search Tools</ecc-utils-design-label>
                  <div class="flex">
                    <ecc-utils-design-input
                      class="part:w-full w-full"
                      placeholder="Search by tool name..."
                      @ecc-utils-change=${this.handleSearch}
                    ></ecc-utils-design-input>
                  </div>
                </div>
              `
            : ""}
          ${this.filter ? this.renderFilters() : ""}
        </div>

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
              <ecc-utils-design-table-head class="w-7/12"
                >Tool Info</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Format</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Author</ecc-utils-design-table-head
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
              if (this.tools.length === 0) {
                return html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell
                      colspan="4"
                      class="part:text-center part:py-8 part:text-muted-foreground"
                    >
                      No tools found
                    </ecc-utils-design-table-cell>
                  </ecc-utils-design-table-row>
                `;
              }
              return this.tools.map(
                (tool) => html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell class="w-7/12">
                      <div class="flex flex-col w-full">
                        <!-- TODO: Replace with with ecc-utils-design-button -->
                        <ecc-utils-design-button
                          class="part:font-medium part:text-primary part:w-fit part:cursor-pointer part:p-0"
                          variant="link"
                          @click=${() => this.handleViewDetails(tool.id)}
                        >
                          ${tool.name || "-"}
                        </ecc-utils-design-button>
                        ${tool.description
                          ? html`<div
                              class="text-xs text-muted-foreground line-clamp-3 break-all whitespace-normal overflow-hidden max-w-full"
                            >
                              ${tool.description}
                            </div>`
                          : ""}
                      </div>
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-2/12">
                      <div class="flex flex-wrap gap-1">
                        ${ECCClientGa4ghTrsTools.getToolDescriptorTypes(
                          tool
                        ).map((type) => {
                          const info =
                            ECCClientGa4ghTrsTools.getDescriptorTypeInfo(type);
                          return html`
                            <ecc-utils-design-badge variant=${info.variant}>
                              ${info.label}
                            </ecc-utils-design-badge>
                          `;
                        })}
                        ${ECCClientGa4ghTrsTools.getToolDescriptorTypes(tool)
                          .length === 0
                          ? html`<span class="text-xs text-muted-foreground"
                              >No languages specified</span
                            >`
                          : ""}
                      </div>
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-2/12">
                      ${ECCClientGa4ghTrsTools.getToolAuthor(tool)
                        ? html`<span
                            >${ECCClientGa4ghTrsTools.getToolAuthor(tool)}</span
                          >`
                        : ""}
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-1/12">
                      <slot name=${`actions-${tool.id}`}>
                        <ecc-utils-design-button
                          size="sm"
                          @click=${() => this.handleViewDetails(tool.id)}
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

        ${!this.loading && this.tools.length > 0 ? this.renderPagination() : ""}
      </div>
    `;
  }
}

export default ECCClientGa4ghTrsTools;
