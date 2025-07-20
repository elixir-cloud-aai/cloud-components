import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ServiceRegistryProvider,
  ExternalService,
} from "../../providers/sr-provider.js";
import { RestServiceRegistryProvider } from "../../providers/rest-sr-provider.js";
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
 * @fires ecc-service-changed - Fired when service data changes
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

  private _provider: ServiceRegistryProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the Service Registry API or a custom provider.";
      return;
    }

    if (!this.serviceId) {
      this.error = "Please provide a service ID.";
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

      // Emit an event with the updated service data
      this.dispatchEvent(
        new CustomEvent("ecc-service-changed", {
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

  private static formatDate(dateString?: string): string {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  }

  private static getTypeVariant(
    group: string
  ): "default" | "secondary" | "destructive" | "outline" {
    if (group.includes("ga4gh") || group.includes("elixir")) {
      return "secondary";
    }
    return "default";
  }

  private renderServiceHeader() {
    if (!this.service) return html``;

    return html`
      <div class="mb-6">
        <div class="w-full flex flex-col gap-2">
          <div
            class="flex flex-col md:flex-row md:items-center gap-2 justify-between"
          >
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <h2 class="text-xl truncate">
                ${this.service.name || this.service.id}
              </h2>
              ${this.service.version
                ? html`<ecc-utils-design-badge variant="outline">
                    v${this.service.version}
                  </ecc-utils-design-badge>`
                : ""}
            </div>
            ${this.service.contactUrl
              ? html`
                  <a
                    href="${this.service.contactUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:text-primary/80 flex items-center gap-1"
                    title="Contact"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-mail-icon lucide-mail"
                    >
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </a>
                `
              : ""}
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            <ecc-utils-design-badge
              variant=${ECCClientGa4ghServiceRegistryService.getTypeVariant(
                this.service.type.group
              )}
            >
              ${this.service.type.artifact}@${this.service.type.version}
            </ecc-utils-design-badge>
            ${this.service.environment
              ? html`<ecc-utils-design-badge variant="outline">
                  ${this.service.environment}
                </ecc-utils-design-badge>`
              : ""}
          </div>
        </div>
      </div>
    `;
  }

  private renderServiceContent() {
    if (!this.service) return html``;

    const { type } = this.service;

    return html`
      <div class="mt-4">
        <div class="flex flex-col gap-4 text-sm">
          <!-- Service Information Section -->
          <div class="flex flex-col gap-2">
            <div class="font-bold text-base">Service Information</div>
            <div class="flex flex-col gap-3">
              ${this.service.description
                ? html`
                    <div>
                      ${this.service.description
                        .split("\n")
                        .map((line) => html`<p>${line}</p>`)}
                    </div>
                  `
                : ""}
              <div>
                <dl class="flex flex-col gap-2">
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">ID</dt>
                    <dd class="font-mono">${this.service.id}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Version</dt>
                    <dd>${this.service.version || "Not specified"}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Organization</dt>
                    <dd>
                      ${this.service.organization.url
                        ? html`
                            <a
                              href="${this.service.organization.url}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-primary hover:underline flex items-center gap-1"
                            >
                              ${this.service.organization.name}
                              <svg
                                class="w-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              >
                                <path d="M13 5H19V11" />
                                <path d="M19 5L5 19" />
                              </svg>
                            </a>
                          `
                        : html`${this.service.organization.name}`}
                    </dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Environment</dt>
                    <dd>${this.service.environment || "Not specified"}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Service URL</dt>
                    <dd>
                      <a
                        href="${this.service.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline break-all"
                      >
                        ${this.service.url}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <ecc-utils-design-separator></ecc-utils-design-separator>

          <!-- Service Type Section -->
          <div class="flex flex-col gap-2">
            <div class="font-bold text-base">Service Type</div>
            <div class="flex flex-col gap-3">
              <div>
                <dl class="flex flex-col gap-2">
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Group</dt>
                    <dd>
                      <ecc-utils-design-badge
                        variant=${ECCClientGa4ghServiceRegistryService.getTypeVariant(
                          type.group
                        )}
                      >
                        ${type.group}
                      </ecc-utils-design-badge>
                    </dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Artifact</dt>
                    <dd>${type.artifact}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Type Version</dt>
                    <dd>${type.version}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <ecc-utils-design-separator></ecc-utils-design-separator>

          <!-- Additional Information Section -->
          ${this.service.documentationUrl ||
          this.service.createdAt ||
          this.service.updatedAt
            ? html`
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex flex-col gap-2">
                  <div class="font-bold text-base">Additional Information</div>
                  <div>
                    <dl class="flex flex-col gap-2">
                      ${this.service.documentationUrl
                        ? html`
                            <div
                              class="flex flex-row gap-2 w-full justify-between"
                            >
                              <dt class="text-muted-foreground">
                                Documentation
                              </dt>
                              <dd>
                                <a
                                  href="${this.service.documentationUrl}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="text-primary hover:underline break-all"
                                >
                                  ${this.service.documentationUrl}
                                </a>
                              </dd>
                            </div>
                            <ecc-utils-design-separator></ecc-utils-design-separator>
                          `
                        : ""}
                      ${this.service.createdAt
                        ? html`
                            <div
                              class="flex flex-row gap-2 w-full justify-between"
                            >
                              <dt class="text-muted-foreground">Created</dt>
                              <dd>
                                ${ECCClientGa4ghServiceRegistryService.formatDate(
                                  this.service.createdAt
                                )}
                              </dd>
                            </div>
                            <ecc-utils-design-separator></ecc-utils-design-separator>
                          `
                        : ""}
                      ${this.service.updatedAt
                        ? html`
                            <div
                              class="flex flex-row gap-2 w-full justify-between"
                            >
                              <dt class="text-muted-foreground">
                                Last Updated
                              </dt>
                              <dd>
                                ${ECCClientGa4ghServiceRegistryService.formatDate(
                                  this.service.updatedAt
                                )}
                              </dd>
                            </div>
                          `
                        : ""}
                    </dl>
                  </div>
                </div>
              `
            : ""}
        </div>
      </div>
    `;
  }

  static renderLoading() {
    return html`
      <div class="space-y-6">
        <!-- Service header skeleton -->
        <div class="mb-6">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <ecc-utils-design-skeleton
                class="part:h-10 part:w-64"
              ></ecc-utils-design-skeleton>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-20"
              ></ecc-utils-design-skeleton>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-32"
              ></ecc-utils-design-skeleton>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-20"
              ></ecc-utils-design-skeleton>
            </div>
          </div>
        </div>

        <!-- Content skeleton -->
        <div class="mt-4">
          <div class="flex flex-col gap-4">
            <div>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-48 part:mb-3"
              ></ecc-utils-design-skeleton>
              <div class="flex flex-col gap-3">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-full"
                ></ecc-utils-design-skeleton>
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-full"
                ></ecc-utils-design-skeleton>
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-3/4"
                ></ecc-utils-design-skeleton>
              </div>
            </div>

            <ecc-utils-design-separator></ecc-utils-design-separator>

            <div>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-32 part:mb-3"
              ></ecc-utils-design-skeleton>
              <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-24"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-32"
                  ></ecc-utils-design-skeleton>
                </div>
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex justify-between">
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-20"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-40"
                  ></ecc-utils-design-skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the Service Registry API or a
          custom provider.
        </div>
      `;
    }

    if (!this.serviceId) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide a service ID.
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          ${this.error}
        </div>
      `;
    }

    if (this.loading || !this.service) {
      return ECCClientGa4ghServiceRegistryService.renderLoading();
    }

    return html`
      <div class="space-y-4">
        ${this.renderServiceHeader()} ${this.renderServiceContent()}
      </div>
    `;
  }
}

export default ECCClientGa4ghServiceRegistryService;
