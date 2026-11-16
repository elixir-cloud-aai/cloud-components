/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { keyed } from "lit/directives/keyed.js";
import {
  ECCClientGa4ghServiceRegistryServices,
  type RowActionsRenderer,
  type RowBadgesRenderer,
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
import { ECCClientElixirCloudRegistryServiceVerificationBadge } from "../service-verification-badge/service-verification-badge.js";
import { failureDetail, needsReload } from "../service-verification/failure.js";
import type {
  EccServiceVerificationChangedEvent,
  EccServiceVerificationFailedEvent,
} from "../../events/index.js";

export type { RowActionsRenderer, RowBadgesRenderer };

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
    [
      "ecc-client-elixir-cloud-registry-service-verification-badge",
      ECCClientElixirCloudRegistryServiceVerificationBadge,
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
 * @summary Lists the services of a Cloud Registry, with a "Verified" badge for verified services next to their version
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Cloud Registry instance/gateway
 * @property {CloudRegistryProvider} provider - Custom data provider (optional, overrides baseUrl); replacing it loads the services and verifications again
 * @property {boolean} admin - Whether to show "Not verified" badges and offer "Verify" and "Remove verification" in the actions of each row (for admins of the registry); default `false`
 * @property {boolean} filter - Determines if the type, organization and environment filters should be rendered
 * @property {boolean} search - Determines if the search field should be rendered
 * @property {number} pageSize - Number of services per page (attribute `page-size`, default 10); 0 or less shows all services on one page
 * @property {RowActionsRenderer} rowActions - Renders the actions of each row (e.g. Edit and Delete buttons) from its service, after "Verify" or "Remove verification"; without it, rows have a "View Details" button
 * @property {RowBadgesRenderer} rowBadges - Renders more badges of each row from its service, after the "Verified" badge
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
  @property({ attribute: false }) rowBadges?: RowBadgesRenderer;

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

  /**
   * Number of the latest load of the verifications, so that older answers
   * are ignored, also those read before a verify or remove
   */
  private loadRequest = 0;

  /** Whether a load of the verifications is running. */
  private loading = false;

  /** Verifications by service ID, matched against the services. */
  private verified = new Map<string, ServiceVerification>();

  /** Renders the badges of a row; new when they change. */
  private renderRowBadges?: RowBadgesRenderer;

  /** Renders the actions of a row; new when they change. */
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
      changedProperties.has("rowActions") ||
      changedProperties.has("rowBadges")
    ) {
      this.verified = verifiedServices(this.services, this.verifications ?? []);
      this.renderRowBadges = this.createRowBadges();
      this.renderRowActions = this.createRowActions();
    }
  }

  /**
   * Loads the verifications of all services with one request; only the
   * answer of the latest load counts.
   */
  private async loadVerifications(
    provider: CloudRegistryProvider,
    generation: number
  ): Promise<void> {
    this.loadRequest += 1;
    const request = this.loadRequest;
    const latest = () =>
      generation === this.generation && request === this.loadRequest;
    this.loading = true;
    try {
      if (!provider.getVerifications) {
        throw new Error("The provider doesn't support verifications.");
      }
      const verifications = await provider.getVerifications();
      if (!latest()) return;
      this.loading = false;
      this.verifications = verifications;
    } catch (err) {
      if (!latest()) return;
      this.loading = false;
      // the last verifications loaded stay, e.g. after a reload that failed
      const detail = failureDetail(
        "",
        "load",
        err,
        "Failed to load the verifications."
      );
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
   * row reports it also if it is no longer shown (e.g. on another page), as
   * the listener is on its components. A load that runs meanwhile may have
   * read the verifications before the change: its answer is ignored, and
   * they are loaded again.
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
    const provider = this.shownProvider;
    if (this.loading && provider) this.loadVerifications(provider, generation);
  }

  /**
   * Loads the verifications again after a verify or remove failed with an
   * unclear outcome or a conflict, as the registry may have applied it (e.g.
   * if the answer was lost), with the same rule as the row's component
   */
  private handleVerificationFailed(
    e: EccServiceVerificationFailedEvent,
    generation: number
  ): void {
    const provider = this.shownProvider;
    if (generation !== this.generation || !provider) return;
    const { action, status } = e.detail;
    // a provider without the method sent no request that could have applied
    const supported =
      action === "verify"
        ? !!provider.verifyService
        : !!provider.deleteServiceVerification;
    if (action !== "load" && supported && needsReload(status)) {
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
   * The verification badge of a row, once the verifications are loaded:
   * "Verified", or for admins also "Not verified"
   */
  private renderBadge(service: ExternalService) {
    const { verified, verifications, admin } = this;
    if (!verifications || !this.shownProvider) return nothing;
    return html`<ecc-client-elixir-cloud-registry-service-verification-badge
      .verification=${verified.get(service.id) ?? null}
      ?show-unverified=${admin}
    ></ecc-client-elixir-cloud-registry-service-verification-badge>`;
  }

  /**
   * The admin actions of a row, once the verifications are loaded: "Verify"
   * or "Remove verification" (nothing for other users)
   */
  private renderActions(service: ExternalService) {
    const { verified, verifications, admin, generation } = this;
    const provider = this.shownProvider;
    if (!verifications || !provider) return nothing;
    return html`<ecc-client-elixir-cloud-registry-service-verification
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
    ></ecc-client-elixir-cloud-registry-service-verification>`;
  }

  /**
   * A renderer for the badges of the rows, next to their version: the
   * "Verified" (for admins also "Not verified") badge, then the app's.
   */
  private createRowBadges(): RowBadgesRenderer {
    const { rowBadges } = this;
    return (service: ExternalService) =>
      html`${this.renderBadge(service)}${rowBadges
        ? rowBadges(service) ?? nothing
        : nothing}`;
  }

  /**
   * A renderer for the actions of the rows: "Verify" or "Remove
   * verification" (admins), then the app's actions or "View Details".
   */
  private createRowActions(): RowActionsRenderer {
    const { rowActions } = this;
    return (service: ExternalService) => html`
      <div class="flex items-center gap-2">
        ${this.renderActions(service)}
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
        .rowBadges=${this.renderRowBadges}
        .rowActions=${this.renderRowActions}
        @ecc-services-changed=${this.handleServicesChanged}
      ></ecc-client-ga4gh-service-registry-services>`
    )}`;
  }
}

export default ECCClientElixirCloudRegistryServices;
