import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { RestCloudRegistryProvider } from "../../providers/rest-cr-provider.js";
import {
  CloudRegistryProvider,
  ExternalService,
  Verification,
} from "../../providers/index.js";
import { matchesVerification } from "../../providers/verifications.js";
import { nonBlankString } from "../../providers/errors.js";
import type { EccServiceVerificationFailedEvent } from "../../events/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/button/index.js";

type FailureDetail = EccServiceVerificationFailedEvent["detail"];

/** Status of an error that a provider threw, if it has one */
const statusOf = (err: unknown): number | undefined => {
  const status =
    err && typeof err === "object"
      ? (err as Record<string, unknown>).status
      : undefined;
  return typeof status === "number" ? status : undefined;
};

/**
 * Detail of `ecc-service-verification-failed` for an error that a provider
 * threw: its message, and the status and problem details if it has them.
 * They are read from the error's fields, as `CloudRegistryError` has them,
 * so that errors of custom providers with the same fields work too.
 * @param serviceId ID of the service
 * @param action What failed
 * @param err The error
 * @param fallback Message if the error has none
 * @returns The event's detail
 */
const failureDetail = (
  serviceId: string,
  action: FailureDetail["action"],
  err: unknown,
  fallback: string
): FailureDetail => {
  const fields =
    err && typeof err === "object" ? (err as Record<string, unknown>) : {};
  const detail = nonBlankString(fields.detail);
  return {
    serviceId,
    action,
    error:
      nonBlankString(fields.message) ??
      detail ??
      nonBlankString(err) ??
      fallback,
    status: statusOf(err),
    title: nonBlankString(fields.title),
    detail,
    code: nonBlankString(fields.code),
    cause: err,
  };
};

/** Date of a verification for people, e.g. "20 Oct 2026"; else as sent */
const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * @summary Shows whether a service in Cloud Registry is verified, and lets admins verify it or remove its verification
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Cloud Registry instance/gateway
 * @property {CloudRegistryProvider} provider - Custom data provider (optional, overrides baseUrl); replacing it loads the verification again
 * @property {string} serviceId - ID of the service
 * @property {ExternalService} service - The service as the app shows it (optional): a verification only counts while it matches the service's URL and API type, and "Verify" sends them as checked
 * @property {Verification | null} verification - The verification, if the app has loaded it already (optional; `null`: not verified), e.g. from `getVerifications()` for a list; else the component loads it
 * @property {boolean} admin - Whether to offer "Verify" and "Remove verification" (for admins of the registry); default `false`
 *
 * @fires ecc-service-verification-changed - Fired when an admin verified the service or removed its verification (includes the service ID and the new verification, or `null`)
 * @fires ecc-service-verification-failed - Fired when loading, verifying or removing the verification fails (includes the action, the error message and, if the registry sent them, the status, problem details and conflict code)
 *
 * @csspart badge - The "Verified" (or, for admins, "Not verified") badge
 * @csspart verify-button - The "Verify" button (admins)
 * @csspart remove-button - The "Remove verification" button (admins)
 */
export class ECCClientElixirCloudRegistryServiceVerification extends LitElement {
  static styles = [
    TailwindStyles,
    GlobalStyles,
    css`
      :host {
        display: inline-block;
      }
    `,
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ attribute: false }) provider?: CloudRegistryProvider;

  /** ID of the service; defaults to the ID of `service` */
  @property({ type: String, attribute: "service-id" }) serviceId = "";

  /**
   * The service as the app shows it. A verification only counts while it
   * matches the service's URL (as written) and API type (`group`,
   * `artifact`), as the registry compares them; "Verify" sends them as the
   * ones that the admin checked, so that a service that changed meanwhile
   * isn't verified (`409`). Without it, the component trusts the registry's
   * verification and "Verify" verifies the service as it is registered.
   */
  @property({ attribute: false }) service?: ExternalService;

  /**
   * The verification, if the app has loaded it already: e.g. from
   * `getVerifications()` (with `verifiedServices()`) for a list of
   * services, so that the rows need no request each. `null` means not
   * verified; `undefined` (the default) makes the component load it.
   */
  @property({ attribute: false }) verification?: Verification | null;

  /**
   * Whether to offer "Verify" and "Remove verification". Apps set it from
   * `admin` of the registry's `GET /me`; the registry checks permissions
   * itself.
   */
  @property({ type: Boolean }) admin = false;

  // The verification shown: `undefined` while it loads or if loading failed
  @state() private current?: Verification | null;
  // IDs of the services with a verify or remove request running
  @state() private pending: ReadonlySet<string> = new Set();

  /** The provider for `baseUrl`, used if `provider` isn't set. */
  private restProvider: RestCloudRegistryProvider | null = null;

  // Number of the latest load, so that older answers are ignored (e.g. of a
  // previous service or provider, or read before a verify or remove)
  private loadRequest = 0;

  // Result of the last verify or remove: shown instead of `verification`
  // for that service of that registry until the app sets `verification`
  // again
  private own?: {
    id: string;
    verification: Verification | null;
    provider: CloudRegistryProvider;
  };

  /** ID of the service: `serviceId`, else the ID of `service`. */
  private get targetId(): string {
    return this.serviceId || this.service?.id || "";
  }

  /** Whether a verify or remove of the service shown is running. */
  private get busy(): boolean {
    return this.pending.has(this.targetId);
  }

  /** Whether the service is verified, as far as is known. */
  private get verified(): boolean {
    return Boolean(
      this.current &&
        (!this.service || matchesVerification(this.service, this.current))
    );
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("verification")) this.own = undefined;
    // a new object of the same service (e.g. of a reloaded list) needs no
    // new request: the verification shown is compared with it on render
    const previous = changedProperties.get("service") as
      | ExternalService
      | undefined;
    if (
      changedProperties.has("provider") ||
      changedProperties.has("baseUrl") ||
      changedProperties.has("serviceId") ||
      changedProperties.has("verification") ||
      (changedProperties.has("service") && previous?.id !== this.service?.id)
    ) {
      this.load();
    }
  }

  /**
   * The provider to use now: `provider`, else a REST provider for `baseUrl`
   * (also right after an app set them, before the component updated).
   */
  private currentProvider(): CloudRegistryProvider | null {
    if (this.baseUrl && this.restProvider?.baseUrl !== this.baseUrl) {
      this.restProvider = new RestCloudRegistryProvider(this.baseUrl);
    } else if (!this.baseUrl) {
      this.restProvider = null;
    }
    return this.provider ?? this.restProvider;
  }

  private fail(detail: FailureDetail): void {
    this.dispatchEvent(
      new CustomEvent("ecc-service-verification-failed", {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Shows `verification` if the app set it (or the result of a verify or
   * remove since), else loads the verification of the service; services
   * that aren't verified (`404`) show none.
   */
  private async load(): Promise<void> {
    this.loadRequest += 1;
    const request = this.loadRequest;
    const id = this.targetId;
    if (this.verification !== undefined) {
      const { own } = this;
      this.current =
        own && this.showsSame(own.id, own.provider)
          ? own.verification
          : this.verification;
      return;
    }
    this.current = undefined;
    const provider = this.currentProvider();
    if (!provider || !id) return;
    if (!provider.getServiceVerification) {
      this.fail({
        serviceId: id,
        action: "load",
        error: "The provider doesn't support verifications.",
      });
      return;
    }
    try {
      const verification = await provider.getServiceVerification(id);
      if (request !== this.loadRequest) return;
      this.current = verification;
    } catch (err) {
      if (request !== this.loadRequest) return;
      if (statusOf(err) === 404) {
        this.current = null;
        return;
      }
      this.fail(
        failureDetail(id, "load", err, "Failed to load the verification")
      );
    }
  }

  /**
   * Whether the component still shows the service of a request: the same ID
   * and registry (the same provider, or one for the same base URL, e.g. one
   * that an app replaced for a new token)
   */
  private showsSame(id: string, provider: CloudRegistryProvider): boolean {
    const current = this.currentProvider();
    const { baseUrl } = provider as { baseUrl?: unknown };
    return (
      id === this.targetId &&
      (current === provider ||
        (typeof baseUrl === "string" &&
          baseUrl === (current as { baseUrl?: unknown } | null)?.baseUrl))
    );
  }

  /** Marks a verify or remove of a service as running, or as done. */
  private setPending(id: string, running: boolean): void {
    const pending = new Set(this.pending);
    if (running) pending.add(id);
    else pending.delete(id);
    this.pending = pending;
  }

  /**
   * Applies the result of a verify or remove: always reported, as the
   * registry has applied it, but shown only if the component still shows
   * that service of that registry.
   */
  private applied(
    id: string,
    verification: Verification | null,
    provider: CloudRegistryProvider
  ): void {
    if (this.showsSame(id, provider)) {
      // a load that runs now may have read the state before the change
      this.loadRequest += 1;
      this.current = verification;
      if (this.verification !== undefined) {
        this.own = { id, verification, provider };
      }
    }
    this.changed(id, verification);
  }

  /**
   * Verifies the service (admins), with the URL and API type of `service`
   * as the ones checked. If the service has changed meanwhile (`409`), the
   * verification is loaded again.
   */
  private async verifyService(): Promise<void> {
    const provider = this.currentProvider();
    const { targetId: id, service } = this;
    if (!provider || !id || this.busy) return;
    if (!provider.verifyService) {
      this.fail({
        serviceId: id,
        action: "verify",
        error: "The provider doesn't support verifications.",
      });
      return;
    }
    this.setPending(id, true);
    try {
      const verification = await provider.verifyService(
        id,
        service
          ? {
              url: service.url,
              type: {
                group: service.type.group,
                artifact: service.type.artifact,
                version: service.type.version,
              },
            }
          : undefined
      );
      this.setPending(id, false);
      this.applied(id, verification, provider);
    } catch (err) {
      this.setPending(id, false);
      this.fail(failureDetail(id, "verify", err, "Failed to verify service"));
      if (
        statusOf(err) === 409 &&
        this.showsSame(id, provider) &&
        this.verification === undefined
      ) {
        this.load();
      }
    }
  }

  /**
   * Removes the verification of the service (admins); one that is gone
   * already (`404`) counts as removed.
   */
  private async removeVerification(): Promise<void> {
    const provider = this.currentProvider();
    const id = this.targetId;
    if (!provider || !id || this.busy) return;
    if (!provider.deleteServiceVerification) {
      this.fail({
        serviceId: id,
        action: "remove",
        error: "The provider doesn't support verifications.",
      });
      return;
    }
    this.setPending(id, true);
    try {
      await provider.deleteServiceVerification(id);
    } catch (err) {
      if (statusOf(err) !== 404) {
        this.setPending(id, false);
        this.fail(
          failureDetail(id, "remove", err, "Failed to remove verification")
        );
        return;
      }
    }
    this.setPending(id, false);
    this.applied(id, null, provider);
  }

  private changed(serviceId: string, verification: Verification | null) {
    this.dispatchEvent(
      new CustomEvent("ecc-service-verification-changed", {
        detail: { serviceId, verification },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    // nothing while loading, and nothing else for unverified services
    // unless the user is an admin
    const { current, verified } = this;
    if (current === undefined) return nothing;
    if (!verified && !this.admin) return nothing;

    const badge = verified
      ? html`<ecc-utils-design-badge
          part="badge"
          variant="secondary"
          title=${current?.verifiedAt
            ? `Verified on ${formatDate(current.verifiedAt)}`
            : "Verified"}
        >
          <svg
            class="mr-1 h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
          Verified
        </ecc-utils-design-badge>`
      : html`<ecc-utils-design-badge part="badge" variant="outline">
          Not verified
        </ecc-utils-design-badge>`;

    if (!this.admin) return badge;

    return html`
      <div class="flex items-center gap-2">
        ${badge}
        ${verified
          ? html`<ecc-utils-design-button
              part="remove-button"
              size="sm"
              variant="outline"
              .disabled=${this.busy}
              @click=${this.removeVerification}
            >
              ${this.busy ? "Removing..." : "Remove verification"}
            </ecc-utils-design-button>`
          : html`<ecc-utils-design-button
              part="verify-button"
              size="sm"
              .disabled=${this.busy}
              @click=${this.verifyService}
            >
              ${this.busy ? "Verifying..." : "Verify"}
            </ecc-utils-design-button>`}
      </div>
    `;
  }
}

export default ECCClientElixirCloudRegistryServiceVerification;
