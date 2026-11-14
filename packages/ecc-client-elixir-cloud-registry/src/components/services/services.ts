/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import {
  ECCClientGa4ghServiceRegistryServices,
  type RowActionsRenderer,
} from "@elixir-cloud/service-registry/components/services/services.js";
import "@elixir-cloud/design/components/button/index.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { RestCloudRegistryProvider } from "../../providers/rest-cr-provider.js";
import {
  CloudRegistryProvider,
  ExternalService,
  ServiceVerification,
} from "../../providers/index.js";
import { verifiedServices } from "../../providers/verifications.js";
import { ECCClientElixirCloudRegistryServiceVerification } from "../service-verification/service-verification.js";
import type {
  EccServiceVerificationChangedEvent,
  EccServiceVerificationFailedEvent,
} from "../../events/index.js";

export type { RowActionsRenderer };

// Defines the elements that the list renders, unless they are already, and
// only in browsers, so that importing this module during server-side
// rendering (e.g. through the React wrapper) doesn't fail
if (typeof window !== "undefined" && window.customElements) {
  const elements: [string, CustomElementConstructor][] = [
    [
      "ecc-client-ga4gh-service-registry-services",
      ECCClientGa4ghServiceRegistryServices,
    ],
    [
      "ecc-client-elixir-cloud-registry-service-verification",
      ECCClientElixirCloudRegistryServiceVerification,
    ],
  ];
  elements.forEach(([name, element]) => {
    if (!window.customElements.get(name)) {
      window.customElements.define(name, element);
    }
  });
}

/** The number of services per page of the services list by default. */
const DEFAULT_PAGE_SIZE = 10;

/**
 * @summary Lists the services of a Cloud Registry, with a "Verified" badge for verified services
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Cloud Registry instance/gateway
 * @property {CloudRegistryProvider} provider - Custom data provider (optional, overrides baseUrl); replacing it loads the services and verifications again
 * @property {boolean} admin - Whether to offer "Verify" and "Remove verification" in each row (for admins of the registry); default `false`
 * @property {boolean} filter - Determines if the type, organization and environment filters should be rendered
 * @property {boolean} search - Determines if the search field should be rendered
 * @property {number} pageSize - Number of services per page (attribute `page-size`, default 10); 0 or less shows all services on one page
 * @property {RowActionsRenderer} rowActions - Renders the actions of each row (e.g. Edit and Delete buttons) from its service, after the badge; without it, rows have a "View Details" button
 *
 * @fires ecc-services-changed - Fired when services data changes
 * @fires ecc-service-selected - Fired when a service, its row or its "View Details" button is clicked
 * @fires ecc-service-verification-changed - Fired when an admin verified a service or removed its verification
 * @fires ecc-service-verification-failed - Fired when loading the verifications (`serviceId` empty) or verifying a service or removing its verification fails
 *
 * @csspart list - The services list (`ecc-client-ga4gh-service-registry-services`)
 */
export class ECCClientElixirCloudRegistryServices extends LitElement {
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

  @property({ attribute: false }) provider?: CloudRegistryProvider;
  @property({ type: Boolean }) admin = false;
  @property({ type: Boolean }) filter = true;
  @property({ type: Boolean }) search = true;
  @property({
    type: Number,
    attribute: "page-size",
    // An empty attribute is missing, not 0 (which shows all services)
    converter: {
      fromAttribute: (value: string | null) =>
        value === null || value.trim() === ""
          ? DEFAULT_PAGE_SIZE
          : Number(value),
    },
  })
  pageSize = DEFAULT_PAGE_SIZE;

  @property({ attribute: false }) rowActions?: RowActionsRenderer;

  // The services of the list, from its `ecc-services-changed`
  @state() private services: ExternalService[] = [];
  // The registry's verifications: `undefined` while they load or if loading
  // failed, so that the rows don't load their own
  @state() private verifications?: ServiceVerification[];

  /** The provider for `baseUrl`, used if `provider` isn't set. */
  private restProvider: RestCloudRegistryProvider | null = null;

  /** The provider shown, whose verifications count. */
  private shownProvider: CloudRegistryProvider | null = null;

  /**
   * Number of the list shown: it changes with the provider, so that
   * answers and events of a previous list (also of an earlier use of the
   * same provider) are ignored
   */
  private generation = 0;

  /** Verifications by service ID, matched against the services. */
  private verified = new Map<string, ServiceVerification>();

  /** Renders the badge and actions of a row; new when they change. */
  private renderRowActions?: RowActionsRenderer;

  /**
   * The provider to use: `provider`, else a REST provider for `baseUrl`.
   */
  private currentProvider(): CloudRegistryProvider | null {
    if (this.provider) return this.provider;
    if (!this.baseUrl) {
      this.restProvider = null;
    } else if (this.restProvider?.baseUrl !== this.baseUrl) {
      this.restProvider = new RestCloudRegistryProvider(this.baseUrl);
    }
    return this.restProvider;
  }

  protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    const provider = this.currentProvider();
    if (provider !== this.shownProvider) {
      this.shownProvider = provider;
      this.generation += 1;
      this.services = [];
      this.verifications = undefined;
      if (provider) this.loadVerifications(provider, this.generation);
    }
    if (
      changedProperties.has("provider") ||
      changedProperties.has("baseUrl") ||
      changedProperties.has("services") ||
      changedProperties.has("verifications") ||
      changedProperties.has("admin") ||
      changedProperties.has("rowActions")
    ) {
      this.verified = verifiedServices(this.services, this.verifications ?? []);
      this.renderRowActions = this.createRowActions();
    }
  }

  /** Loads the verifications of all services with one request. */
  private async loadVerifications(
    provider: CloudRegistryProvider,
    generation: number
  ): Promise<void> {
    try {
      if (!provider.getVerifications) {
        throw new Error("The provider doesn't support verifications.");
      }
      const verifications = await provider.getVerifications();
      if (generation === this.generation) this.verifications = verifications;
    } catch (err) {
      if (generation !== this.generation) return;
      const detail: EccServiceVerificationFailedEvent["detail"] = {
        serviceId: "",
        action: "load",
        error:
          err instanceof Error && err.message
            ? err.message
            : "Failed to load the verifications.",
        cause: err,
      };
      const { status } = (err ?? {}) as { status?: unknown };
      if (typeof status === "number") detail.status = status;
      this.dispatchEvent(
        new CustomEvent("ecc-service-verification-failed", {
          detail,
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleServicesChanged(
    e: CustomEvent<{ services: ExternalService[] }>
  ): void {
    // A replaced list (of a previous provider) may still answer
    const list = this.shadowRoot?.querySelector(
      "ecc-client-ga4gh-service-registry-services"
    );
    if (e.currentTarget !== list) return;
    this.services = e.detail.services;
  }

  /**
   * Updates the verifications after an admin verified or removed one. The
   * badge reports it also if its row is no longer shown (e.g. on another
   * page), as the listener is on the badge.
   */
  private handleVerificationChanged(
    e: EccServiceVerificationChangedEvent,
    generation: number
  ): void {
    if (generation !== this.generation || !this.verifications) return;
    const { serviceId, verification } = e.detail;
    const others = this.verifications.filter(
      (item) => item.serviceId !== serviceId
    );
    this.verifications = verification
      ? [...others, { serviceId, ...verification }]
      : others;
  }

  /**
   * Loads the verifications again after a verify or remove failed, as the
   * registry may have applied it (e.g. if the answer was lost)
   */
  private handleVerificationFailed(
    e: EccServiceVerificationFailedEvent,
    generation: number
  ): void {
    const provider = this.shownProvider;
    if (generation !== this.generation || !provider) return;
    if (e.detail.action !== "load") {
      this.loadVerifications(provider, generation);
    }
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

  /**
   * A renderer for the actions of the rows: the badge (once the
   * verifications are loaded), then the app's actions or "View Details".
   */
  private createRowActions(): RowActionsRenderer {
    const { verified, verifications, admin, rowActions } = this;
    const provider = this.shownProvider;
    const { generation } = this;
    return (service: ExternalService) => html`
      <div class="flex items-center gap-2">
        ${verifications && provider
          ? html`<ecc-client-elixir-cloud-registry-service-verification
              .provider=${provider}
              .service=${service}
              .verification=${verified.get(service.id) ?? null}
              ?admin=${admin}
              @ecc-service-verification-changed=${(
                e: EccServiceVerificationChangedEvent
              ) => this.handleVerificationChanged(e, generation)}
              @ecc-service-verification-failed=${(
                e: EccServiceVerificationFailedEvent
              ) => this.handleVerificationFailed(e, generation)}
            ></ecc-client-elixir-cloud-registry-service-verification>`
          : nothing}
        ${rowActions
          ? rowActions(service) ?? nothing
          : html`<ecc-utils-design-button
              size="sm"
              data-view-details
              @click=${() => this.handleViewDetails(service.id)}
            >
              View Details
            </ecc-utils-design-button>`}
      </div>
    `;
  }

  render() {
    // A new provider needs a new list, which reads it when it first renders
    return html`${keyed(
      this.generation,
      html`<ecc-client-ga4gh-service-registry-services
        part="list"
        .provider=${this.shownProvider ?? undefined}
        .filter=${this.filter}
        .search=${this.search}
        .pageSize=${this.pageSize}
        .rowActions=${this.renderRowActions}
        @ecc-services-changed=${this.handleServicesChanged}
      ></ecc-client-ga4gh-service-registry-services>`
    )}`;
  }
}

export default ECCClientElixirCloudRegistryServices;
