import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { RestDrsFilerProvider } from "../../providers/rest-drs-filer-provider.js";
import {
  DrsFilerProvider,
  DrsObjectRegister,
  AccessMethodRegister,
  ChecksumRegister,
} from "../../providers/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/textarea/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/checkbox/index.js";

/**
 * @summary Component for creating new DRS objects in DRS-Filer
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the DRS instance/gateway
 * @property {DrsFilerProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-drs-object-created - Fired when an object is successfully created
 * @fires ecc-drs-object-create-failed - Fired when object creation fails
 * @fires ecc-drs-object-create-validation-failed - Fired when there are validation errors
 * @fires ecc-drs-object-create-input-changed - Fired when an input field is changed
 */
export class ECCClientElixirDrsFilerObjectCreate extends LitElement {
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
  @property({ attribute: false, reflect: true }) provider?: DrsFilerProvider;

  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private success: string | null = null;

  // Form state for DRS object
  @state() private formData: {
    name: string;
    description: string;
    mimeType: string;
    version: string;
    aliases: string[];
    size: number;
    checksums: ChecksumRegister[];
    accessMethods: AccessMethodRegister[];
    contents: { id: string; depth: number }[]; // For bundle objects with depth tracking
  } = {
    name: "",
    description: "",
    mimeType: "",
    version: "",
    aliases: [],
    size: 0,
    checksums: [],
    accessMethods: [],
    contents: [],
  };

  @state() private objectType: "blob" | "bundle" = "blob";

  private _provider: DrsFilerProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the DRS API or a custom provider.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestDrsFilerProvider(this.baseUrl);
    } else {
      this._provider = null;
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("provider")) {
      if (!this.provider && !this.baseUrl) {
        this.error =
          "Please provide either a base URL for the DRS API or a custom provider.";
        return;
      }
      if (this.provider !== this._provider) {
        this._provider = this.provider || null;
      }
      return;
    }

    if (changedProperties.has("baseUrl") && !this.provider) {
      if (!this.baseUrl) {
        this.error =
          "Please provide either a base URL for the DRS API or a custom provider.";
        return;
      }
      this._provider = new RestDrsFilerProvider(this.baseUrl);
    }
  }

  private handleInputChange(
    field: string,
    value: string | number | boolean
  ): void {
    this.formData = { ...this.formData, [field]: value };

    // Dispatch input change event
    const event = new CustomEvent("ecc-drs-object-create-input-changed", {
      detail: { field, value, formData: this.formData },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private handleArrayInputChange(field: string, value: string): void {
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    this.formData = { ...this.formData, [field]: arrayValue };

    const event = new CustomEvent("ecc-drs-object-create-input-changed", {
      detail: { field, value: arrayValue, formData: this.formData },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private addChecksum(): void {
    this.formData = {
      ...this.formData,
      checksums: [...this.formData.checksums, { type: "md5", checksum: "" }],
    };
  }

  private removeChecksum(index: number): void {
    this.formData = {
      ...this.formData,
      checksums: this.formData.checksums.filter((_, i) => i !== index),
    };
  }

  private updateChecksum(index: number, field: string, value: string): void {
    const updatedChecksums = [...this.formData.checksums];
    updatedChecksums[index] = { ...updatedChecksums[index], [field]: value };
    this.formData = { ...this.formData, checksums: updatedChecksums };
  }

  private addAccessMethod(): void {
    this.formData = {
      ...this.formData,
      accessMethods: [
        ...this.formData.accessMethods,
        { type: "https", access_url: { url: "" } },
      ],
    };
  }

  private removeAccessMethod(index: number): void {
    this.formData = {
      ...this.formData,
      accessMethods: this.formData.accessMethods.filter((_, i) => i !== index),
    };
  }

  private updateAccessMethod(
    index: number,
    field: string,
    value: string
  ): void {
    const updatedMethods = [...this.formData.accessMethods];
    if (field === "url") {
      updatedMethods[index] = {
        ...updatedMethods[index],
        access_url: { url: value },
      };
    } else {
      updatedMethods[index] = { ...updatedMethods[index], [field]: value };
    }
    this.formData = { ...this.formData, accessMethods: updatedMethods };
  }

  private async handleSubmit(): Promise<void> {
    if (!this._provider) {
      this.error = "No provider available";
      return;
    }

    // Basic validation
    if (!this.formData.name) {
      this.error = "Object name is required";
      const event = new CustomEvent("ecc-drs-object-create-validation-failed", {
        detail: { errors: ["Object name is required"] },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    try {
      // Prepare the DRS object for creation
      const drsObject: DrsObjectRegister = {
        name: this.formData.name,
        description: this.formData.description || undefined,
        created_time: new Date().toISOString(),
        mime_type: this.formData.mimeType || undefined,
        version: this.formData.version || undefined,
        aliases:
          this.formData.aliases.length > 0 ? this.formData.aliases : undefined,
        size: this.formData.size,
        checksums: this.formData.checksums,
        access_methods: this.formData.accessMethods,
        contents:
          this.objectType === "bundle" && this.formData.contents.length > 0
            ? this.formData.contents
                .filter((content) => content.id.trim()) // Only include non-empty IDs
                .map((content) => ({ name: content.id, id: content.id }))
            : undefined,
      };

      const objectId = await this._provider.createObject(drsObject);

      this.success = `DRS object created successfully with ID: ${objectId}`;

      // Dispatch success event
      const event = new CustomEvent("ecc-drs-object-created", {
        detail: {
          objectId,
          objectData: drsObject,
          message: this.success,
        },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);

      // Reset form
      this.resetForm();
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to create DRS object";

      const event = new CustomEvent("ecc-drs-object-create-failed", {
        detail: { error: this.error, formData: this.formData },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(event);
    } finally {
      this.loading = false;
    }
  }

  private resetForm(): void {
    this.formData = {
      name: "",
      description: "",
      mimeType: "",
      version: "",
      aliases: [],
      size: 0,
      checksums: [],
      accessMethods: [],
      contents: [],
    };
    this.objectType = "blob";
    this.error = null;
    this.success = null;
  }

  private renderBasicFields() {
    return html`
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Basic Information</h3>

        ${this.error
          ? html`
              <div
                class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
              >
                ${this.error}
              </div>
            `
          : ""}
        ${this.success
          ? html`
              <div
                class="p-4 border border-primary rounded-md text-primary-foreground bg-primary/10"
              >
                ${this.success}
              </div>
            `
          : ""}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ecc-utils-design-label for="object-name"
              >Object Name *</ecc-utils-design-label
            >
            <ecc-utils-design-input
              id="object-name"
              placeholder="Enter object name"
              .value=${this.formData.name}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("name", e.detail.value)}
            ></ecc-utils-design-input>
          </div>

          <div>
            <ecc-utils-design-label for="object-type"
              >Object Type</ecc-utils-design-label
            >
            <ecc-utils-design-select
              id="object-type"
              .value=${this.objectType}
              @ecc-input-changed=${(e: CustomEvent) => {
                this.objectType = e.detail.value as "blob" | "bundle";
              }}
            >
              <ecc-utils-design-select-trigger>
                <ecc-utils-design-select-value
                  placeholder="Select object type"
                ></ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>
              <ecc-utils-design-select-content>
                <ecc-utils-design-select-item value="blob"
                  >Blob (Single file)</ecc-utils-design-select-item
                >
                <ecc-utils-design-select-item value="bundle"
                  >Bundle (Collection)</ecc-utils-design-select-item
                >
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>
        </div>

        <div>
          <ecc-utils-design-label for="description"
            >Description</ecc-utils-design-label
          >
          <ecc-utils-design-textarea
            id="description"
            placeholder="Enter object description"
            .value=${this.formData.description}
            @ecc-textarea-changed=${(e: CustomEvent) =>
              this.handleInputChange("description", e.detail.value)}
          ></ecc-utils-design-textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <ecc-utils-design-label for="mime-type"
              >MIME Type</ecc-utils-design-label
            >
            <ecc-utils-design-input
              id="mime-type"
              placeholder="e.g., application/json"
              .value=${this.formData.mimeType}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("mimeType", e.detail.value)}
            ></ecc-utils-design-input>
          </div>

          <div>
            <ecc-utils-design-label for="version"
              >Version</ecc-utils-design-label
            >
            <ecc-utils-design-input
              id="version"
              placeholder="e.g., 1.0.0"
              .value=${this.formData.version}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("version", e.detail.value)}
            ></ecc-utils-design-input>
          </div>

          <div>
            <ecc-utils-design-label for="size"
              >Size (bytes)</ecc-utils-design-label
            >
            <ecc-utils-design-input
              id="size"
              type="number"
              placeholder="0"
              .value=${this.formData.size.toString()}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange(
                  "size",
                  parseInt(e.detail.value, 10) || 0
                )}
            ></ecc-utils-design-input>
          </div>
        </div>

        <div>
          <ecc-utils-design-label for="aliases"
            >Aliases (comma-separated)</ecc-utils-design-label
          >
          <ecc-utils-design-input
            id="aliases"
            placeholder="alias1, alias2, alias3"
            .value=${this.formData.aliases.join(", ")}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleArrayInputChange("aliases", e.detail.value)}
          ></ecc-utils-design-input>
        </div>
      </div>
    `;
  }

  private renderChecksums() {
    return html`
      <div class="space-y-4 mt-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Checksums</h3>
          <ecc-utils-design-button
            type="button"
            variant="outline"
            size="sm"
            @click=${this.addChecksum}
          >
            Add Checksum
          </ecc-utils-design-button>
        </div>

        ${this.formData.checksums.length === 0
          ? html`
              <p class="text-muted-foreground text-sm">
                No checksums added yet.
              </p>
            `
          : ""}
        ${this.formData.checksums.map(
          (checksum, index) => html`
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
            >
              <div>
                <ecc-utils-design-label>Type</ecc-utils-design-label>
                <ecc-utils-design-select
                  .value=${checksum.type}
                  @ecc-input-changed=${(e: CustomEvent) =>
                    this.updateChecksum(index, "type", e.detail.value)}
                >
                  <ecc-utils-design-select-trigger>
                    <ecc-utils-design-select-value
                      placeholder="Select type"
                    ></ecc-utils-design-select-value>
                  </ecc-utils-design-select-trigger>
                  <ecc-utils-design-select-content>
                    <ecc-utils-design-select-item value="md5"
                      >MD5</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="sha1"
                      >SHA1</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="sha256"
                      >SHA256</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="sha512"
                      >SHA512</ecc-utils-design-select-item
                    >
                  </ecc-utils-design-select-content>
                </ecc-utils-design-select>
              </div>
              <div>
                <ecc-utils-design-label>Checksum Value</ecc-utils-design-label>
                <ecc-utils-design-input
                  placeholder="Enter checksum value"
                  .value=${checksum.checksum}
                  @ecc-input-changed=${(e: CustomEvent) =>
                    this.updateChecksum(index, "checksum", e.detail.value)}
                ></ecc-utils-design-input>
              </div>
              <div class="flex items-end">
                <ecc-utils-design-button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click=${() => this.removeChecksum(index)}
                >
                  Remove
                </ecc-utils-design-button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  private renderAccessMethods() {
    return html`
      <div class="space-y-4 mt-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Access Methods</h3>
          <ecc-utils-design-button
            type="button"
            variant="outline"
            size="sm"
            @click=${this.addAccessMethod}
          >
            Add Access Method
          </ecc-utils-design-button>
        </div>

        ${this.formData.accessMethods.length === 0
          ? html`
              <p class="text-muted-foreground text-sm">
                No access methods added yet.
              </p>
            `
          : ""}
        ${this.formData.accessMethods.map(
          (method, index) => html`
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
            >
              <div>
                <ecc-utils-design-label>Type</ecc-utils-design-label>
                <ecc-utils-design-select
                  .value=${method.type}
                  @ecc-input-changed=${(e: CustomEvent) =>
                    this.updateAccessMethod(index, "type", e.detail.value)}
                >
                  <ecc-utils-design-select-trigger>
                    <ecc-utils-design-select-value
                      placeholder="Select type"
                    ></ecc-utils-design-select-value>
                  </ecc-utils-design-select-trigger>
                  <ecc-utils-design-select-content>
                    <ecc-utils-design-select-item value="https"
                      >HTTPS</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="http"
                      >HTTP</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="ftp"
                      >FTP</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="sftp"
                      >SFTP</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="s3"
                      >S3</ecc-utils-design-select-item
                    >
                    <ecc-utils-design-select-item value="gs"
                      >Google Storage</ecc-utils-design-select-item
                    >
                  </ecc-utils-design-select-content>
                </ecc-utils-design-select>
              </div>
              <div>
                <ecc-utils-design-label>Access URL</ecc-utils-design-label>
                <ecc-utils-design-input
                  placeholder="Enter access URL"
                  .value=${method.access_url?.url || ""}
                  @ecc-input-changed=${(e: CustomEvent) =>
                    this.updateAccessMethod(index, "url", e.detail.value)}
                ></ecc-utils-design-input>
              </div>
              <div class="flex items-end">
                <ecc-utils-design-button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click=${() => this.removeAccessMethod(index)}
                >
                  Remove
                </ecc-utils-design-button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  private renderBundleContents() {
    if (this.objectType !== "bundle") return html``;

    return html`
      <div class="space-y-4 mt-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Bundle Contents</h3>
          <ecc-utils-design-button
            type="button"
            variant="outline"
            size="sm"
            @click=${this.addBundleContent}
          >
            Add Content Object
          </ecc-utils-design-button>
        </div>

        ${this.formData.contents.length === 0
          ? html`
              <p class="text-muted-foreground text-sm">
                No content objects added yet.
              </p>
            `
          : ""}

        <div class="space-y-3">
          ${this.formData.contents.map((content, index) =>
            this.renderBundleContentItem(content, index)
          )}
        </div>

        <div class="p-4 bg-blue-50 border border-blue-200 rounded">
          <p class="text-sm text-blue-700">
            <strong>Tip:</strong> You can create nested bundle structures by
            referencing other bundle object IDs. Each content object can have
            its own nested contents for complex hierarchical data organization.
          </p>
        </div>
      </div>
    `;
  }

  private renderBundleContentItem(
    content: { id: string; depth: number },
    index: number
  ): any {
    const indent = content.depth * 24; // More spacing for better visual hierarchy
    const depthIndicator =
      "  ".repeat(content.depth) + (content.depth > 0 ? "└─ " : "");

    return html`
      <div
        class="border rounded-lg p-4 relative"
        style="margin-left: ${indent}px;"
      >
        ${content.depth > 0
          ? html`
              <div class="absolute -left-4 top-0 bottom-0 w-px bg-border"></div>
              <div class="absolute -left-4 top-6 w-4 h-px bg-border"></div>
            `
          : ""}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ecc-utils-design-label class="flex items-center gap-2">
              ${content.depth > 0
                ? html`
                    <span class="text-muted-foreground font-mono text-xs">
                      ${depthIndicator}
                    </span>
                  `
                : ""}
              Object ID *
            </ecc-utils-design-label>
            <ecc-utils-design-input
              placeholder="Enter DRS object ID"
              .value=${content.id}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.updateBundleContent(index, e.detail.value)}
            ></ecc-utils-design-input>
          </div>

          <div class="flex items-end gap-2">
            <ecc-utils-design-button
              type="button"
              variant="outline"
              size="sm"
              @click=${() => this.addNestedContent(index)}
            >
              Add Child
            </ecc-utils-design-button>
            ${content.depth < 3
              ? html`
                  <ecc-utils-design-button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click=${() => this.indentContent(index)}
                  >
                    Indent →
                  </ecc-utils-design-button>
                `
              : ""}
            ${content.depth > 0
              ? html`
                  <ecc-utils-design-button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click=${() => this.outdentContent(index)}
                  >
                    ← Outdent
                  </ecc-utils-design-button>
                `
              : ""}
            <ecc-utils-design-button
              type="button"
              variant="outline"
              size="sm"
              @click=${() => this.removeBundleContent(index)}
            >
              Remove
            </ecc-utils-design-button>
          </div>
        </div>

        <!-- Show depth level indicator -->
        ${content.depth > 0
          ? html`
              <div
                class="mt-2 text-xs text-muted-foreground flex items-center gap-1"
              >
                <span
                  class="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded"
                >
                  <span>Level ${content.depth + 1}</span>
                  <span class="text-xs opacity-60">(nested)</span>
                </span>
              </div>
            `
          : ""}
      </div>
    `;
  }

  private addBundleContent(): void {
    this.formData = {
      ...this.formData,
      contents: [...this.formData.contents, { id: "", depth: 0 }],
    };
  }

  private removeBundleContent(index: number): void {
    this.formData = {
      ...this.formData,
      contents: this.formData.contents.filter((_, i) => i !== index),
    };
  }

  private updateBundleContent(index: number, value: string): void {
    const updatedContents = [...this.formData.contents];
    updatedContents[index] = { ...updatedContents[index], id: value };
    this.formData = { ...this.formData, contents: updatedContents };
  }

  private addNestedContent(parentIndex: number): void {
    // Insert a new content item right after the parent with increased depth
    const updatedContents = [...this.formData.contents];
    const parentDepth = updatedContents[parentIndex].depth;
    updatedContents.splice(parentIndex + 1, 0, {
      id: "",
      depth: parentDepth + 1,
    });
    this.formData = { ...this.formData, contents: updatedContents };
  }

  private indentContent(index: number): void {
    const updatedContents = [...this.formData.contents];
    if (updatedContents[index].depth < 3) {
      // Max depth limit
      updatedContents[index] = {
        ...updatedContents[index],
        depth: updatedContents[index].depth + 1,
      };
      this.formData = { ...this.formData, contents: updatedContents };
    }
  }

  private outdentContent(index: number): void {
    const updatedContents = [...this.formData.contents];
    if (updatedContents[index].depth > 0) {
      updatedContents[index] = {
        ...updatedContents[index],
        depth: updatedContents[index].depth - 1,
      };
      this.formData = { ...this.formData, contents: updatedContents };
    }
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the DRS API or a custom provider.
        </div>
      `;
    }

    return html`
      <div class="space-y-6">
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <div class="space-y-6">
            ${this.renderBasicFields()}
            <ecc-utils-design-separator></ecc-utils-design-separator>
            ${this.renderChecksums()}
            <ecc-utils-design-separator></ecc-utils-design-separator>
            ${this.renderAccessMethods()}
            <ecc-utils-design-separator></ecc-utils-design-separator>
            ${this.renderBundleContents()}
          </div>

          <div class="flex justify-between items-center mt-6">
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
                .disabled=${this.loading || !this.formData.name}
              >
                ${this.loading ? "Creating..." : "Create Object"}
              </ecc-utils-design-button>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

export default ECCClientElixirDrsFilerObjectCreate;
