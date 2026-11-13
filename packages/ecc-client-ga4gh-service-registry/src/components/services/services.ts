import { LitElement, html, css, TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ServiceRegistryProvider,
  ExternalService,
  ServiceType,
} from "../../providers/sr-provider.js";
import { RestServiceRegistryProvider } from "../../providers/rest-sr-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/pagination/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";

/**
 * Renders the actions of a row from its service: a Lit template, a DOM node,
 * a string, or nothing (`null` or `undefined`) for a row without actions.
 */
export type RowActionsRenderer = (
  service: ExternalService
) => TemplateResult | Node | string | null | undefined;

/** The selected values of the filters; empty for "All". */
interface ServiceFilters {
  type: string;
  organization: string;
  environment: string;
}

/** An option of a filter. */
interface FilterOption {
  value: string;
  label: string;
}

/** The options of each filter, besides "All". */
type FilterOptions = Record<keyof ServiceFilters, FilterOption[]>;

/**
 * The value of a service type in the type filter; JSON, so that no two
 * distinct types share one (as they could with a separator in their fields).
 */
const typeKey = (type: ServiceType): string =>
  JSON.stringify([type.group, type.artifact, type.version]);

/** Whether a URL from the registry is a web URL (`http:` or `https:`). */
const isWebUrl = (url: string | undefined): url is string => {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
};

/** Opens a web URL in a new tab, without access to this page. */
const openExternal = (url: string): void => {
  window.open(url, "_blank", "noopener,noreferrer");
};

/** The distinct, non-empty values, sorted. */
const uniqueSorted = (values: (string | undefined)[]): string[] =>
  [...new Set(values.filter((value): value is string => !!value))].sort(
    (a, b) => a.localeCompare(b)
  );

/**
 * @summary This component is used to display data from Service Registry API.
 * @since 1.0.0
 *
 * @property {string} baseUrl - Base URL of the Service Registry instance
 * @property {boolean} filter - Determines if the type, organization and environment filters should be rendered
 * @property {boolean} search - Determines if the search field should be rendered
 * @property {number} pageSize - Number of services per page (attribute `page-size`); 0 or less shows all services on one page
 * @property {ServiceRegistryProvider} provider - Custom data provider (optional, overrides baseUrl)
 * @property {RowActionsRenderer} rowActions - Renders the actions of each row (e.g. Edit and Delete buttons) from its service
 *
 * @slot actions-<id> - Actions of the row of the service with this ID, instead of those of `rowActions` or the "View Details" button
 *
 * @fires ecc-services-changed - Fired when services data changes
 * @fires ecc-service-selected - Fired when a service or its row is clicked
 */
export class ECCClientGa4ghServiceRegistryServices extends LitElement {
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
  @property({ type: Boolean, reflect: true }) filter = true;
  @property({ type: Boolean, reflect: true }) search = true;
  @property({ type: Number, attribute: "page-size", reflect: true })
  pageSize = 10;

  @property({ attribute: false, reflect: true })
  provider?: ServiceRegistryProvider;

  @property({ attribute: false }) rowActions?: RowActionsRenderer;

  @state() private searchQuery = "";
  @state() private services: ExternalService[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private serviceTypes: ServiceType[] = [];
  @state() private filters: ServiceFilters = {
    type: "",
    organization: "",
    environment: "",
  };

  @state() private currentPage = 1;

  /** Derived from the services and types in `willUpdate`. */
  private filterOptions: FilterOptions = {
    type: [],
    organization: [],
    environment: [],
  };

  private _provider: ServiceRegistryProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the Service Registry API or a custom provider.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestServiceRegistryProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider) {
      await this.loadData();
      await this.loadServiceTypes();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this._provider = new RestServiceRegistryProvider(this.baseUrl);
      this.loadData();
      this.loadServiceTypes();
    }
  }

  private async loadServiceTypes(): Promise<void> {
    if (!this._provider) return;

    try {
      this.serviceTypes = await this._provider.getServiceTypes();
    } catch (error) {
      console.error("Failed to load service types:", error);
    }
  }

  private async loadData(): Promise<void> {
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      const services = await this._provider.getServices();
      this.services = services;

      // Emit an event with the updated services
      this.dispatchEvent(
        new CustomEvent("ecc-services-changed", {
          detail: { services },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to load services";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghServiceRegistryServices.loadData",
      });
    } finally {
      this.loading = false;
    }
  }

  private handleSearch(e: CustomEvent<{ value?: string }>): void {
    this.searchQuery = e.detail.value ?? "";
    this.currentPage = 1;
  }

  private handleFilterChange(key: keyof ServiceFilters, e: Event): void {
    const { value } = (e as CustomEvent<{ value?: string }>).detail;
    this.filters = { ...this.filters, [key]: value ?? "" };
    this.currentPage = 1;
  }

  protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      changedProperties.has("services") ||
      changedProperties.has("serviceTypes")
    ) {
      this.filterOptions = this.computeFilterOptions();
    }
  }

  /**
   * The options of each filter: the registry's types (or else those of the
   * services), and the organizations and environments of the services.
   */
  private computeFilterOptions(): FilterOptions {
    const types = this.serviceTypes.length
      ? this.serviceTypes
      : this.services.map((service) => service.type);
    const uniqueTypes = [
      ...new Map(types.map((type) => [typeKey(type), type])).values(),
    ];
    const asOptions = (values: string[]) =>
      values.map((value) => ({ value, label: value }));
    return {
      type: uniqueTypes.map((type) => ({
        value: typeKey(type),
        label: `${type.artifact}@${type.version} (${type.group})`,
      })),
      organization: asOptions(
        uniqueSorted(this.services.map((service) => service.organization.name))
      ),
      environment: asOptions(
        uniqueSorted(this.services.map((service) => service.environment))
      ),
    };
  }

  /**
   * The value of a filter that applies: only filters on display with a value
   * among their options do, so that the list never narrows invisibly.
   */
  private activeFilter(key: keyof ServiceFilters): string {
    const value = this.filters[key];
    return this.filter &&
      this.filterOptions[key].some((option) => option.value === value)
      ? value
      : "";
  }

  /** The loaded services that match the search query and the filters. */
  private filterServices(): ExternalService[] {
    const query = this.search ? this.searchQuery.trim().toLowerCase() : "";
    const type = this.activeFilter("type");
    const organization = this.activeFilter("organization");
    const environment = this.activeFilter("environment");
    return this.services.filter(
      (service) =>
        (!type || typeKey(service.type) === type) &&
        (!organization || service.organization.name === organization) &&
        (!environment || service.environment === environment) &&
        (!query ||
          [
            service.id,
            service.name,
            service.description,
            service.url,
            service.organization.name,
            service.type.group,
            service.type.artifact,
            service.type.version,
          ].some((field) => field?.toLowerCase().includes(query)))
    );
  }

  /**
   * The number of services per page, as a whole number, or 0 for all on one
   * page (for 0, negative and invalid values, such as a malformed attribute).
   */
  private get effectivePageSize(): number {
    const size = Math.floor(this.pageSize);
    return Number.isFinite(size) && size >= 1 ? size : 0;
  }

  private pageCount(total: number): number {
    const size = this.effectivePageSize;
    if (!size) return 1;
    return Math.max(1, Math.ceil(total / size));
  }

  private goToPage(page: number, pageCount: number): void {
    this.currentPage = Math.min(Math.max(page, 1), pageCount);
  }

  private handleRowClick(e: MouseEvent, serviceId: string): void {
    // Clicks on the actions of a row (slotted content included) and on the
    // organization link are theirs, not the row's
    const ownClick = e
      .composedPath()
      .some(
        (node) =>
          node instanceof HTMLElement && node.hasAttribute("data-no-select")
      );
    if (!ownClick) this.handleViewDetails(serviceId);
  }

  private handleViewDetails(serviceId: string): void {
    this.dispatchEvent(
      new CustomEvent("ecc-service-selected", {
        detail: { serviceId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private static renderSkeletonRows() {
    return html`
      ${Array(5)
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
                <ecc-utils-design-skeleton
                  class="part:h-6 part:w-24 part:rounded-full"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-2/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-28"
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

  private static getServiceTypeVariant(
    type: ServiceType
  ): "default" | "secondary" | "destructive" | "outline" {
    // Default variation based on service type
    if (type.group.includes("ga4gh") || type.group.includes("elixir")) {
      return "secondary"; // Highlight GA4GH or ELIXIR services
    }
    return "default"; // Default style for other services
  }

  private renderFilterSelect(
    key: keyof ServiceFilters,
    label: string,
    options: FilterOption[]
  ) {
    return html`
      <div class="flex flex-col gap-1">
        <ecc-utils-design-label>${label}</ecc-utils-design-label>
        <ecc-utils-design-select
          class="part:w-48"
          data-filter=${key}
          .value=${this.filters[key]}
          @ecc-input-changed=${(e: Event) => this.handleFilterChange(key, e)}
        >
          <ecc-utils-design-select-trigger>
            <ecc-utils-design-select-value
              placeholder="All"
            ></ecc-utils-design-select-value>
          </ecc-utils-design-select-trigger>
          <ecc-utils-design-select-content>
            <ecc-utils-design-select-item value=""
              >All</ecc-utils-design-select-item
            >
            ${options.map(
              (option) =>
                html`<ecc-utils-design-select-item value=${option.value}
                  >${option.label}</ecc-utils-design-select-item
                >`
            )}
          </ecc-utils-design-select-content>
        </ecc-utils-design-select>
      </div>
    `;
  }

  private renderFilters() {
    if (!this.filter) return "";

    const options = this.filterOptions;
    return html`
      <div class="flex flex-wrap gap-3 items-end">
        ${this.renderFilterSelect("type", "Type", options.type)}
        ${this.renderFilterSelect(
          "organization",
          "Organization",
          options.organization
        )}
        ${options.environment.length
          ? this.renderFilterSelect(
              "environment",
              "Environment",
              options.environment
            )
          : ""}
      </div>
    `;
  }

  private renderPageLink(page: number, current: number, pageCount: number) {
    return html`
      <ecc-utils-design-pagination-item>
        <ecc-utils-design-pagination-link
          data-page=${page}
          ?isActive=${page === current}
          @ecc-button-clicked=${(e: CustomEvent) => {
            if (e.detail.variant === "link") this.goToPage(page, pageCount);
          }}
          >${page}</ecc-utils-design-pagination-link
        >
      </ecc-utils-design-pagination-item>
    `;
  }

  private static renderEllipsis() {
    return html`
      <ecc-utils-design-pagination-item>
        <ecc-utils-design-pagination-ellipsis></ecc-utils-design-pagination-ellipsis>
      </ecc-utils-design-pagination-item>
    `;
  }

  /** Previous, the first, last and nearby pages, and next. */
  private renderPagination(current: number, pageCount: number) {
    if (pageCount <= 1) return "";

    const nearby = [current - 1, current, current + 1].filter(
      (page) => page > 1 && page < pageCount
    );
    const pages = [1, ...nearby, pageCount];
    return html`
      <ecc-utils-design-pagination>
        <ecc-utils-design-pagination-content>
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-previous
              ?disabled=${current === 1}
              @ecc-button-clicked=${(e: CustomEvent) => {
                if (e.detail.variant === "previous") {
                  this.goToPage(current - 1, pageCount);
                }
              }}
            ></ecc-utils-design-pagination-previous>
          </ecc-utils-design-pagination-item>
          ${pages.map(
            (page, i) => html`
              ${i > 0 && page - pages[i - 1] > 1
                ? ECCClientGa4ghServiceRegistryServices.renderEllipsis()
                : ""}
              ${this.renderPageLink(page, current, pageCount)}
            `
          )}
          <ecc-utils-design-pagination-item>
            <ecc-utils-design-pagination-next
              ?disabled=${current === pageCount}
              @ecc-button-clicked=${(e: CustomEvent) => {
                if (e.detail.variant === "next") {
                  this.goToPage(current + 1, pageCount);
                }
              }}
            ></ecc-utils-design-pagination-next>
          </ecc-utils-design-pagination-item>
        </ecc-utils-design-pagination-content>
      </ecc-utils-design-pagination>
    `;
  }

  private renderActions(service: ExternalService) {
    return this.rowActions
      ? this.rowActions(service)
      : html`<ecc-utils-design-button
          size="sm"
          @click=${() => this.handleViewDetails(service.id)}
        >
          View Details
        </ecc-utils-design-button>`;
  }

  private renderRow(service: ExternalService) {
    return html`
      <ecc-utils-design-table-row
        class="cursor-pointer"
        data-service-id=${service.id}
        @click=${(e: MouseEvent) => this.handleRowClick(e, service.id)}
      >
        <ecc-utils-design-table-cell class="w-7/12">
          <div class="flex flex-col w-full">
            <div class="flex items-center gap-2">
              <ecc-utils-design-button
                class="part:font-medium part:text-primary part:w-fit part:cursor-pointer part:p-0"
                variant="link"
              >
                ${service.name || "-"}
              </ecc-utils-design-button>
              ${service.version
                ? html`<ecc-utils-design-badge variant="outline">
                    v${service.version}
                  </ecc-utils-design-badge>`
                : ""}
            </div>
            ${service.description
              ? html`<div
                  class="text-xs text-muted-foreground line-clamp-3 break-all whitespace-normal overflow-hidden max-w-full"
                >
                  ${service.description}
                </div>`
              : ""}
          </div>
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-2/12">
          <ecc-utils-design-badge
            variant=${ECCClientGa4ghServiceRegistryServices.getServiceTypeVariant(
              service.type
            )}
          >
            ${service.type.artifact}@${service.type.version}
          </ecc-utils-design-badge>
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-2/12">
          ${isWebUrl(service.organization.url)
            ? html`<ecc-utils-design-button
                class="part:font-medium part:text-primary part:w-fit part:cursor-pointer part:p-0"
                variant="link"
                data-no-select
                @click=${() => openExternal(service.organization.url)}
              >
                ${service.organization.name}
              </ecc-utils-design-button>`
            : html`${service.organization.name}`}
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-1/12" data-no-select>
          <slot name=${`actions-${service.id}`}
            >${this.renderActions(service)}</slot
          >
        </ecc-utils-design-table-cell>
      </ecc-utils-design-table-row>
    `;
  }

  private renderRows(services: ExternalService[]) {
    if (this.loading) {
      return ECCClientGa4ghServiceRegistryServices.renderSkeletonRows();
    }
    if (services.length === 0) {
      return html`
        <ecc-utils-design-table-row>
          <ecc-utils-design-table-cell
            colspan="4"
            class="part:text-center part:py-8 part:text-muted-foreground"
          >
            No services found
          </ecc-utils-design-table-cell>
        </ecc-utils-design-table-row>
      `;
    }
    return services.map((service) => this.renderRow(service));
  }

  render() {
    const filtered = this.filterServices();
    const size = this.effectivePageSize;
    const pageCount = this.pageCount(filtered.length);
    // The page may be past the end after the list or the page size changed
    const page = Math.min(this.currentPage, pageCount);
    const shown = size
      ? filtered.slice((page - 1) * size, page * size)
      : filtered;

    return html`
      <div class="flex flex-col gap-4">
        ${this.error
          ? html`<div
              class="p-4 border border-destructive rounded-md text-destructive bg-destructive/10"
            >
              ${this.error}
            </div>`
          : ""}
        ${this.search
          ? html`
              <div class="flex flex-col gap-1">
                <ecc-utils-design-label>Search Services</ecc-utils-design-label>
                <ecc-utils-design-input
                  class="part:w-full"
                  data-search
                  .value=${this.searchQuery}
                  placeholder="Search by name, type, organization, URL..."
                  @ecc-input-changed=${this.handleSearch}
                ></ecc-utils-design-input>
              </div>
            `
          : ""}
        ${this.renderFilters()}

        <ecc-utils-design-table>
          <ecc-utils-design-table-header>
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-head class="w-7/12"
                >Service Info</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Type</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Organization</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head
                class="w-1/12"
              ></ecc-utils-design-table-head>
            </ecc-utils-design-table-row>
          </ecc-utils-design-table-header>
          <ecc-utils-design-table-body>
            ${this.renderRows(shown)}
          </ecc-utils-design-table-body>
        </ecc-utils-design-table>
        ${this.loading ? "" : this.renderPagination(page, pageCount)}
      </div>
    `;
  }
}
