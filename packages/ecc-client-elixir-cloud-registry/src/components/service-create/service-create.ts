import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { RestCloudRegistryProvider } from "../../providers/rest-cr-provider.js";
import {
  CloudRegistryProvider,
  ExternalServiceRegister,
  RegistryServiceInfo,
  ServiceType,
  ServiceTypeRegister,
} from "../../providers/index.js";
import { nonBlankString } from "../../providers/errors.js";
import type { EccServiceCreateFailedEvent } from "../../events/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/textarea/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";
import {
  HTTP_SCHEMES,
  MAX_LENGTHS,
  checkServiceId,
  checkUrl,
  hasUnpairedSurrogates,
  isDateTime,
  length,
} from "./validation.js";

/** Choice of an environment: its value, and an optional label to show */
export interface EnvironmentOption {
  value: string;
  label?: string;
}

// Environments that the GA4GH specification suggests, and Cloud Registry
// allows by default
const DEFAULT_ENVIRONMENTS: EnvironmentOption[] = [
  { value: "prod", label: "Production" },
  { value: "test", label: "Test" },
  { value: "dev", label: "Development" },
  { value: "staging", label: "Staging" },
];

// Fields in "Advanced Configuration", by the IDs of their inputs
const ADVANCED_FIELDS = [
  "custom-service-id",
  "contact-url",
  "documentation-url",
  "created-at",
  "updated-at",
];
// Timestamps, whose errors don't keep the form from being sent: the
// registry ignores timestamps unless they come from admins
const TIMESTAMP_FIELDS = ["created-at", "updated-at"];

/** IDs of the invalid fields that keep the form from being sent */
function blockingFields(errors: Record<string, string>): string[] {
  return Object.keys(errors).filter((id) => !TIMESTAMP_FIELDS.includes(id));
}

/**
 * Detail of `ecc-service-create-failed` for an error that a provider threw:
 * its message, and the status and problem details if it has them. They are
 * read from the error's fields, as `CloudRegistryError` has them, so that
 * errors of custom providers with the same fields work too.
 * @param err The error
 * @param action The failed action, e.g. "Failed to create service"
 * @param prefix Whether the message starts with the action
 * @returns The event's detail
 */
const failureDetail = (
  err: unknown,
  action: string,
  prefix = false
): EccServiceCreateFailedEvent["detail"] => {
  const fields =
    err && typeof err === "object" ? (err as Record<string, unknown>) : {};
  const detail = nonBlankString(fields.detail);
  const message =
    nonBlankString(fields.message) ?? detail ?? nonBlankString(err);
  let error = message ?? action;
  if (prefix && message) error = `${action}: ${message}`;
  return {
    error,
    status: typeof fields.status === "number" ? fields.status : undefined,
    title: nonBlankString(fields.title),
    detail,
    serviceId: nonBlankString(fields.serviceId),
    cause: err,
  };
};

/**
 * @summary Component for creating new services in Cloud Registry
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Cloud Registry instance/gateway
 * @property {CloudRegistryProvider} provider - Custom data provider (optional, overrides baseUrl); replacing it makes later requests use the new one
 * @property {(string | EnvironmentOption)[]} environments - Environments to offer if the registry doesn't publish its own (default: prod, test, dev, staging)
 * @property {string[]} urlSchemes - Schemes allowed in service URLs if the registry doesn't publish its own (default: https)
 *
 * @fires ecc-service-created - Fired when a service is successfully created (includes serviceId, serviceData, and success message)
 * @fires ecc-service-create-failed - Fired when service creation or loading the service types fails (includes the error message and, if the registry sent them, the status and problem details)
 * @fires ecc-service-create-validation-failed - Fired when there are validation errors during service creation (the form shows them at the fields and sends nothing)
 */
export class ECCClientElixirCloudRegistryServiceCreate extends LitElement {
  static styles = [
    TailwindStyles,
    GlobalStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
      [aria-invalid="true"]::part(base) {
        border-color: var(--destructive);
      }
    `,
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ attribute: false, reflect: true })
  provider?: CloudRegistryProvider;

  /**
   * Environments to offer, as values or `{ value, label }` objects; an empty
   * list allows any value (free text). Registries that publish their rules
   * (`registration_rules` of `GET /service-info`, cloud-registry 0.6.0 and
   * later) override it with their allowed environments, which take the labels
   * given here. Defaults to `prod`, `test`, `dev` and `staging`.
   */
  @property({ type: Array })
  environments?: (string | EnvironmentOption)[];

  /**
   * Schemes allowed in service URLs (`url`), lowercase: `https` and, if the
   * registry allows it, `http`. Registries that publish their rules
   * (`registration_rules` of `GET /service-info`, cloud-registry 0.6.0 and
   * later) override it. Defaults to `["https"]`, the registry's default; as
   * an attribute, a list separated by commas or spaces (e.g. `https,http`).
   */
  @property({
    attribute: "url-schemes",
    converter: {
      fromAttribute: (value: string | null) =>
        value === null
          ? undefined
          : value
              .split(/[\s,]+/)
              .map((scheme) => scheme.toLowerCase())
              .filter(Boolean),
    },
  })
  urlSchemes?: string[];

  @state() private serviceTypes: ServiceType[] = [];
  // Environments allowed by the registry; null if it doesn't publish them
  @state() private registryEnvironments: string[] | null = null;
  // Schemes of service URLs allowed by the registry; null if not published
  @state() private registryUrlSchemes: string[] | null = null;
  // Whether a submission was tried, so that missing fields are flagged too
  // (until the form is reset)
  @state() private submitted = false;
  // Whether "Advanced Configuration" is expanded
  @state() private advancedOpen = false;
  // Errors of the fields, cached at the start of each render for the
  // helpers of the template (`renderError()`, `invalid()`, ...); every
  // change of the form state renders again
  private errors: Record<string, string> = {};
  // Number of the latest request for the rules, so that older answers are
  // ignored (e.g. of a previous registry)
  private rulesRequest = 0;
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private success: string | null = null;

  // Form state
  @state() private formData: {
    name: string;
    url: string;
    organization: {
      name: string;
      url: string;
    };
    type: {
      group: string;
      artifact: string;
      version: string;
    };
    version: string;
    description: string;
    contactUrl: string;
    documentationUrl: string;
    environment: string;
    createdAt: string;
    updatedAt: string;
    customServiceId: string;
    useCustomId: boolean;
  } = {
    name: "",
    url: "",
    organization: {
      name: "",
      url: "",
    },
    type: {
      group: "org.ga4gh",
      artifact: "",
      version: "",
    },
    version: "",
    description: "",
    contactUrl: "",
    documentationUrl: "",
    environment: "",
    createdAt: "",
    updatedAt: "",
    customServiceId: "",
    useCustomId: false,
  };

  /** The provider in use: `provider`, else `restProvider`. */
  private _provider: CloudRegistryProvider | null = null;

  /** The provider for `baseUrl`, used if `provider` isn't set. */
  private restProvider: RestCloudRegistryProvider | null = null;

  /** Number of the latest request for service types. */
  private typesRequest = 0;

  protected firstUpdated(): void {
    if (!this.baseUrl && !this.provider) {
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-validation-failed", {
          detail: {
            error:
              "Please provide either a base URL for the Cloud Registry API or a custom provider.",
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("provider") || changedProperties.has("baseUrl")) {
      this.useProvider();
    }
  }

  /**
   * Uses `provider` or, without one, a REST provider for `baseUrl`, and
   * loads its service types and registration rules. Apps may replace either
   * property at any time, e.g. once the user's token is known or has changed.
   */
  private useProvider(): void {
    const provider = this.currentProvider();
    if (provider === this._provider) return;

    // the types shown stay until those of the new provider are loaded
    this._provider = provider;
    if (provider) {
      this.loadServiceTypes();
      this.loadRegistrationRules();
    } else {
      this.serviceTypes = [];
      this.registryEnvironments = null;
      this.registryUrlSchemes = null;
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

  protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    // an environment that is no longer offered is dropped
    if (
      (changedProperties.has("environments") ||
        changedProperties.has("registryEnvironments")) &&
      this.formData.environment
    ) {
      const options = this.environmentOptions;
      if (
        !this.anyEnvironment &&
        !options.some((option) => option.value === this.formData.environment)
      ) {
        this.formData = { ...this.formData, environment: "" };
      }
    }
  }

  /**
   * Load the registry's rules for registrations, if it publishes them; older
   * registries (and other providers) fall back to the properties
   */
  private async loadRegistrationRules(): Promise<void> {
    const provider = this._provider;
    if (!provider) return;

    this.rulesRequest += 1;
    const request = this.rulesRequest;
    let environments: unknown;
    let urlSchemes: unknown;
    try {
      // `registration_rules` is optional, so any service info will do
      const info: RegistryServiceInfo | undefined =
        await provider.getServiceInfo();
      environments = info?.registration_rules?.environments;
      urlSchemes = info?.registration_rules?.url_schemes;
    } catch (error) {
      // without rules, the properties apply
      console.warn("Failed to load the registration rules:", error);
    }
    if (request !== this.rulesRequest) return;
    const valid =
      Array.isArray(environments) &&
      environments.every((value) => typeof value === "string");
    if (environments !== undefined && !valid) {
      console.warn(
        "Ignoring invalid registration rules (environments):",
        environments
      );
    }
    this.registryEnvironments = valid ? (environments as string[]) : null;
    // schemes are case-insensitive
    const schemes = Array.isArray(urlSchemes)
      ? urlSchemes.map((value) =>
          typeof value === "string" ? value.toLowerCase() : value
        )
      : [];
    this.registryUrlSchemes =
      schemes.length > 0 &&
      schemes.every((value) => HTTP_SCHEMES.includes(value))
        ? schemes
        : null;
  }

  /** Schemes allowed in service URLs: the registry's, else the property's */
  private get serviceUrlSchemes(): string[] {
    const configured = Array.isArray(this.urlSchemes)
      ? this.urlSchemes
          .map((scheme) => String(scheme).toLowerCase())
          .filter((scheme) => HTTP_SCHEMES.includes(scheme))
      : [];
    return (
      this.registryUrlSchemes ?? (configured.length ? configured : ["https"])
    );
  }

  /**
   * Errors of the fields, by the IDs of their inputs, as the registry would
   * reject them (`400`)
   * @param includeMissing Whether to flag missing required fields (by
   * default, once a submission was tried)
   */
  private fieldErrors(includeMissing = this.submitted): Record<string, string> {
    const errors: Record<string, string> = {};
    const { formData } = this;
    // the first error of a field is shown: missing, too long, then invalid
    const add = (id: string, message: string) => {
      if (!(id in errors)) errors[id] = message;
    };
    const text = (
      id: string,
      label: string,
      value: string,
      max: number,
      required = false
    ) => {
      if (required && includeMissing && !value) {
        add(id, `${label} is required.`);
      }
      if (length(value) > max) {
        add(id, `${label} must be at most ${max} characters.`);
      }
      if (hasUnpairedSurrogates(value)) {
        add(id, `${label} must not contain invalid characters.`);
      }
    };
    const url = (
      id: string,
      label: string,
      value: string,
      schemes: string[],
      mailto = false
    ) => {
      if (!value) return;
      const error = checkUrl(value, schemes, mailto);
      if (error) add(id, `${label} ${error}.`);
    };

    text("service-name", "Service name", formData.name, MAX_LENGTHS.name, true);
    text("service-url", "Service URL", formData.url, MAX_LENGTHS.url, true);
    // the registry ignores leading and trailing spaces of service URLs
    url(
      "service-url",
      "Service URL",
      formData.url.replace(/^ +| +$/g, ""),
      this.serviceUrlSchemes
    );
    text(
      "org-name",
      "Organization name",
      formData.organization.name,
      MAX_LENGTHS.organizationName,
      true
    );
    text(
      "org-url",
      "Organization URL",
      formData.organization.url,
      MAX_LENGTHS.url,
      true
    );
    url("org-url", "Organization URL", formData.organization.url, HTTP_SCHEMES);
    text(
      "type-group",
      "Type group",
      formData.type.group,
      MAX_LENGTHS.type,
      true
    );
    text(
      "type-artifact",
      "Type artifact",
      formData.type.artifact,
      MAX_LENGTHS.type,
      true
    );
    text(
      "type-version",
      "Type version",
      formData.type.version,
      MAX_LENGTHS.type,
      true
    );
    text(
      "service-version",
      "Service version",
      formData.version,
      MAX_LENGTHS.version,
      true
    );
    text(
      "environment",
      "Environment",
      formData.environment,
      MAX_LENGTHS.environment
    );
    text(
      "description",
      "Description",
      formData.description,
      MAX_LENGTHS.description
    );
    url("contact-url", "Contact URL", formData.contactUrl, HTTP_SCHEMES, true);
    url(
      "documentation-url",
      "Documentation URL",
      formData.documentationUrl,
      HTTP_SCHEMES
    );
    if (formData.customServiceId) {
      const error = checkServiceId(formData.customServiceId);
      if (error) add("custom-service-id", `Custom service ID ${error}.`);
      if (hasUnpairedSurrogates(formData.customServiceId)) {
        add(
          "custom-service-id",
          "Custom service ID must not contain invalid characters."
        );
      }
    }
    for (const [id, label, value] of [
      ["created-at", "Created At", formData.createdAt],
      ["updated-at", "Updated At", formData.updatedAt],
    ]) {
      if (value && !isDateTime(value)) {
        add(
          id,
          `${label} must be an RFC 3339 date-time, e.g. 2024-01-01T00:00:00Z.`
        );
      }
    }
    return errors;
  }

  /** Whether the shown errors keep the form from being sent */
  private hasBlockingErrors(): boolean {
    return blockingFields(this.errors).length > 0;
  }

  /** Message under a field, if it is invalid (announced politely) */
  private renderError(id: string) {
    const error = this.errors[id];
    return error
      ? html`<p
          id="${id}-error"
          class="text-sm text-destructive"
          aria-live="polite"
        >
          ${error}
        </p>`
      : "";
  }

  private invalid(id: string): string {
    return id in this.errors ? "true" : "false";
  }

  private describedBy(id: string) {
    return id in this.errors ? `${id}-error` : nothing;
  }

  /**
   * Whether any environment is allowed (free text): the registry's list, else
   * the property's, is empty
   */
  private get anyEnvironment(): boolean {
    return this.registryEnvironments === null
      ? Array.isArray(this.environments) && this.environments.length === 0
      : this.registryEnvironments.length === 0;
  }

  /**
   * Environments to offer: the registry's, else the property's, else the
   * defaults (cf. `anyEnvironment` for empty lists)
   */
  private get environmentOptions(): EnvironmentOption[] {
    // the property may come from an attribute (JSON), so it is checked
    const configured = (
      Array.isArray(this.environments)
        ? this.environments
        : DEFAULT_ENVIRONMENTS
    ).flatMap((option): EnvironmentOption[] => {
      if (typeof option === "string") return [{ value: option }];
      if (option && typeof option.value === "string") {
        return [
          {
            value: option.value,
            label: typeof option.label === "string" ? option.label : undefined,
          },
        ];
      }
      return [];
    });
    const options =
      this.registryEnvironments === null
        ? configured
        : this.registryEnvironments.map((value) => ({
            value,
            label:
              configured.find((option) => option.value === value)?.label ??
              DEFAULT_ENVIRONMENTS.find((option) => option.value === value)
                ?.label,
          }));
    // empty values mean "no environment", offered anyway; no duplicates
    return options.filter(
      (option, index) =>
        option.value !== "" &&
        options.findIndex((other) => other.value === option.value) === index
    );
  }

  private async loadServiceTypes(): Promise<void> {
    const provider = this._provider;
    if (!provider) return;
    // only the latest request counts, also if a provider comes back
    this.typesRequest += 1;
    const request = this.typesRequest;

    try {
      const serviceTypes = await provider.getServiceTypes();
      if (request === this.typesRequest) this.serviceTypes = serviceTypes;
    } catch (error) {
      if (request !== this.typesRequest) return;
      // not those of a replaced provider
      this.serviceTypes = [];
      console.error("Failed to load service types:", error);
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-failed", {
          detail: failureDetail(error, "Failed to load service types", true),
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleInputChange(
    field: keyof typeof this.formData,
    value: string | boolean
  ): void {
    this.formData = { ...this.formData, [field]: value };
  }

  private handleNestedInputChange(
    parent: keyof typeof this.formData,
    field: string,
    value: string
  ): void {
    const parentObject = this.formData[parent];
    if (typeof parentObject === "object" && parentObject !== null) {
      this.formData = {
        ...this.formData,
        [parent]: { ...parentObject, [field]: value },
      };
    }
  }

  private async handleSubmit(): Promise<void> {
    const provider = this.currentProvider();
    if (!provider || !provider.createService) {
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-failed", {
          detail: {
            error: "Service creation is not supported by the current provider",
          },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    // invalid inputs are shown at their fields, and nothing is sent
    this.submitted = true;
    const errors = this.fieldErrors(true);
    const blocking = blockingFields(errors);
    if (blocking.length > 0) {
      // errors in the collapsed section are shown too
      if (blocking.some((id) => ADVANCED_FIELDS.includes(id))) {
        this.advancedOpen = true;
      }
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-validation-failed", {
          detail: { error: Object.values(errors).join(" "), errors },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    this.loading = true;

    try {
      // Prepare service data
      const serviceData: ExternalServiceRegister = {
        name: this.formData.name,
        url: this.formData.url,
        organization: {
          name: this.formData.organization.name,
          url: this.formData.organization.url,
        },
        type: {
          group: this.formData.type.group,
          artifact: this.formData.type.artifact,
          version: this.formData.type.version,
        } as ServiceTypeRegister,
        version: this.formData.version,
        description: this.formData.description || undefined,
        contactUrl: this.formData.contactUrl || undefined,
        documentationUrl: this.formData.documentationUrl || undefined,
        environment: this.formData.environment || undefined,
        createdAt: this.formData.createdAt || undefined,
        updatedAt: this.formData.updatedAt || undefined,
      };

      let serviceId: string;
      if (this.formData.useCustomId && this.formData.customServiceId) {
        serviceId = await provider.createServiceWithId!(
          this.formData.customServiceId,
          serviceData
        );
      } else {
        serviceId = await provider.createService(serviceData);
      }

      const successMessage = `Service created successfully with ID: ${serviceId}`;

      // Emit success event with comprehensive data
      this.dispatchEvent(
        new CustomEvent("ecc-service-created", {
          detail: { serviceId, serviceData, message: successMessage },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      this.resetForm();
    } catch (err) {
      // Emit error event
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-failed", {
          detail: failureDetail(err, "Failed to create service"),
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      this.loading = false;
    }
  }

  private resetForm(): void {
    this.submitted = false;
    this.advancedOpen = false;
    this.formData = {
      name: "",
      url: "",
      organization: {
        name: "",
        url: "",
      },
      type: {
        group: "org.ga4gh",
        artifact: "",
        version: "",
      },
      version: "",
      description: "",
      contactUrl: "",
      documentationUrl: "",
      environment: "",
      createdAt: "",
      updatedAt: "",
      customServiceId: "",
      useCustomId: false,
    };
  }

  private renderBasicFields() {
    return html`
      <div class="grid gap-4">
        <!-- Service Name and URL in same row on desktop -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label
              for="service-name"
              class="text-sm font-medium"
            >
              Service Name <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="service-name"
              aria-invalid=${this.invalid("service-name")}
              aria-describedby=${this.describedBy("service-name")}
              .value=${this.formData.name}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("name", e.detail.value)}
              placeholder="Enter a descriptive name for your service"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("service-name")}
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="service-url"
              class="text-sm font-medium"
            >
              Service URL <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="service-url"
              aria-invalid=${this.invalid("service-url")}
              aria-describedby=${this.describedBy("service-url")}
              .value=${this.formData.url}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("url", e.detail.value)}
              placeholder="https://api.example.com/v1"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("service-url")}
          </div>
        </div>

        <!-- Organization fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label for="org-name" class="text-sm font-medium">
              Organization Name <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="org-name"
              aria-invalid=${this.invalid("org-name")}
              aria-describedby=${this.describedBy("org-name")}
              .value=${this.formData.organization.name}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleNestedInputChange(
                  "organization",
                  "name",
                  e.detail.value
                )}
              placeholder="Enter your organization name"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("org-name")}
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label for="org-url" class="text-sm font-medium">
              Organization URL <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="org-url"
              aria-invalid=${this.invalid("org-url")}
              aria-describedby=${this.describedBy("org-url")}
              .value=${this.formData.organization.url}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleNestedInputChange(
                  "organization",
                  "url",
                  e.detail.value
                )}
              placeholder="https://example.com"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("org-url")}
          </div>
        </div>

        <!-- Service Type fields -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label
              for="type-group"
              class="text-sm font-medium"
            >
              Type Group <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="type-group"
              aria-invalid=${this.invalid("type-group")}
              aria-describedby=${this.describedBy("type-group")}
              .value=${this.formData.type.group}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleNestedInputChange("type", "group", e.detail.value)}
              placeholder="org.ga4gh"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("type-group")}
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="type-artifact"
              class="text-sm font-medium"
            >
              Type Artifact <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="type-artifact"
              aria-invalid=${this.invalid("type-artifact")}
              aria-describedby=${this.describedBy("type-artifact")}
              .value=${this.formData.type.artifact}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleNestedInputChange(
                  "type",
                  "artifact",
                  e.detail.value
                )}
              placeholder="beacon, wes, trs, etc."
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("type-artifact")}
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="type-version"
              class="text-sm font-medium"
            >
              Type Version <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="type-version"
              aria-invalid=${this.invalid("type-version")}
              aria-describedby=${this.describedBy("type-version")}
              .value=${this.formData.type.version}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleNestedInputChange("type", "version", e.detail.value)}
              placeholder="1.0.0"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("type-version")}
          </div>
        </div>

        <!-- Service Version -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label
              for="service-version"
              class="text-sm font-medium"
            >
              Service Version <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="service-version"
              aria-invalid=${this.invalid("service-version")}
              aria-describedby=${this.describedBy("service-version")}
              .value=${this.formData.version}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("version", e.detail.value)}
              placeholder="1.0.0"
              required
              class="h-10"
            ></ecc-utils-design-input>
            ${this.renderError("service-version")}
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="environment"
              class="text-sm font-medium"
            >
              Environment
            </ecc-utils-design-label>
            ${this.renderEnvironmentField()}
          </div>
        </div>

        <!-- Description spans full width -->
        <div class="grid gap-2">
          <ecc-utils-design-label for="description" class="text-sm font-medium">
            Description
          </ecc-utils-design-label>
          <ecc-utils-design-textarea
            id="description"
            aria-invalid=${this.invalid("description")}
            aria-describedby=${this.describedBy("description")}
            .value=${this.formData.description}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleInputChange("description", e.detail.value)}
            placeholder="Provide a detailed description of what your service does"
            rows="4"
            class="resize-none"
          ></ecc-utils-design-textarea>
          ${this.renderError("description")}
        </div>

        ${this.renderAdvancedFields()}
      </div>
    `;
  }

  private renderEnvironmentField() {
    const options = this.environmentOptions;
    if (this.anyEnvironment) {
      return html`
        <ecc-utils-design-input
          id="environment"
          aria-invalid=${this.invalid("environment")}
          aria-describedby=${this.describedBy("environment")}
          .value=${this.formData.environment}
          @ecc-input-changed=${(e: CustomEvent) =>
            this.handleInputChange("environment", e.detail.value)}
          placeholder="Environment (optional)"
          class="h-10"
        ></ecc-utils-design-input>
        ${this.renderError("environment")}
      `;
    }
    return html`
      <ecc-utils-design-select
        id="environment"
        aria-invalid=${this.invalid("environment")}
        aria-describedby=${this.describedBy("environment")}
        .value=${this.formData.environment}
        @ecc-input-changed=${(e: CustomEvent) =>
          this.handleInputChange("environment", e.detail.value)}
      >
        <ecc-utils-design-select-trigger class="h-10">
          <ecc-utils-design-select-value
            placeholder="Select environment"
          ></ecc-utils-design-select-value>
        </ecc-utils-design-select-trigger>
        <ecc-utils-design-select-content>
          <ecc-utils-design-select-item value=""
            >No environment specified</ecc-utils-design-select-item
          >
          ${options.map(
            ({ value, label }) => html`
              <ecc-utils-design-select-item value=${value}
                >${label ?? value}</ecc-utils-design-select-item
              >
            `
          )}
        </ecc-utils-design-select-content>
      </ecc-utils-design-select>
      ${this.renderError("environment")}
    `;
  }

  private renderAdvancedFields() {
    return html`
      <div class="space-y-6">
        <ecc-utils-design-collapsible
          .open=${this.advancedOpen}
          @ecc-collapsible-toggled=${(e: CustomEvent) => {
            this.advancedOpen = e.detail.open;
          }}
        >
          <ecc-utils-design-collapsible-trigger>
            <div
              class="flex items-center justify-between w-full py-2 text-left hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring rounded-t cursor-pointer transition-colors px-2"
            >
              <div class="space-y-0.5">
                <h4 class="text-sm font-medium text-muted-foreground">
                  Advanced Configuration
                </h4>
              </div>
              <svg
                class="w-4 h-4 text-muted-foreground/60 transition-transform duration-200 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </ecc-utils-design-collapsible-trigger>

          <ecc-utils-design-collapsible-content>
            <div class="pt-4 space-y-4 border-t border-border/50">
              <!-- Custom Service ID -->
              <div class="grid gap-2">
                <ecc-utils-design-label
                  for="custom-service-id"
                  class="text-sm font-medium"
                >
                  Custom Service ID
                </ecc-utils-design-label>
                <ecc-utils-design-input
                  id="custom-service-id"
                  aria-invalid=${this.invalid("custom-service-id")}
                  aria-describedby=${this.describedBy("custom-service-id")}
                  .value=${this.formData.customServiceId}
                  @ecc-input-changed=${(e: CustomEvent) => {
                    this.handleInputChange("customServiceId", e.detail.value);
                    this.handleInputChange(
                      "useCustomId",
                      Boolean(e.detail.value)
                    );
                  }}
                  placeholder="org.example.my-service (optional)"
                  class="h-10"
                ></ecc-utils-design-input>
                ${this.renderError("custom-service-id")}
              </div>

              <!-- Contact and Documentation URLs -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="contact-url"
                    class="text-sm font-medium"
                  >
                    Contact URL
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="contact-url"
                    aria-invalid=${this.invalid("contact-url")}
                    aria-describedby=${this.describedBy("contact-url")}
                    .value=${this.formData.contactUrl}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange("contactUrl", e.detail.value)}
                    placeholder="mailto:support@example.com or https://contact.example.com"
                    class="h-10"
                  ></ecc-utils-design-input>
                  ${this.renderError("contact-url")}
                </div>

                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="documentation-url"
                    class="text-sm font-medium"
                  >
                    Documentation URL
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="documentation-url"
                    aria-invalid=${this.invalid("documentation-url")}
                    aria-describedby=${this.describedBy("documentation-url")}
                    .value=${this.formData.documentationUrl}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange(
                        "documentationUrl",
                        e.detail.value
                      )}
                    placeholder="https://docs.example.com"
                    class="h-10"
                  ></ecc-utils-design-input>
                  ${this.renderError("documentation-url")}
                </div>
              </div>

              <!-- Creation and Update timestamps -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="created-at"
                    class="text-sm font-medium"
                  >
                    Created At (RFC 3339)
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="created-at"
                    aria-invalid=${this.invalid("created-at")}
                    aria-describedby=${this.describedBy("created-at")}
                    .value=${this.formData.createdAt}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange("createdAt", e.detail.value)}
                    placeholder="2019-06-04T12:58:19Z (optional)"
                    class="h-10"
                  ></ecc-utils-design-input>
                  ${this.renderError("created-at")}
                </div>

                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="updated-at"
                    class="text-sm font-medium"
                  >
                    Updated At (RFC 3339)
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="updated-at"
                    aria-invalid=${this.invalid("updated-at")}
                    aria-describedby=${this.describedBy("updated-at")}
                    .value=${this.formData.updatedAt}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange("updatedAt", e.detail.value)}
                    placeholder="2019-06-04T12:58:19Z (optional)"
                    class="h-10"
                  ></ecc-utils-design-input>
                  ${this.renderError("updated-at")}
                </div>
              </div>
            </div>
          </ecc-utils-design-collapsible-content>
        </ecc-utils-design-collapsible>
      </div>
    `;
  }

  render() {
    this.errors = this.fieldErrors();
    return html`
      <div class="">
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <div class="space-y-4">${this.renderBasicFields()}</div>

          <div class="flex justify-between items-center mt-4">
            <div>
              ${this.submitted && this.hasBlockingErrors()
                ? html`<p class="text-sm text-destructive" role="alert">
                    Please correct the fields marked above.
                  </p>`
                : nothing}
            </div>
            <div class="space-x-2">
              <ecc-utils-design-button
                type="button"
                variant="outline"
                @click=${this.resetForm}
              >
                Reset
              </ecc-utils-design-button>
              <ecc-utils-design-button
                type="submit"
                @click=${this.handleSubmit}
                .disabled=${this.loading ||
                !this.formData.name ||
                !this.formData.url ||
                !this.formData.organization.name ||
                !this.formData.organization.url ||
                !this.formData.type.group ||
                !this.formData.type.artifact ||
                !this.formData.type.version ||
                !this.formData.version}
              >
                ${this.loading ? "Creating..." : "Create Service"}
              </ecc-utils-design-button>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

export default ECCClientElixirCloudRegistryServiceCreate;
