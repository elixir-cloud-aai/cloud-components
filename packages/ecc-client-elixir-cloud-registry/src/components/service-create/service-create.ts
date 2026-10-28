import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { RestCloudRegistryProvider } from "../../providers/rest-cr-provider.js";
import {
  CloudRegistryProvider,
  ExternalServiceRegister,
  ServiceType,
  ServiceTypeRegister,
} from "../../providers/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/textarea/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";

/**
 * Value of the choice "Add new service type" in the type list; keys of
 * listed types are JSON arrays (cf. `typeKey()`), so they never equal it
 */
const NEW_TYPE = "new";

/** Key of a service type, as the value of its choice in the type list */
function typeKey({ group, artifact, version }: ServiceTypeRegister): string {
  return JSON.stringify([group, artifact, version]);
}

/** Label of a service type in the type list, e.g. `org.ga4gh · tes · 1.1.0` */
function typeLabel({ group, artifact, version }: ServiceTypeRegister): string {
  return `${group} · ${artifact} · ${version}`;
}

/**
 * @summary Component for creating new services in Cloud Registry
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the Cloud Registry instance/gateway
 * @property {CloudRegistryProvider} provider - Custom data provider (optional, overrides baseUrl)
 * @property {boolean} allowNewType - Whether users may add a new service type instead of choosing a listed one; default `true`, set `allow-new-type="false"` to offer listed types only
 *
 * @fires ecc-service-created - Fired when a service is successfully created (includes serviceId, serviceData, and success message)
 * @fires ecc-service-create-failed - Fired when service creation fails
 * @fires ecc-service-create-validation-failed - Fired when there are validation errors during service creation
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
    `,
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ attribute: false, reflect: true })
  provider?: CloudRegistryProvider;

  /**
   * Whether users may add a new service type instead of choosing one of the
   * registered types (`GET /services/types`): the type list then ends with
   * "Add new service type", which shows fields for the group, artifact and
   * version. Apps set it from `may_add_service_types` of the registry's
   * `GET /me`. Defaults to `true` for compatibility; as an attribute,
   * `allow-new-type="false"` turns it off.
   */
  @property({
    attribute: "allow-new-type",
    // `type: Boolean` can't turn a property that defaults to `true` off from
    // HTML (any attribute value is `true`), hence the converter
    converter: {
      fromAttribute: (value: string | null) => value?.toLowerCase() !== "false",
    },
  })
  allowNewType = true;

  @state() private serviceTypes: ServiceType[] = [];
  // Choice in the type list: the key of a listed type, `NEW_TYPE`, or empty
  @state() private typeChoice = "";
  // Whether the type list is loading, loaded or failed to load
  @state() private typesStatus: "loading" | "loaded" | "failed" = "loading";
  // Number of the latest request for types, so that older answers are ignored
  private typesRequest = 0;
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

  private _provider: CloudRegistryProvider | null = null;

  protected async firstUpdated(): Promise<void> {
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
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestCloudRegistryProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider) {
      await this.loadServiceTypes();
    }
  }

  protected willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    // switching adding types off discards a new type entered so far
    if (
      changedProperties.has("allowNewType") &&
      !this.allowNewType &&
      !this.listedChoice
    ) {
      this.selectType("");
    }
    // a chosen type that is no longer listed (e.g. after a reload) is dropped
    if (
      changedProperties.has("serviceTypes") &&
      this.typeChoice !== "" &&
      this.typeChoice !== NEW_TYPE &&
      !this.listedChoice
    ) {
      this.selectType("");
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this._provider = new RestCloudRegistryProvider(this.baseUrl);
      this.loadServiceTypes();
    }
  }

  /**
   * Load the registered service types
   * @param reportErrors Whether to fire `ecc-service-create-failed` if they
   * can't be loaded (not for reloads after a service was created)
   */
  private async loadServiceTypes(reportErrors = true): Promise<void> {
    if (!this._provider) return;

    this.typesRequest += 1;
    const request = this.typesRequest;
    // a reload after a create keeps the list; other loads start over
    if (reportErrors) this.typesStatus = "loading";
    try {
      const types = await this._provider.getServiceTypes();
      if (request !== this.typesRequest) return;
      this.serviceTypes = types;
      this.typesStatus = "loaded";
    } catch (error) {
      if (request !== this.typesRequest) return;
      this.typesStatus = this.serviceTypes.length > 0 ? "loaded" : "failed";
      console.error("Failed to load service types:", error);
      if (!reportErrors) return;
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-failed", {
          detail: { error: "Failed to load service types" },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  /**
   * Whether the form asks for a new type: chosen in the type list, or, if no
   * types are registered, the only choice, as long as adding types is allowed
   */
  private get newType(): boolean {
    return (
      this.allowNewType &&
      (this.typeChoice === NEW_TYPE ||
        (this.typeChoice === "" &&
          this.typesStatus === "loaded" &&
          this.serviceTypes.length === 0))
    );
  }

  /** Whether a listed type is chosen */
  private get listedChoice(): boolean {
    return this.serviceTypes.some((type) => typeKey(type) === this.typeChoice);
  }

  /** Whether the form has a complete service type to send */
  private get typeComplete(): boolean {
    const { group, artifact, version } = this.formData.type;
    return (
      (this.newType || this.listedChoice) &&
      Boolean(group && artifact && version)
    );
  }

  private selectType(choice: string): void {
    // choosing the current choice again keeps what was entered
    if (choice === (this.newType ? NEW_TYPE : this.typeChoice)) return;
    this.typeChoice = choice;
    const listed = this.serviceTypes.find((type) => typeKey(type) === choice);
    this.formData = {
      ...this.formData,
      type: listed
        ? {
            group: listed.group,
            artifact: listed.artifact,
            version: listed.version,
          }
        : { group: "org.ga4gh", artifact: "", version: "" },
    };
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
    if (!this._provider || !this._provider.createService) {
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

    this.loading = true;

    try {
      // Validate required fields
      if (!this.formData.name) {
        throw new Error("Service name is required");
      }
      if (!this.formData.url) {
        throw new Error("Service URL is required");
      }
      if (!this.formData.organization.name) {
        throw new Error("Organization name is required");
      }
      if (!this.formData.organization.url) {
        throw new Error("Organization URL is required");
      }
      if (!this.typeComplete) {
        throw new Error(
          this.newType
            ? "Service type group, artifact and version are required"
            : "Service type is required"
        );
      }
      if (!this.formData.version) {
        throw new Error("Service version is required");
      }

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
        serviceId = await this._provider.createServiceWithId!(
          this.formData.customServiceId,
          serviceData
        );
      } else {
        serviceId = await this._provider.createService(serviceData);
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

      // Reset form, and list a type that the service added
      this.resetForm();
      this.loadServiceTypes(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create service";

      // Emit error event
      this.dispatchEvent(
        new CustomEvent("ecc-service-create-failed", {
          detail: { error: errorMessage },
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      this.loading = false;
    }
  }

  private resetForm(): void {
    this.typeChoice = "";
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
              .value=${this.formData.name}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("name", e.detail.value)}
              placeholder="Enter a descriptive name for your service"
              required
              class="h-10"
            ></ecc-utils-design-input>
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
              .value=${this.formData.url}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("url", e.detail.value)}
              placeholder="https://api.example.com/v1"
              required
              class="h-10"
            ></ecc-utils-design-input>
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
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label for="org-url" class="text-sm font-medium">
              Organization URL <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="org-url"
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
          </div>
        </div>

        ${this.renderTypeFields()}

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
              .value=${this.formData.version}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("version", e.detail.value)}
              placeholder="1.0.0"
              required
              class="h-10"
            ></ecc-utils-design-input>
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="environment"
              class="text-sm font-medium"
            >
              Environment
            </ecc-utils-design-label>
            <ecc-utils-design-select
              id="environment"
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
                <ecc-utils-design-select-item value="prod"
                  >Production</ecc-utils-design-select-item
                >
                <ecc-utils-design-select-item value="test"
                  >Test</ecc-utils-design-select-item
                >
                <ecc-utils-design-select-item value="dev"
                  >Development</ecc-utils-design-select-item
                >
                <ecc-utils-design-select-item value="staging"
                  >Staging</ecc-utils-design-select-item
                >
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>
        </div>

        <!-- Description spans full width -->
        <div class="grid gap-2">
          <ecc-utils-design-label for="description" class="text-sm font-medium">
            Description
          </ecc-utils-design-label>
          <ecc-utils-design-textarea
            id="description"
            .value=${this.formData.description}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleInputChange("description", e.detail.value)}
            placeholder="Provide a detailed description of what your service does"
            rows="4"
            class="resize-none"
          ></ecc-utils-design-textarea>
        </div>

        ${this.renderAdvancedFields()}
      </div>
    `;
  }

  private renderTypeFields() {
    const noChoice =
      this.typesStatus === "loaded" &&
      this.serviceTypes.length === 0 &&
      !this.allowNewType;
    return html`
      <div class="grid gap-2">
        <ecc-utils-design-label for="service-type" class="text-sm font-medium">
          Service Type <span class="text-destructive">*</span>
        </ecc-utils-design-label>
        ${noChoice
          ? html`<p id="service-type" class="text-sm text-muted-foreground">
              No service types are registered yet. Ask an admin of the registry
              to add one.
            </p>`
          : html`
              <ecc-utils-design-select
                id="service-type"
                .value=${this.newType ? NEW_TYPE : this.typeChoice}
                @ecc-input-changed=${(e: CustomEvent) =>
                  this.selectType(e.detail.value)}
              >
                <ecc-utils-design-select-trigger class="h-10">
                  <ecc-utils-design-select-value
                    placeholder=${this.typesStatus === "loading"
                      ? "Loading service types..."
                      : "Select a service type"}
                  ></ecc-utils-design-select-value>
                </ecc-utils-design-select-trigger>
                <ecc-utils-design-select-content>
                  ${this.serviceTypes.map(
                    (type) => html`
                      <ecc-utils-design-select-item value=${typeKey(type)}
                        >${typeLabel(type)}</ecc-utils-design-select-item
                      >
                    `
                  )}
                  ${this.allowNewType
                    ? html`
                        <ecc-utils-design-select-item value=${NEW_TYPE}
                          >Add new service type</ecc-utils-design-select-item
                        >
                      `
                    : ""}
                </ecc-utils-design-select-content>
              </ecc-utils-design-select>
            `}
      </div>

      ${this.typesStatus === "failed"
        ? html`<p class="text-sm text-destructive">
            Could not load the registered service types.
          </p>`
        : ""}
      ${this.newType ? this.renderNewTypeFields() : ""}
    `;
  }

  private renderNewTypeFields() {
    return html`
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="grid gap-2">
          <ecc-utils-design-label for="type-group" class="text-sm font-medium">
            Type Group <span class="text-destructive">*</span>
          </ecc-utils-design-label>
          <ecc-utils-design-input
            id="type-group"
            .value=${this.formData.type.group}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleNestedInputChange("type", "group", e.detail.value)}
            placeholder="org.ga4gh"
            required
            class="h-10"
          ></ecc-utils-design-input>
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
            .value=${this.formData.type.artifact}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleNestedInputChange("type", "artifact", e.detail.value)}
            placeholder="beacon, wes, trs, etc."
            required
            class="h-10"
          ></ecc-utils-design-input>
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
            .value=${this.formData.type.version}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleNestedInputChange("type", "version", e.detail.value)}
            placeholder="1.0.0"
            required
            class="h-10"
          ></ecc-utils-design-input>
        </div>
      </div>
    `;
  }

  private renderAdvancedFields() {
    return html`
      <div class="space-y-6">
        <ecc-utils-design-collapsible>
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
                    .value=${this.formData.contactUrl}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange("contactUrl", e.detail.value)}
                    placeholder="mailto:support@example.com or https://contact.example.com"
                    class="h-10"
                  ></ecc-utils-design-input>
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
                    .value=${this.formData.documentationUrl}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange(
                        "documentationUrl",
                        e.detail.value
                      )}
                    placeholder="https://docs.example.com"
                    class="h-10"
                  ></ecc-utils-design-input>
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
                    .value=${this.formData.createdAt}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange("createdAt", e.detail.value)}
                    placeholder="2019-06-04T12:58:19Z (optional)"
                    class="h-10"
                  ></ecc-utils-design-input>
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
                    .value=${this.formData.updatedAt}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleInputChange("updatedAt", e.detail.value)}
                    placeholder="2019-06-04T12:58:19Z (optional)"
                    class="h-10"
                  ></ecc-utils-design-input>
                </div>
              </div>
            </div>
          </ecc-utils-design-collapsible-content>
        </ecc-utils-design-collapsible>
      </div>
    `;
  }

  render() {
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
            <div></div>
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
                !this.typeComplete ||
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
