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
 * An email address: a local part and a domain, without spaces or control,
 * format (e.g. bidi overrides), private-use or unassigned characters, so that
 * the label shows the address the link goes to.
 */
const ADDRESS = /^[^\s@\p{C}]+@[^\s@\p{C}]+$/u;

/** The target of a link and the text it shows. */
interface Link {
  href: string;
  label: string;
}

/**
 * A link to the URL if it uses one of the protocols, or `null` (e.g. for a
 * missing, relative or `javascript:` URL), so that no dead or unsafe links
 * render. A `mailto:` URL needs recipients in its path (not only in `?to=`)
 * that are all email addresses; its label shows them decoded, without the
 * scheme and options such as `?subject=` or `?cc=`. Other links show their
 * URL.
 */
const toLink = (url: unknown, protocols: string[]): Link | null => {
  if (typeof url !== "string" || !url) return null;
  try {
    const { protocol, pathname } = new URL(url);
    if (!protocols.includes(protocol)) return null;
    if (protocol !== "mailto:") return { href: url, label: url };
    const recipients = decodeURIComponent(pathname)
      .split(",")
      .map((address) => address.trim());
    const valid = recipients.every((address) => ADDRESS.test(address));
    return valid ? { href: url, label: recipients.join(", ") } : null;
  } catch {
    // not a URL, or a malformed escape in the recipients
    return null;
  }
};

const WEB = ["http:", "https:"];

/**
 * The value if it is a string with visible text, or `null`, so that fields
 * that are missing, blank or of another type (from a registry that doesn't
 * follow the specification) aren't shown.
 */
const text = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;

/**
 * An RFC 3339 date-time without leap seconds (which the browsers can't
 * parse); `T`, `t` or a space between date and time, and the offset is
 * optional, for registries that send local times.
 */
const TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})[Tt ](?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:[Zz]|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/;

/** The number of days in the month (1 to 12) of the year. */
const daysInMonth = (year: number, month: number): number => {
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
};

/**
 * A timestamp in the reader's locale, or `null` if it isn't an RFC 3339
 * date-time of a real calendar date, so that dates the browser would
 * guess or roll over (e.g. 30 February) aren't shown.
 */
const formatDate = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const match = TIMESTAMP.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1, 4).map(Number);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    return null;
  }
  // the browsers parse only the ISO form with an uppercase `T` and `Z`
  const date = new Date(value.toUpperCase().replace(" ", "T"));
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
      // valid JSON of another shape (e.g. `null` or a list) can't be shown
      if (
        typeof serviceInfo !== "object" ||
        serviceInfo === null ||
        Array.isArray(serviceInfo)
      ) {
        throw new Error("Invalid service info: the registry sent no object");
      }
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

  /** The link, or `null` without one; `label` replaces the link's own. */
  private static renderLink(link: Link | null, label?: string | null) {
    if (!link) return null;
    return html`<a
      href=${link.href}
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary hover:underline break-all"
      >${label ?? link.label}</a
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
    // a registry that doesn't follow the specification may omit fields or
    // send values of other types; only strings with text are shown
    const id = text(info.id);
    const name = text(info.name);
    const version = text(info.version);
    const environment = text(info.environment);
    const description = text(info.description);
    const group = text(info.type?.group);
    const artifact = text(info.type?.artifact);
    const typeVersion = text(info.type?.version);
    const organizationName = text(info.organization?.name);
    const organizationLink = toLink(info.organization?.url, WEB);
    const contactLink = toLink(info.contactUrl, [...WEB, "mailto:"]);
    const documentationLink = toLink(info.documentationUrl, WEB);
    const rows = [
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "id",
        "ID",
        id ? html`<span class="font-mono">${id}</span>` : null
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "version",
        "Version",
        version
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "type",
        "Type",
        // only the parts that are set
        [group, artifact, typeVersion].filter((part) => part).join(" · ")
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "organization",
        "Organization",
        organizationLink
          ? ECCClientGa4ghServiceRegistryServiceInfo.renderLink(
              organizationLink,
              organizationName
            )
          : organizationName
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "environment",
        "Environment",
        environment
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "contact",
        "Contact",
        ECCClientGa4ghServiceRegistryServiceInfo.renderLink(contactLink)
      ),
      ECCClientGa4ghServiceRegistryServiceInfo.renderRow(
        "documentation",
        "Documentation",
        ECCClientGa4ghServiceRegistryServiceInfo.renderLink(documentationLink)
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
            <h2 class="text-xl truncate">
              ${name ?? id ?? "Service Registry"}
            </h2>
            ${version
              ? html`<ecc-utils-design-badge variant="outline">
                  v${version}
                </ecc-utils-design-badge>`
              : ""}
          </div>
          <div class="flex flex-wrap gap-2 items-center">
            ${artifact
              ? html`<ecc-utils-design-badge
                  data-type
                  variant=${ECCClientGa4ghServiceRegistryServiceInfo.getGroupVariant(
                    group ?? ""
                  )}
                >
                  ${typeVersion ? `${artifact}@${typeVersion}` : artifact}
                </ecc-utils-design-badge>`
              : ""}
            ${environment
              ? html`<ecc-utils-design-badge variant="outline">
                  ${environment}
                </ecc-utils-design-badge>`
              : ""}
          </div>
        </div>
        ${description
          ? html`<div data-description>
              ${description.split("\n").map((line) => html`<p>${line}</p>`)}
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
