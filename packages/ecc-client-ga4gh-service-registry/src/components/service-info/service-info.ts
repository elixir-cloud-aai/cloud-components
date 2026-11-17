import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ServiceRegistryProvider,
  Service,
} from "../../providers/sr-provider.js";
import { RestServiceRegistryProvider } from "../../providers/rest-sr-provider.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/separator/index.js";

const MISSING_PROVIDER =
  "Please provide either a base URL for the Service Registry API or a custom provider.";

/**
 * The URL if it uses one of the protocols, or `null` (e.g. for a missing,
 * relative or `javascript:` URL), so that no dead or unsafe links render.
 */
const linkable = (
  url: string | undefined,
  protocols: string[]
): string | null => {
  if (!url) return null;
  try {
    return protocols.includes(new URL(url).protocol) ? url : null;
  } catch {
    return null;
  }
};

const WEB = ["http:", "https:"];

/** A timestamp in the reader's locale, or `null` if it isn't a valid date. */
const formatDate = (value: string | undefined): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleString();
};

/**
 * @summary This component is used to display the service info of a Service Registry itself.
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Service Registry instance
 * @property {ServiceRegistryProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-service-info-changed - Fired when the service info data changes
 */
export class ECCClientGa4ghServiceRegistryServiceInfo extends LitElement {
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
  @property({ attribute: false, reflect: true })
  provider?: ServiceRegistryProvider;

  @state() private serviceInfo: Service | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;

  private _provider: ServiceRegistryProvider | null = null;

  /** The number of the latest `loadData()` call */
  private dataLoads = 0;

  /** The REST provider for `baseUrl`, used without a custom provider */
  private restProvider: RestServiceRegistryProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    this.useProvider();
    if (!this._provider) {
      this.error = MISSING_PROVIDER;
      return;
    }
    await this.loadData();
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      (changedProperties.has("provider") || changedProperties.has("baseUrl")) &&
      this.useProvider()
    ) {
      if (this._provider) {
        this.loadData();
      } else {
        this.serviceInfo = null;
        this.loading = false;
        this.dispatchChanged(null);
        this.error = MISSING_PROVIDER;
      }
    }
  }

  /**
   * Switches to the custom provider or, without one, to a REST provider for
   * the base URL (to none without either); returns whether the provider in
   * use changed
   */
  private useProvider(): boolean {
    let provider: ServiceRegistryProvider | null = this.provider ?? null;
    if (!provider && this.baseUrl) {
      if (this.restProvider?.baseUrl !== this.baseUrl) {
        this.restProvider = new RestServiceRegistryProvider(this.baseUrl);
      }
      provider = this.restProvider;
    }
    if (provider === this._provider) return false;
    this._provider = provider;
    return true;
  }

  private dispatchChanged(serviceInfo: Service | null): void {
    this.dispatchEvent(
      new CustomEvent("ecc-service-info-changed", {
        detail: { serviceInfo },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async loadData(): Promise<void> {
    const provider = this._provider;
    if (!provider) return;
    this.dataLoads += 1;
    const load = this.dataLoads;
    // a load from a provider that was replaced in the meantime, or that a
    // newer load replaced, is dropped
    const stale = () => provider !== this._provider || load !== this.dataLoads;

    this.loading = true;
    this.error = null;

    try {
      const serviceInfo = await provider.getServiceInfo();
      if (stale()) return;
      this.serviceInfo = serviceInfo;
      this.dispatchChanged(serviceInfo);
    } catch (err) {
      if (stale()) return;
      this.serviceInfo = null;
      // the app drops the data of the previous provider too
      this.dispatchChanged(null);
      this.error =
        err instanceof Error ? err.message : "Failed to load service info";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghServiceRegistryServiceInfo.loadData",
      });
    } finally {
      if (!stale()) this.loading = false;
    }
  }

  private static getGroupVariant(
    group: string
  ): "default" | "secondary" | "destructive" | "outline" {
    // Highlight GA4GH and ELIXIR types, as the services components do
    if (group.includes("ga4gh") || group.includes("elixir")) {
      return "secondary";
    }
    return "default";
  }

  private static renderLink(url: string, label: string) {
    return html`<a
      href=${url}
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary hover:underline break-all"
      >${label}</a
    >`;
  }

  /** A row of the details; rows without a value aren't rendered. */
  private static renderRow(key: string, label: string, value: unknown) {
    if (value === null || value === undefined || value === "") return null;
    return html`
      <div class="flex flex-row gap-2 w-full justify-between" data-field=${key}>
        <dt class="text-muted-foreground">${label}</dt>
        <dd class="text-right">${value}</dd>
      </div>
    `;
  }

  private static renderServiceInfo(info: Service) {
    const { type, organization } = info;
    const organizationUrl = linkable(organization?.url, WEB);
    const contactUrl = linkable(info.contactUrl, [...WEB, "mailto:"]);
    const documentationUrl = linkable(info.documentationUrl, WEB);
    const rows = [
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "id",
        "ID",
        html`<span class="font-mono">${info.id}</span>`
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "version",
        "Version",
        info.version
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "type",
        "Type",
        type ? `${type.group} · ${type.artifact} · ${type.version}` : null
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "organization",
        "Organization",
        organizationUrl
          ? ECCClientGa4ghServiceRegistryServiceInfo.renderLink(
              organizationUrl,
              organization.name || organizationUrl
            )
          : organization?.name
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "environment",
        "Environment",
        info.environment
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "contact",
        "Contact",
        contactUrl
          ? ECCClientGa4ghServiceRegistryServiceInfo.renderLink(
              contactUrl,
              contactUrl.replace(/^mailto:/, "")
            )
          : null
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "documentation",
        "Documentation",
        documentationUrl
          ? ECCClientGa4ghServiceRegistryServiceInfo.renderLink(
              documentationUrl,
              documentationUrl
            )
          : null
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "created",
        "Created",
        formatDate(info.createdAt)
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "updated",
        "Last Updated",
        formatDate(info.updatedAt)
      ),
    ].filter((row) => row !== null);

    return html`
      <div class="flex flex-col gap-4 text-sm">
        <div class="flex flex-col gap-2">
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <h2 class="text-xl truncate">${info.name || info.id}</h2>
            ${info.version
              ? html`<ecc-utils-design-badge variant="outline">
                  v${info.version}
                </ecc-utils-design-badge>`
              : ""}
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            ${type
              ? html`<ecc-utils-design-badge
                  data-type
                  variant=${ECCClientGa4ghServiceRegistryServiceInfo.getGroupVariant(
                    type.group ?? ""
                  )}
                >
                  ${type.artifact}@${type.version}
                </ecc-utils-design-badge>`
              : ""}
            ${info.environment
              ? html`<ecc-utils-design-badge variant="outline">
                  ${info.environment}
                </ecc-utils-design-badge>`
              : ""}
          </div>
        </div>
        ${info.description
          ? html`<div data-description>
              ${info.description
                .split("\n")
                .map((line) => html`<p>${line}</p>`)}
            </div>`
          : ""}
        <dl class="flex flex-col gap-2">
          ${rows.map(
            (row, index) =>
              html`${index > 0
                ? html`<ecc-utils-design-separator></ecc-utils-design-separator>`
                : ""}${row}`
          )}
        </dl>
      </div>
    `;
  }

  static renderLoading() {
    return html`
      <div class="flex flex-col gap-4" data-loading>
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <ecc-utils-design-skeleton
            class="part:h-8 part:w-64"
          ></ecc-utils-design-skeleton>
          <ecc-utils-design-skeleton
            class="part:h-6 part:w-20"
          ></ecc-utils-design-skeleton>
        </div>
        <ecc-utils-design-skeleton
          class="part:h-6 part:w-48"
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
    `;
  }

  render() {
    if (this.error) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive bg-destructive/10"
        >
          ${this.error}
        </div>
      `;
    }

    if (this.loading || !this.serviceInfo) {
      return ECCClientGa4ghServiceRegistryServiceInfo.renderLoading();
    }

    return ECCClientGa4ghServiceRegistryServiceInfo.renderServiceInfo(
      this.serviceInfo
    );
  }
}

export default ECCClientGa4ghServiceRegistryServiceInfo;
