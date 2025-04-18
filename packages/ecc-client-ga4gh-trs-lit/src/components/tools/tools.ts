import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import EccUtilsDesignCollection, {
  FilterProp,
  ItemProp,
} from "@elixir-cloud/design/dist/components/collection/index.js";
import { Field } from "@elixir-cloud/design/dist/components/details/index.js";
import { TrsAPI } from "../../API/trs-api.js";

/**
 * Tool class interface
 */
interface ToolClass {
  id: string;
  name: string;
  description: string;
}

/**
 * @summary This component is used to display data from Tool Registry Service API.
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the TRS instance/gateway
 * @property {number} pageSize - Number of tools per page
 * @property {boolean} filter - Determines if the tools filter field should be rendered
 * @property {boolean} search - Determines if the search field should be rendered
 */
export default class ECCClientGa4ghTrsTools extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .error {
      color: red;
      padding: 1rem;
      border: 1px solid red;
      border-radius: 4px;
      margin: 1rem 0;
    }
  `;

  static defaultFields: Field[] = [
    {
      key: "id",
      path: "id",
      tab: "Overview",
      label: "ID",
      copy: true,
    },
    {
      key: "name",
      path: "name",
      tab: "Overview",
      label: "Name",
      copy: true,
    },
    {
      key: "description",
      path: "description",
      tab: "Overview",
      label: "Description",
    },
    {
      key: "organization",
      path: "organization",
      tab: "Overview",
      label: "Organization",
    },
    {
      key: "toolclass.name",
      path: "toolclass.name",
      tab: "Overview",
      label: "Tool Class",
    },
    {
      key: "meta_version",
      path: "meta_version",
      tab: "Overview",
      label: "Meta Version",
    },
    {
      key: "author",
      path: "author",
      tab: "Overview",
      label: "Author",
    },
    {
      key: "url",
      path: "url",
      tab: "Overview",
      label: "URL",
      copy: true,
    },
    {
      key: "verified",
      path: "verified",
      tab: "Overview",
      label: "Verified",
    },
    {
      key: "verified_source",
      path: "verified_source",
      tab: "Overview",
      label: "Verified Source",
    },
    {
      key: "aliases",
      path: "aliases",
      tab: "Overview",
      label: "Aliases",
      arrayOptions: {
        type: "tag",
      },
    },
    {
      key: "versions",
      path: "versions",
      tab: "Versions",
      label: "Versions",
    },
    {
      key: "versions[*]",
      path: "versions[*]",
      tab: "Versions",
      arrayOptions: {
        labelOptions: {
          path: "name",
          prefix: "Version: ",
        },
      },
    },
    {
      key: "versions[*].id",
      path: "versions[*].id",
      label: "ID",
      copy: true,
    },
    {
      key: "versions[*].name",
      path: "versions[*].name",
      label: "Name",
    },
    {
      key: "versions[*].url",
      path: "versions[*].url",
      label: "URL",
      copy: true,
    },
    {
      key: "versions[*].descriptor_type",
      path: "versions[*].descriptor_type",
      label: "Descriptor Type",
    },
    {
      key: "versions[*].meta_version",
      path: "versions[*].meta_version",
      label: "Meta Version",
    },
    {
      key: "versions[*].verified",
      path: "versions[*].verified",
      label: "Verified",
    },
    {
      key: "versions[*].verified_source",
      path: "versions[*].verified_source",
      label: "Verified Source",
    },
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ type: Number, reflect: true }) pageSize = 5;
  @property({ type: Boolean, reflect: true }) filter = true;
  @property({ type: Boolean, reflect: true }) search = true;

  @state() private toolClasses: ToolClass[] = [];
  @state() private currentPage = 1;
  @state() private pageCount = 1;
  @state() private searchQuery = "";
  @state() private isOpenFilter = false;
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

  @state() private filters: FilterProp[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search by name",
    },
  ];

  @state() private tools: any[] = [];
  @state() private items: ItemProp[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private ready = false;
  @state() private cache = new Map();

  @state() private toolClassMap: Record<string, string> = {};

  private api: TrsAPI | null = null;

  protected async firstUpdated(): Promise<void> {
    if (this.baseUrl) {
      this.api = new TrsAPI(this.baseUrl);
      await this.loadData();
      await this.loadToolClasses();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    const eccUtilsDesignCollection = this.getCollectionElement();
    if (!eccUtilsDesignCollection) return;

    eccUtilsDesignCollection.pageSize = this.pageSize;

    if (changedProperties.has("pageSize")) {
      this.loadData();
    }

    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this.api = new TrsAPI(this.baseUrl);
      this.loadData();
      this.loadToolClasses();
    }
  }

  private getCollectionElement(): EccUtilsDesignCollection | null {
    const element = this.shadowRoot?.querySelector<EccUtilsDesignCollection>(
      "ecc-utils-design-collection"
    );

    if (!element) {
      console.error({
        error: "ecc-utils-design-collection not found",
        breakPoint: "ECCClientGa4ghTrs.getCollectionElement",
      });
      return null;
    }

    return element;
  }

  private async loadToolClasses(): Promise<void> {
    if (!this.api) return;

    try {
      this.toolClasses = await this.api.getToolClasses();
      this.updateFilters();
    } catch (error) {
      console.error("Failed to load tool classes:", error);
    }
  }

  private updateFilters(): void {
    const filters: FilterProp[] = [];

    if (this.search) {
      filters.push({
        key: "search",
        type: "search",
        placeholder: "Search by name",
      });

      // Add all additional filter options
      if (this.filter) {
        // ID filter
        filters.push({
          key: "id",
          type: "search",
          placeholder: "Filter by Tool ID",
        });

        // Alias filter
        filters.push({
          key: "alias",
          type: "search",
          placeholder: "Filter by Alias",
        });

        // Registry filter
        filters.push({
          key: "registry",
          type: "search",
          placeholder: "Filter by Registry",
        });

        // Organization filter
        filters.push({
          key: "organization",
          type: "search",
          placeholder: "Filter by Organization",
        });

        // Name filter
        filters.push({
          key: "name",
          type: "search",
          placeholder: "Filter by Name",
        });

        // Description filter
        filters.push({
          key: "description",
          type: "search",
          placeholder: "Filter by Description",
        });

        // Author filter
        filters.push({
          key: "author",
          type: "search",
          placeholder: "Filter by Author",
        });
      }
    }

    if (this.filter && this.toolClasses.length > 0) {
      // Store a mapping of name to ID for lookup during filtering
      this.toolClassMap = Object.fromEntries(
        this.toolClasses.map((tc) => [tc.name, tc.id])
      );

      // Use names for display in the dropdown
      const toolClassOptions = this.toolClasses.map((tc) => tc.name);

      filters.push({
        key: "toolClass",
        type: "select",
        options: toolClassOptions,
        placeholder: "Filter by tool class",
        selectConfig: {
          multiple: false,
        },
      });
    }

    this.filters = filters;
  }

  private async loadData(): Promise<void> {
    if (!this.api) return;

    this.loading = true;
    this.error = null;

    try {
      // Calculate offset based on current page
      const offset = (this.currentPage - 1) * this.pageSize;

      // Update offset in filter params
      this.filterParams.offset = String(offset);

      const tools = await this.api.getToolsList(
        this.pageSize,
        offset,
        this.filterParams,
        this.searchQuery
      );

      this.tools = tools;

      // Don't calculate pageCount as we don't know the total count from API
      // Instead, we'll use dynamic pagination in the collection

      // Convert to collection items format
      this.items = this.tools.map((tool: any, index: number) => ({
        index: index + offset + 1, // Adjust index based on offset
        name: tool.name || tool.id,
        key: tool.id,
        description: tool.description || "No description available",
        lazy: true,
        metadata: {
          organization: tool.organization || "-",
          toolClass: tool.toolclass?.name || "-",
        },
      }));

      const eccUtilsDesignCollection = this.getCollectionElement();
      if (eccUtilsDesignCollection) {
        // Don't set totalItems to enable dynamic pagination
        // This will allow the collection to show "..." and enable next page button
        // as long as there are items returned

        // Update UI based on returned items
        if (this.items.length === 0 && this.currentPage > 1) {
          // If we get no results and we're not on the first page, go back a page
          this.currentPage--;
          this.loadData();
          return;
        }
      }

      this.ready = true;
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

  private async _handleExpandItem(event: CustomEvent): Promise<void> {
    const eccUtilsDesignCollection = this.getCollectionElement();
    if (!eccUtilsDesignCollection) return;

    const { target, detail } = event;

    if (!target || !(target instanceof HTMLElement)) {
      console.error("Target is null or not an HTMLElement");
      return;
    }

    const { key } = detail;

    // Check if we already have content in this slot
    const existingContent = target.querySelector(`[slot='${key}']`);
    if (existingContent) {
      console.log("Content already exists in slot:", key);
      return; // Content already exists, no need to add it again
    }

    if (!this.api) return;

    try {
      // Get tool details
      const toolData = this.tools.find((tool: any) => tool.id === key);

      // If we don't have detailed data, use the basic data we already have
      if (!toolData) {
        console.error(`Failed to find tool with ID: ${key}`);
        return;
      }

      // Cache the data
      this.cache.set(key, toolData);

      // Create container
      const child = document.createElement("div");
      child.setAttribute("slot", key);

      // Make sure to append the child before rendering to it
      target.appendChild(child);

      // Render the details component
      const detailsComponent = document.createElement(
        "ecc-utils-design-details"
      );
      detailsComponent.classList.add("details");
      detailsComponent.id = key;
      detailsComponent.data = toolData;
      detailsComponent.fields = ECCClientGa4ghTrsTools.defaultFields;

      // Add the details component to the child
      child.appendChild(detailsComponent);

      console.log("Added details component for:", key);
    } catch (error) {
      console.error(`Failed to process data for tool: ${key}`, error);
    }
  }

  private handleFilter(event: CustomEvent): void {
    const { key, value } = event.detail;

    if (key === "search") {
      this.searchQuery = value;
    } else if (key === "toolClass") {
      // Convert the selected name back to ID for the API
      this.filterParams.toolClass = this.toolClassMap[value] || value;
    } else {
      // Handle all other filter parameters
      this.filterParams[key] = value;
    }

    this.loadData();
  }

  private handlePageChange(event: CustomEvent): void {
    const { page } = event.detail;
    this.currentPage = page;

    // Load data for the new page from the server
    this.loadData();
  }

  render() {
    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }

    return html`
      <ecc-utils-design-collection
        id="collection"
        .items=${this.items}
        .filters=${this.filters}
        .loading=${this.loading}
        @ecc-utils-expand=${(event: CustomEvent) => {
          if (!this.cache.has(event.detail.key)) {
            this._handleExpandItem(event);
          }
        }}
        @ecc-utils-filter=${(event: CustomEvent) => {
          this.handleFilter(event);
        }}
        @ecc-utils-page-change=${(event: CustomEvent) => {
          this.handlePageChange(event);
        }}
      >
      </ecc-utils-design-collection>
    `;
  }
}
