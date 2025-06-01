import { LitElement, html, css } from "lit";
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
 * @summary This component is used to display data from Service Registry API.
 * @since 1.0.0
 *
 * @property {string} baseUrl - Base URL of the Service Registry instance
 * @property {boolean} filter - Determines if the service filter field should be rendered
 * @property {boolean} search - Determines if the search field should be rendered
 * @property {ServiceRegistryProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-services-change - Fired when services data changes
 * @fires ecc-service-click - Fired when a service is clicked
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
  @property({ attribute: false, reflect: true })
  provider?: ServiceRegistryProvider;

  @state() private searchQuery = "";
  @state() private services: ExternalService[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private serviceTypes: ServiceType[] = [];
  @state() private searchTimeout: ReturnType<typeof setTimeout> | null = null;

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
        new CustomEvent("ecc-services-change", {
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

  private handleSearch(e: CustomEvent): void {
    this.searchQuery = e.detail.value;

    // Clear any existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a new timeout for debouncing
    this.searchTimeout = setTimeout(() => {
      this.filterServices();
    }, 500);
  }

  private filterServices(): void {
    if (!this.searchQuery) {
      this.loadData();
      return;
    }

    const query = this.searchQuery.toLowerCase();
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      // For now, we'll just filter client-side
      // In a real implementation, you might want to do this on the server
      this._provider.getServices().then((services) => {
        this.services = services.filter(
          (service) =>
            service.id.toLowerCase().includes(query) ||
            service.name.toLowerCase().includes(query) ||
            service.description?.toLowerCase().includes(query) ||
            service.organization.name.toLowerCase().includes(query) ||
            service.type.group.toLowerCase().includes(query) ||
            service.type.artifact.toLowerCase().includes(query)
        );
        this.loading = false;
      });
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to filter services";
      this.loading = false;
    }
  }

  private handleViewDetails(serviceId: string): void {
    this.dispatchEvent(
      new CustomEvent("ecc-service-click", {
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

  render() {
    return html`
      <div class="flex flex-col gap-4">
        ${this.error
          ? html`<div
              class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
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
                  placeholder="Search by name, type, organization..."
                  @ecc-utils-change=${this.handleSearch}
                ></ecc-utils-design-input>
              </div>
            `
          : ""}

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
            ${(() => {
              if (this.loading) {
                return ECCClientGa4ghServiceRegistryServices.renderSkeletonRows();
              }
              if (this.services.length === 0) {
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
              return this.services.map(
                (service) => html`
                  <ecc-utils-design-table-row>
                    <ecc-utils-design-table-cell class="w-7/12">
                      <div class="flex flex-col w-full">
                        <div class="flex items-center gap-2">
                          <ecc-utils-design-button
                            class="part:font-medium part:text-primary part:w-fit part:cursor-pointer part:p-0"
                            variant="link"
                            @click=${() => this.handleViewDetails(service.id)}
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
                      ${service.organization.url
                        ? html`<ecc-utils-design-button
                            class="part:font-medium part:text-primary part:w-fit part:cursor-pointer part:p-0"
                            variant="link"
                            @click=${() =>
                              window.open(service.organization.url, "_blank")}
                          >
                            ${service.organization.name}
                          </ecc-utils-design-button>`
                        : html`${service.organization.name}`}
                    </ecc-utils-design-table-cell>
                    <ecc-utils-design-table-cell class="w-1/12">
                      <slot name=${`actions-${service.id}`}>
                        <ecc-utils-design-button
                          size="sm"
                          @click=${() => this.handleViewDetails(service.id)}
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
      </div>
    `;
  }
}
