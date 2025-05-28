import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ServiceRegistryProvider,
  ExternalService,
  ServiceType,
} from "../../providers/sr-provider.js";
import { RestServiceRegistryProvider } from "../../API/rest-sr-provider.js";
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

  private renderSkeletonRows() {
    return html`
      <ecc-skeleton-row style="height: 2.5rem;"></ecc-skeleton-row>
      <ecc-skeleton-row style="height: 2.5rem;"></ecc-skeleton-row>
      <ecc-skeleton-row style="height: 2.5rem;"></ecc-skeleton-row>
      <ecc-skeleton-row style="height: 2.5rem;"></ecc-skeleton-row>
      <ecc-skeleton-row style="height: 2.5rem;"></ecc-skeleton-row>
    `;
  }

  private getServiceTypeVariant(
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
      <div class="w-full">
        ${this.error
          ? html`<div class="p-4 mb-4 text-red-700 bg-red-100 rounded">
              ${this.error}
            </div>`
          : ""}
        ${this.search
          ? html`
              <div class="mb-4">
                <ecc-input
                  label="Search Services"
                  placeholder="Search by name, id, type..."
                  @ecc-input-change=${this.handleSearch}
                  value=${this.searchQuery}
                ></ecc-input>
              </div>
            `
          : ""}

        <ecc-table>
          <ecc-table-header>
            <ecc-table-row>
              <ecc-table-head>ID</ecc-table-head>
              <ecc-table-head>Name</ecc-table-head>
              <ecc-table-head>Type</ecc-table-head>
              <ecc-table-head>Organization</ecc-table-head>
              <ecc-table-head>Actions</ecc-table-head>
            </ecc-table-row>
          </ecc-table-header>
          <ecc-table-body>
            ${this.loading
              ? this.renderSkeletonRows()
              : this.services.length === 0
              ? html`
                  <ecc-table-row>
                    <ecc-table-cell colspan="5" class="text-center py-4">
                      No services found
                    </ecc-table-cell>
                  </ecc-table-row>
                `
              : this.services.map(
                  (service) => html`
                    <ecc-table-row>
                      <ecc-table-cell> ${service.id} </ecc-table-cell>
                      <ecc-table-cell> ${service.name} </ecc-table-cell>
                      <ecc-table-cell>
                        <ecc-badge
                          variant=${this.getServiceTypeVariant(service.type)}
                        >
                          ${service.type.artifact}@${service.type.version}
                        </ecc-badge>
                      </ecc-table-cell>
                      <ecc-table-cell>
                        ${service.organization.name}
                      </ecc-table-cell>
                      <ecc-table-cell>
                        <ecc-button
                          size="sm"
                          variant="outline"
                          @click=${() => this.handleViewDetails(service.id)}
                        >
                          View Details
                        </ecc-button>
                      </ecc-table-cell>
                    </ecc-table-row>
                  `
                )}
          </ecc-table-body>
        </ecc-table>
      </div>
    `;
  }
}
