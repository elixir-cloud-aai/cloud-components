import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  ServiceRegistryProvider,
  ServiceType,
} from "../../providers/sr-provider.js";
import { RestServiceRegistryProvider } from "../../providers/rest-sr-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";

const MISSING_PROVIDER =
  "Please provide either a base URL for the Service Registry API or a custom provider.";

/** Whether the value is a service type with the three string parts. */
const isServiceType = (value: unknown): value is ServiceType =>
  typeof value === "object" &&
  value !== null &&
  ["group", "artifact", "version"].every(
    (key) => typeof (value as Record<string, unknown>)[key] === "string"
  );

/**
 * @summary This component is used to list the types of the services in a Service Registry.
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Service Registry instance
 * @property {ServiceRegistryProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-service-types-changed - Fired when the service types data changes
 */
export class ECCClientGa4ghServiceRegistryServiceTypes extends LitElement {
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

  @state() private serviceTypes: ServiceType[] = [];
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
        this.serviceTypes = [];
        this.loading = false;
        this.dispatchChanged([]);
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

  private dispatchChanged(serviceTypes: ServiceType[]): void {
    this.dispatchEvent(
      new CustomEvent("ecc-service-types-changed", {
        detail: { serviceTypes },
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
      const serviceTypes = await provider.getServiceTypes();
      if (stale()) return;
      // valid JSON of another shape would break the table
      if (!Array.isArray(serviceTypes)) {
        throw new Error("Invalid service types: the registry sent no list");
      }
      if (!serviceTypes.every(isServiceType)) {
        throw new Error(
          "Invalid service types: a type lacks a group, artifact or version"
        );
      }
      this.serviceTypes = serviceTypes;
      this.dispatchChanged(serviceTypes);
    } catch (err) {
      if (stale()) return;
      this.serviceTypes = [];
      // the app drops the data of the previous provider too
      this.dispatchChanged([]);
      this.error =
        err instanceof Error ? err.message : "Failed to load service types";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghServiceRegistryServiceTypes.loadData",
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

  private static renderSkeletonRows() {
    return html`
      ${Array(3)
        .fill(0)
        .map(
          () => html`
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-cell class="w-5/12">
                <ecc-utils-design-skeleton
                  class="part:h-6 part:w-28 part:rounded-full"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-4/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-24"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
              <ecc-utils-design-table-cell class="w-3/12">
                <ecc-utils-design-skeleton
                  class="part:h-4 part:w-16"
                ></ecc-utils-design-skeleton>
              </ecc-utils-design-table-cell>
            </ecc-utils-design-table-row>
          `
        )}
    `;
  }

  private static renderRow(type: ServiceType) {
    return html`
      <ecc-utils-design-table-row
        data-service-type=${`${type.group}:${type.artifact}:${type.version}`}
      >
        <ecc-utils-design-table-cell class="w-5/12">
          <ecc-utils-design-badge
            variant=${ECCClientGa4ghServiceRegistryServiceTypes.getGroupVariant(
              type.group
            )}
          >
            ${type.group}
          </ecc-utils-design-badge>
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-4/12 part:font-mono">
          ${type.artifact}
        </ecc-utils-design-table-cell>
        <ecc-utils-design-table-cell class="w-3/12">
          ${type.version}
        </ecc-utils-design-table-cell>
      </ecc-utils-design-table-row>
    `;
  }

  private renderRows() {
    if (this.loading) {
      return ECCClientGa4ghServiceRegistryServiceTypes.renderSkeletonRows();
    }
    if (this.serviceTypes.length === 0) {
      return html`
        <ecc-utils-design-table-row>
          <ecc-utils-design-table-cell
            colspan="3"
            class="part:text-center part:py-8 part:text-muted-foreground"
          >
            No service types found
          </ecc-utils-design-table-cell>
        </ecc-utils-design-table-row>
      `;
    }
    return this.serviceTypes.map((type) =>
      ECCClientGa4ghServiceRegistryServiceTypes.renderRow(type)
    );
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

    return html`
      <ecc-utils-design-table>
        <ecc-utils-design-table-header>
          <ecc-utils-design-table-row>
            <ecc-utils-design-table-head class="w-5/12"
              >Group</ecc-utils-design-table-head
            >
            <ecc-utils-design-table-head class="w-4/12"
              >Artifact</ecc-utils-design-table-head
            >
            <ecc-utils-design-table-head class="w-3/12"
              >Version</ecc-utils-design-table-head
            >
          </ecc-utils-design-table-row>
        </ecc-utils-design-table-header>
        <ecc-utils-design-table-body>
          ${this.renderRows()}
        </ecc-utils-design-table-body>
      </ecc-utils-design-table>
    `;
  }
}

export default ECCClientGa4ghServiceRegistryServiceTypes;
