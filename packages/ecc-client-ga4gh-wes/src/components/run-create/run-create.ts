import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { GlobalStyles } from "../../global.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import {
  WesProvider,
  RunRequest,
  ServiceInfo,
  WorkflowType,
} from "../../providers/wes-provider.js";
import { RestWesProvider } from "../../providers/rest-wes-provider.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/textarea/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";
import "@elixir-cloud/design/components/code/index.js";

/**
 * @summary Component for submitting workflow runs to a WES service
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the WES instance/gateway
 * @property {object} defaultParams - Default workflow parameters
 * @property {string} defaultWorkflowType - Default workflow type (CWL, WDL, etc.)
 * @property {boolean} allowFileUpload - Whether to allow file uploads for workflow attachments
 * @property {WesProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-run-submitted - Fired when a workflow run is successfully submitted
 * @fires ecc-run-create-failed - Fired when run creation fails
 */
export class ECCClientGa4ghWesRunCreate extends LitElement {
  static styles = [
    GlobalStyles,
    TailwindStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .error-message {
        color: hsl(var(--destructive));
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }

      .success-message {
        color: hsl(var(--success));
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    `,
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ type: Object }) defaultParams = {};
  @property({ type: String, reflect: true }) defaultWorkflowType: WorkflowType =
    "CWL";

  @property({ type: Boolean, reflect: true }) allowFileUpload = true;
  @property({ attribute: false }) provider?: WesProvider;

  @state() private serviceInfo: ServiceInfo | null = null;
  @state() private loading = false;
  @state() private submitting = false;
  @state() private error: string | null = null;
  @state() private success: string | null = null;
  @state() private attachedFiles: File[] = [];
  @state() private tags: { key: string; value: string }[] = [
    { key: "", value: "" },
  ];

  // Form state
  @state() private formData: {
    workflowUrl: string;
    workflowType: WorkflowType;
    workflowTypeVersion: string;
    workflowParams: string;
    workflowEngineParams: string;
  } = {
    workflowUrl: "",
    workflowType: this.defaultWorkflowType,
    workflowTypeVersion: "",
    workflowParams: JSON.stringify(this.defaultParams, null, 2),
    workflowEngineParams: "{}",
  };

  private _provider: WesProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the WES API or a custom provider.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestWesProvider(this.baseUrl);
    }

    if (this._provider) {
      await this.loadServiceInfo();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("baseUrl") && this.baseUrl && !this.provider) {
      this._provider = new RestWesProvider(this.baseUrl);
      this.loadServiceInfo();
    }

    if (changedProperties.has("provider") && this.provider) {
      this._provider = this.provider;
      this.loadServiceInfo();
    }

    if (changedProperties.has("defaultParams")) {
      this.formData = {
        ...this.formData,
        workflowParams: JSON.stringify(this.defaultParams, null, 2),
      };
    }

    if (changedProperties.has("defaultWorkflowType")) {
      this.formData = {
        ...this.formData,
        workflowType: this.defaultWorkflowType,
      };
    }
  }

  private async loadServiceInfo(): Promise<void> {
    if (!this._provider) return;

    this.loading = true;
    this.error = null;

    try {
      this.serviceInfo = await this._provider.getServiceInfo();

      // Set default workflow type version if available
      if (this.serviceInfo.workflow_type_versions[this.formData.workflowType]) {
        const versions =
          this.serviceInfo.workflow_type_versions[this.formData.workflowType]
            .workflow_type_version;
        if (versions.length > 0) {
          this.formData = {
            ...this.formData,
            workflowTypeVersion: versions[0],
          };
        }
      }
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to load service info";
      console.error("Failed to load service info:", err);
    } finally {
      this.loading = false;
    }
  }

  private handleInputChange(
    field: keyof typeof this.formData,
    value: string
  ): void {
    this.formData = { ...this.formData, [field]: value };
  }

  private handleWorkflowTypeChange(e: CustomEvent): void {
    this.formData = { ...this.formData, workflowType: e.detail.value };

    // Update version options when workflow type changes
    if (this.serviceInfo?.workflow_type_versions[this.formData.workflowType]) {
      const versions =
        this.serviceInfo.workflow_type_versions[this.formData.workflowType]
          .workflow_type_version;
      if (versions.length > 0) {
        this.formData = { ...this.formData, workflowTypeVersion: versions[0] };
      }
    } else {
      this.formData = { ...this.formData, workflowTypeVersion: "" };
    }
  }

  private handleFileUpload(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.attachedFiles = [...this.attachedFiles, ...Array.from(input.files)];
      input.value = ""; // Reset input
    }
  }

  private removeFile(index: number): void {
    this.attachedFiles = this.attachedFiles.filter((_, i) => i !== index);
  }

  private handleTagChange(
    index: number,
    field: "key" | "value",
    value: string
  ): void {
    const updatedTags = [...this.tags];
    updatedTags[index][field] = value;

    // Add new empty row if this is the last row and both key and value are filled
    if (
      index === this.tags.length - 1 &&
      updatedTags[index].key &&
      updatedTags[index].value
    ) {
      updatedTags.push({ key: "", value: "" });
    }

    this.tags = updatedTags;
  }

  private removeTag(index: number): void {
    if (this.tags.length > 1) {
      this.tags = this.tags.filter((_, i) => i !== index);
    } else {
      // If only one tag left, clear it instead of removing
      this.tags = [{ key: "", value: "" }];
    }
  }

  private renderTagsInput() {
    return html`
      <div class="space-y-2">
        ${this.tags.map(
          (tag, index) => html`
            <div class="flex gap-2 items-center">
              <ecc-utils-design-input
                .value=${tag.key}
                @ecc-input-changed=${(e: CustomEvent) =>
                  this.handleTagChange(index, "key", e.detail.value)}
                placeholder="Key"
                class="flex-1 h-9"
              ></ecc-utils-design-input>
              <span class="text-muted-foreground">=</span>
              <ecc-utils-design-input
                .value=${tag.value}
                @ecc-input-changed=${(e: CustomEvent) =>
                  this.handleTagChange(index, "value", e.detail.value)}
                placeholder="Value"
                class="flex-1 h-9"
              ></ecc-utils-design-input>
              ${this.tags.length > 1 || tag.key || tag.value
                ? html`
                    <ecc-utils-design-button
                      variant="ghost"
                      size="sm"
                      @click=${() => this.removeTag(index)}
                      class="part:h-9 part:w-9 part:p-0"
                    >
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </ecc-utils-design-button>
                  `
                : html` <div class="w-9"></div> `}
            </div>
          `
        )}
        <p class="text-xs text-muted-foreground">
          Add key-value pairs to tag your workflow run for organization and
          tracking
        </p>
      </div>
    `;
  }

  private validateForm(): string | null {
    if (!this.formData.workflowUrl.trim()) {
      return "Workflow URL is required";
    }

    if (!this.formData.workflowType.trim()) {
      return "Workflow type is required";
    }

    if (!this.formData.workflowTypeVersion.trim()) {
      return "Workflow type version is required";
    }

    try {
      JSON.parse(this.formData.workflowParams);
    } catch {
      return "Workflow parameters must be valid JSON";
    }

    try {
      JSON.parse(this.formData.workflowEngineParams);
    } catch {
      return "Workflow engine parameters must be valid JSON";
    }

    // Tags validation - check for duplicate keys
    const tagKeys = this.tags
      .filter((tag) => tag.key.trim())
      .map((tag) => tag.key.trim());
    const duplicateKeys = tagKeys.filter(
      (key, index) => tagKeys.indexOf(key) !== index
    );
    if (duplicateKeys.length > 0) {
      return `Duplicate tag keys found: ${duplicateKeys.join(", ")}`;
    }

    return null;
  }

  private async handleSubmit(): Promise<void> {
    if (!this._provider) {
      this.error = "No provider available";
      return;
    }

    const validationError = this.validateForm();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    try {
      // Parse tags from key-value pairs to object
      const tagsObject: Record<string, string> = {};
      for (const tag of this.tags) {
        if (tag.key.trim() && tag.value.trim()) {
          tagsObject[tag.key.trim()] = tag.value.trim();
        }
      }

      const runRequest: RunRequest = {
        workflow_url: this.formData.workflowUrl.trim(),
        workflow_type: this.formData.workflowType,
        workflow_type_version: this.formData.workflowTypeVersion,
        workflow_params: JSON.parse(this.formData.workflowParams),
        workflow_engine_parameters: JSON.parse(
          this.formData.workflowEngineParams
        ),
        tags: Object.keys(tagsObject).length > 0 ? tagsObject : undefined,
        workflow_attachment:
          this.attachedFiles.length > 0 ? this.attachedFiles : undefined,
      };

      const result = await this._provider.runWorkflow(runRequest);

      this.success = `Workflow submitted successfully! Run ID: ${result.run_id}`;

      // Emit success event
      this.dispatchEvent(
        new CustomEvent("ecc-run-submitted", {
          detail: {
            runId: result.run_id,
            request: runRequest,
          },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      this.resetForm();
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to submit workflow";
      console.error("Failed to submit workflow:", err);

      // Emit error event
      this.dispatchEvent(
        new CustomEvent("ecc-run-create-failed", {
          detail: { error: this.error },
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      this.submitting = false;
    }
  }

  private resetForm(): void {
    this.formData = {
      workflowUrl: "",
      workflowType: this.defaultWorkflowType,
      workflowTypeVersion: "",
      workflowParams: JSON.stringify(this.defaultParams, null, 2),
      workflowEngineParams: "{}",
    };
    this.tags = [{ key: "", value: "" }];
    this.attachedFiles = [];
    this.error = null;
    this.success = null;
  }

  private renderBasicFields() {
    return html`
      <div class="grid gap-4">
        <!-- Workflow URL spans full width -->
        <div class="grid gap-2">
          <ecc-utils-design-label
            for="workflow-url"
            class="text-sm font-medium"
          >
            Workflow URL <span class="text-destructive">*</span>
          </ecc-utils-design-label>
          <ecc-utils-design-input
            id="workflow-url"
            .value=${this.formData.workflowUrl}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleInputChange("workflowUrl", e.detail.value)}
            placeholder="https://example.com/workflow.cwl"
            required
            class="h-10"
          ></ecc-utils-design-input>
        </div>

        <!-- Workflow Type and Version in same row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label
              for="workflow-type"
              class="text-sm font-medium"
            >
              Workflow Type <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-select
              id="workflow-type"
              .value=${this.formData.workflowType}
              @ecc-input-changed=${this.handleWorkflowTypeChange}
              required
            >
              <ecc-utils-design-select-trigger class="h-10">
                <ecc-utils-design-select-value
                  placeholder="Select workflow type"
                >
                </ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>
              <ecc-utils-design-select-content>
                ${this.renderWorkflowTypeOptions()}
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="workflow-version"
              class="text-sm font-medium"
            >
              Workflow Type Version <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-select
              id="workflow-version"
              .value=${this.formData.workflowTypeVersion}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("workflowTypeVersion", e.detail.value)}
              required
            >
              <ecc-utils-design-select-trigger class="h-10">
                <ecc-utils-design-select-value placeholder="Select version">
                </ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>
              <ecc-utils-design-select-content>
                ${this.renderWorkflowVersionOptions()}
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>
        </div>

        <!-- Workflow Parameters -->
        <div class="grid gap-2">
          <ecc-utils-design-label
            for="workflow-params"
            class="text-sm font-medium"
          >
            Workflow Parameters (JSON) <span class="text-destructive">*</span>
          </ecc-utils-design-label>
          <ecc-utils-design-code
            id="workflow-params"
            value=${this.formData.workflowParams}
            extension="json"
            @ecc-input-changed=${(e: CustomEvent) =>
              this.handleInputChange("workflowParams", e.detail.value)}
            placeholder='{"input_file": "https://example.com/input.txt"}'
            class="part:h-[300px]"
          ></ecc-utils-design-code>
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
              <div class="grid gap-2">
                <ecc-utils-design-label
                  for="engine-params"
                  class="text-sm font-medium"
                >
                  Engine Parameters (JSON)
                </ecc-utils-design-label>
                <ecc-utils-design-code
                  id="engine-params"
                  value=${this.formData.workflowEngineParams}
                  extension="json"
                  @ecc-input-changed=${(e: CustomEvent) =>
                    this.handleInputChange(
                      "workflowEngineParams",
                      e.detail.value
                    )}
                  placeholder='{"memory": "4GB", "cpu": 2}'
                  class="part:h-[200px]"
                ></ecc-utils-design-code>
              </div>

              <div class="grid gap-2">
                <ecc-utils-design-label class="text-sm font-medium">
                  Tags (Optional)
                </ecc-utils-design-label>
                ${this.renderTagsInput()}
              </div>

              ${this.renderFileUpload()}
            </div>
          </ecc-utils-design-collapsible-content>
        </ecc-utils-design-collapsible>
      </div>
    `;
  }

  private renderWorkflowTypeOptions() {
    if (!this.serviceInfo) return html``;

    return Object.keys(this.serviceInfo.workflow_type_versions).map(
      (type) => html`
        <ecc-utils-design-select-item value=${type}>
          ${type}
        </ecc-utils-design-select-item>
      `
    );
  }

  private renderWorkflowVersionOptions() {
    if (!this.serviceInfo || !this.formData.workflowType) return html``;

    const versions =
      this.serviceInfo.workflow_type_versions[this.formData.workflowType]
        ?.workflow_type_version || [];

    return versions.map(
      (version) => html`
        <ecc-utils-design-select-item value=${version}>
          ${version}
        </ecc-utils-design-select-item>
      `
    );
  }

  private renderFileUpload() {
    if (!this.allowFileUpload) return html``;

    return html`
      <div class="grid gap-2">
        <div class="flex justify-between items-center">
          <ecc-utils-design-label class="text-sm font-medium">
            Workflow Attachments (Optional)
          </ecc-utils-design-label>
          <div class="relative">
            <input
              type="file"
              multiple
              @change=${this.handleFileUpload}
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="workflow-attachments"
            />
            <ecc-utils-design-button
              variant="outline"
              size="sm"
              as="label"
              for="workflow-attachments"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add Files
            </ecc-utils-design-button>
          </div>
        </div>

        ${this.attachedFiles.length > 0
          ? html`
              <div class="space-y-1 max-h-[200px] overflow-y-auto">
                ${this.attachedFiles.map(
                  (file, index) => html`
                    <ecc-utils-design-button
                      variant="ghost"
                      type="button"
                      class="part:h-8 part:w-full part:text-left part:px-3 part:py-1 part:rounded-md part:text-sm part:flex part:items-center part:justify-between part:hover:bg-muted"
                    >
                      <span class="truncate">
                        ${file.name}
                        <span class="text-xs text-muted-foreground ml-1">
                          (${(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </span>
                      <ecc-utils-design-button
                        type="button"
                        variant="ghost"
                        size="sm"
                        class="part:h-6 part:w-6 part:p-0 part:hover:bg-destructive part:hover:text-destructive-foreground"
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          this.removeFile(index);
                        }}
                      >
                        ×
                      </ecc-utils-design-button>
                    </ecc-utils-design-button>
                  `
                )}
              </div>
            `
          : ``}
      </div>
    `;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="p-6">
          <p>Loading service information...</p>
        </div>
      `;
    }

    return html`
      <div class="">
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <div class="space-y-6">
            ${this.renderBasicFields()} ${this.renderAdvancedFields()}
          </div>

          <!-- Messages -->
          ${this.error
            ? html` <div class="error-message mt-4">${this.error}</div> `
            : ""}
          ${this.success
            ? html` <div class="success-message mt-4">${this.success}</div> `
            : ""}

          <!-- Submit Button -->
          <div class="flex justify-between items-center mt-6">
            <div></div>
            <div class="space-x-2">
              <ecc-utils-design-button
                type="button"
                variant="outline"
                @click=${this.resetForm}
                ?disabled=${this.submitting}
              >
                Reset
              </ecc-utils-design-button>

              <ecc-utils-design-button
                type="submit"
                @click=${this.handleSubmit}
                ?disabled=${this.submitting ||
                !this.formData.workflowUrl ||
                !this.formData.workflowType ||
                !this.formData.workflowTypeVersion}
              >
                ${this.submitting ? "Submitting..." : "Submit Workflow"}
              </ecc-utils-design-button>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

export default ECCClientGa4ghWesRunCreate;
