import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ServiceRegistryProvider,
  ExternalService,
} from "../../providers/sr-provider.js";
import { RestServiceRegistryProvider } from "../../API/rest-sr-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/card/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";

/**
 * @summary This component is used to display details for a single service from Service Registry API.
 * @since 1.0.0
 *
 * @property {string} baseUrl - Base URL of the Service Registry instance
 * @property {string} serviceId - ID of the service to display
 * @property {ServiceRegistryProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-service-change - Fired when service data changes
 */
export class ECCClientGa4ghServiceRegistryService extends LitElement {
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
  @property({ type: String, reflect: true }) serviceId = "";
  @property({ attribute: false, reflect: true })
  provider?: ServiceRegistryProvider;

  @state() private service: ExternalService | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private activeTab = 0;

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

    if (this._provider && this.serviceId) {
      await this.loadData();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      (changedProperties.has("baseUrl") && this.baseUrl) ||
      (changedProperties.has("serviceId") && this.serviceId)
    ) {
      if (this.baseUrl) {
        this._provider = new RestServiceRegistryProvider(this.baseUrl);
      }
      if (this.serviceId && this._provider) {
        this.loadData();
      }
    }
  }

  private async loadData(): Promise<void> {
    if (!this._provider || !this.serviceId) return;

    this.loading = true;
    this.error = null;

    try {
      const service = await this._provider.getServiceById(this.serviceId);
      this.service = service;

      // Emit an event with the updated service
      this.dispatchEvent(
        new CustomEvent("ecc-service-change", {
          detail: { service },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to load service";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghServiceRegistryService.loadData",
      });
    } finally {
      this.loading = false;
    }
  }

  private handleTabChange(index: number): void {
    this.activeTab = index;
  }

  private formatDate(dateString?: string): string {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  }

  private getTypeVariant(
    group: string
  ): "default" | "secondary" | "destructive" | "outline" {
    if (group.includes("ga4gh") || group.includes("elixir")) {
      return "secondary";
    }
    return "default";
  }

  private renderOverview() {
    if (!this.service) return html``;

    const {
      id,
      name,
      description,
      version,
      organization,
      contactUrl,
      documentationUrl,
      createdAt,
      updatedAt,
      environment,
    } = this.service;

    return html`
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-2">Service Information</h2>
          <ecc-card>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">ID</p>
                <p>${id}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Name</p>
                <p>${name}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Version</p>
                <p>${version}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Environment</p>
                <p>${environment || "Not specified"}</p>
              </div>
              <div class="col-span-1 md:col-span-2">
                <p class="text-sm font-medium text-gray-500">Description</p>
                <p>${description || "No description provided"}</p>
              </div>
            </div>
          </ecc-card>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-2">Organization</h2>
          <ecc-card>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Name</p>
                <p>${organization.name}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Website</p>
                <a
                  href="${organization.url}"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  ${organization.url}
                </a>
              </div>
            </div>
          </ecc-card>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-2">Additional Information</h2>
          <ecc-card>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${contactUrl
                ? html`
                    <div>
                      <p class="text-sm font-medium text-gray-500">Contact</p>
                      <a
                        href="${contactUrl}"
                        target="_blank"
                        class="text-blue-600 hover:underline"
                      >
                        ${contactUrl}
                      </a>
                    </div>
                  `
                : ""}
              ${documentationUrl
                ? html`
                    <div>
                      <p class="text-sm font-medium text-gray-500">
                        Documentation
                      </p>
                      <a
                        href="${documentationUrl}"
                        target="_blank"
                        class="text-blue-600 hover:underline"
                      >
                        ${documentationUrl}
                      </a>
                    </div>
                  `
                : ""}
              <div>
                <p class="text-sm font-medium text-gray-500">Created</p>
                <p>${this.formatDate(createdAt)}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Last Updated</p>
                <p>${this.formatDate(updatedAt)}</p>
              </div>
            </div>
          </ecc-card>
        </div>
      </div>
    `;
  }

  private renderTypeInfo() {
    if (!this.service || !this.service.type) return html``;

    const { type } = this.service;

    return html`
      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-2">Service Type</h2>
          <ecc-card>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Group</p>
                <p>
                  <ecc-badge variant=${this.getTypeVariant(type.group)}>
                    ${type.group}
                  </ecc-badge>
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Artifact</p>
                <p>${type.artifact}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Version</p>
                <p>${type.version}</p>
              </div>
            </div>
          </ecc-card>
        </div>

        <div>
          <h2 class="text-xl font-semibold mb-2">Service URL</h2>
          <ecc-card>
            <div>
              <p class="text-sm font-medium text-gray-500">Endpoint URL</p>
              <a
                href="${this.service.url}"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                ${this.service.url}
              </a>
              <p class="text-sm text-gray-500 mt-2">
                This is the base URL for all API endpoints of this service.
              </p>
            </div>
          </ecc-card>
        </div>
      </div>
    `;
  }

  private renderSkeleton() {
    return html`
      <div class="space-y-6">
        <ecc-skeleton-row style="height: 2rem;"></ecc-skeleton-row>
        <ecc-skeleton-row style="height: 10rem;"></ecc-skeleton-row>
        <ecc-skeleton-row style="height: 2rem;"></ecc-skeleton-row>
        <ecc-skeleton-row style="height: 6rem;"></ecc-skeleton-row>
        <ecc-skeleton-row style="height: 2rem;"></ecc-skeleton-row>
        <ecc-skeleton-row style="height: 8rem;"></ecc-skeleton-row>
      </div>
    `;
  }

  render() {
    return html`
      <div class="w-full">
        ${this.error
          ? html`<div class="p-4 mb-4 text-red-700 bg-red-100 rounded">
              ${this.error}
            </div>`
          : ""}
        ${this.loading
          ? this.renderSkeleton()
          : this.service
          ? html`
              <div class="mb-6">
                <h1 class="text-2xl font-bold">${this.service.name}</h1>
                <p class="text-gray-500">
                  ${this.service.description || "No description provided"}
                </p>
              </div>

              <ecc-tabs>
                <ecc-tabs-list>
                  <ecc-tabs-trigger
                    ?selected=${this.activeTab === 0}
                    @click=${() => this.handleTabChange(0)}
                  >
                    Overview
                  </ecc-tabs-trigger>
                  <ecc-tabs-trigger
                    ?selected=${this.activeTab === 1}
                    @click=${() => this.handleTabChange(1)}
                  >
                    Type & URL
                  </ecc-tabs-trigger>
                </ecc-tabs-list>
                <ecc-separator />
                <div class="py-4">
                  ${this.activeTab === 0
                    ? this.renderOverview()
                    : this.activeTab === 1
                    ? this.renderTypeInfo()
                    : ""}
                </div>
              </ecc-tabs>
            `
          : html`
              <div class="p-4 text-center text-gray-600">
                No service found with ID: ${this.serviceId}
              </div>
            `}
      </div>
    `;
  }
}

export default ECCClientGa4ghServiceRegistryService;
