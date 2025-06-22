import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  TrsProvider,
  Tool,
  ToolFile,
  DescriptorType,
} from "../../providers/trs-provider.js";
import { RestTrsProvider } from "../../providers/rest-trs-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/card/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/code/index.js";

/**
 * @summary This component displays a single tool from the Tool Registry Service API.
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the TRS instance/gateway
 * @property {string} toolId - ID of the tool to display
 * @property {TrsProvider} provider - Custom data provider (optional, overrides baseUrl)
 */
export class ECCClientGa4ghTrsTool extends LitElement {
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
  @property({ type: String, reflect: true }) toolId = "";
  @property({ type: String, reflect: true }) toolUrl = "";
  @property({ attribute: false }) provider?: TrsProvider;

  @state() private tool: Tool | null = null;
  @state() private selectedVersion = "";
  @state() private selectedDescriptorType: DescriptorType = "CWL";
  @state() private toolFiles: ToolFile[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private fileContents: { [key: string]: string } = {};
  @state() private activeFileIndex = -1;

  private _provider: TrsProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the TRS API or a custom provider.";
      return;
    }

    if (!this.toolId) {
      this.error = "Please provide a tool ID.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestTrsProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider && this.toolId) {
      await this.loadToolData();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    // Handle provider changes
    if (changedProperties.has("provider")) {
      if (!this.provider && !this.baseUrl) {
        this.error =
          "Please provide either a base URL for the TRS API or a custom provider.";
        return;
      }
      // Only update provider if it's actually different
      if (this.provider !== this._provider) {
        this._provider = this.provider || null;
        if (this.toolId) {
          this.loadToolData();
        }
      }
      return;
    }

    // Handle baseUrl changes
    if (changedProperties.has("baseUrl") && !this.provider) {
      if (!this.baseUrl) {
        this.error =
          "Please provide either a base URL for the TRS API or a custom provider.";
        return;
      }
      this._provider = new RestTrsProvider(this.baseUrl);
      if (this.toolId) {
        this.loadToolData();
      }
      return;
    }

    // Handle toolId changes
    if (changedProperties.has("toolId") && this._provider) {
      if (!this.toolId) {
        this.error = "Please provide a tool ID.";
        return;
      }
      this.loadToolData();
    }
  }

  private async loadToolData(): Promise<void> {
    if (!this._provider || !this.toolId) return;

    this.loading = true;
    this.error = null;

    try {
      const tool = await this._provider.getTool(this.toolUrl, this.toolId);
      this.tool = tool;

      // Select the first version by default if there are versions
      if (tool.versions && tool.versions.length > 0) {
        const previousVersion = this.selectedVersion;
        this.selectedVersion = tool.versions[0].id;

        // Determine the first available descriptor type in the selected version
        const version = tool.versions[0];
        if (version.descriptor_type && version.descriptor_type.length > 0) {
          [this.selectedDescriptorType] = version.descriptor_type;
          // Load tool files for the selected version and descriptor type
          await this.loadToolFiles();
        }

        // Emit version change event for initial load
        this.dispatchEvent(
          new CustomEvent("ecc-tool-version-changed", {
            detail: {
              previousVersion,
              newVersion: this.selectedVersion,
              version,
              toolId: this.toolId,
            },
            bubbles: true,
            composed: true,
          })
        );
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load tool";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghTrsTool.loadToolData",
      });
    } finally {
      this.loading = false;
    }
  }

  private async loadToolFiles(): Promise<void> {
    if (
      !this._provider ||
      !this.tool ||
      !this.toolId ||
      !this.selectedVersion ||
      !this.selectedDescriptorType
    )
      return;

    try {
      // Find the selected version object to get its URL
      const version = this.tool.versions.find(
        (v) => v.id === this.selectedVersion
      );
      if (!version) return;

      // Use version.url for version-specific operations
      const files = await this._provider.getToolFiles(
        version.url, // Use version URL
        this.toolId,
        this.selectedVersion,
        this.selectedDescriptorType
      );
      this.toolFiles = files;

      // Reset active file index and load the first file if available
      if (files.length > 0) {
        this.activeFileIndex = 0;
        // Load the first file's content
        await this.viewFileContent(0);
      } else {
        this.activeFileIndex = -1;
      }
    } catch (err) {
      console.error("Failed to load tool files:", err);
    }
  }

  private async handleVersionChange(e: CustomEvent): Promise<void> {
    const previousVersion = this.selectedVersion;
    const newVersion = e.detail.value;

    // Don't emit event if version hasn't actually changed
    if (previousVersion === newVersion) return;

    this.selectedVersion = newVersion;

    // Find the selected version object
    const version = this.tool?.versions.find(
      (v) => v.id === this.selectedVersion
    );

    // Update descriptor type if the current one is not available in the new version
    if (
      version &&
      version.descriptor_type &&
      !version.descriptor_type.includes(this.selectedDescriptorType) &&
      version.descriptor_type.length > 0
    ) {
      [this.selectedDescriptorType] = version.descriptor_type;
    }

    // Clear file content cache when changing versions
    this.fileContents = {};

    // Emit version change event
    this.dispatchEvent(
      new CustomEvent("ecc-tool-version-changed", {
        detail: {
          previousVersion,
          newVersion,
          version: version || null,
          toolId: this.toolId,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Reload tool files
    await this.loadToolFiles();
  }

  private async handleDescriptorTypeChange(e: CustomEvent): Promise<void> {
    this.selectedDescriptorType = e.detail.value as DescriptorType;
    await this.loadToolFiles();
  }

  private async viewFileContent(index: number): Promise<void> {
    if (
      !this._provider ||
      !this.tool ||
      !this.toolId ||
      !this.selectedVersion ||
      !this.toolFiles[index]
    )
      return;

    const file = this.toolFiles[index];
    this.activeFileIndex = index;

    // Check if we already have the file content cached
    if (this.fileContents[file.path]) return;

    // Set a loading indicator
    this.fileContents = {
      ...this.fileContents,
      [file.path]: "Loading file content...",
    };

    // Find the selected version to get its URL
    const version = this.tool.versions.find(
      (v) => v.id === this.selectedVersion
    );
    if (!version) return;

    // Ensure UI updates with loading message
    this.requestUpdate();

    try {
      if (file.file_type === "PRIMARY_DESCRIPTOR") {
        const fileWrapper = await this._provider.getToolDescriptor(
          version.url, // Use version URL
          this.toolId,
          this.selectedVersion,
          this.selectedDescriptorType
        );
        if (fileWrapper.content) {
          // Create a new object to trigger change detection
          this.fileContents = {
            ...this.fileContents,
            [file.path]: fileWrapper.content,
          };
        } else if (fileWrapper.url) {
          // If only URL is provided, fetch the content from the URL
          const response = await fetch(fileWrapper.url);
          if (response.ok) {
            const content = await response.text();
            // Create a new object to trigger change detection
            this.fileContents = {
              ...this.fileContents,
              [file.path]: content,
            };
          } else {
            throw new Error(
              `Failed to fetch file content: ${response.statusText}`
            );
          }
        }
      } else {
        // For secondary descriptors and other files, use the path-specific method
        const fileWrapper = await this._provider.getToolDescriptorByPath(
          version.url, // Use version URL
          this.toolId,
          this.selectedVersion,
          this.selectedDescriptorType,
          file.path
        );

        if (fileWrapper.content) {
          // Create a new object to trigger change detection
          this.fileContents = {
            ...this.fileContents,
            [file.path]: fileWrapper.content,
          };
        } else if (fileWrapper.url) {
          // If only URL is provided, fetch the content from the URL
          const response = await fetch(fileWrapper.url);
          if (response.ok) {
            const content = await response.text();
            // Create a new object to trigger change detection
            this.fileContents = {
              ...this.fileContents,
              [file.path]: content,
            };
          } else {
            throw new Error(
              `Failed to fetch file content: ${response.statusText}`
            );
          }
        } else {
          throw new Error("No content or URL available for this file");
        }
      }
    } catch (err) {
      console.error("Failed to load file content:", err);
      // Create a new object to trigger change detection
      this.fileContents = {
        ...this.fileContents,
        [file.path]: `Error loading file content: ${
          err instanceof Error ? err.message : String(err)
        }`,
      };
    }
  }

  private renderToolHeader() {
    if (!this.tool) return html``;

    // Get the currently selected version object
    const selectedVersion = this.tool.versions.find(
      (v) => v.id === this.selectedVersion
    );
    const versionName = selectedVersion
      ? selectedVersion.name || selectedVersion.id
      : "";
    const isProduction = selectedVersion?.is_production;

    return html`
      <div class="mb-6">
        <div class="w-full flex flex-col gap-2">
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <h2 class="text-xl truncate">
              ${this.tool.name || this.tool.id} :
            </h2>

            <!-- Version selector integrated next to the name -->
            ${this.tool.versions && this.tool.versions.length > 0
              ? html`
                  <div class="w-full md:w-auto flex-shrink-0">
                    <ecc-utils-design-select
                      class="part:w-full part:md:w-64"
                      @ecc-input-changed=${this.handleVersionChange}
                      value=${this.selectedVersion}
                    >
                      <ecc-utils-design-select-trigger>
                        <ecc-utils-design-select-value
                          class="part:flex part:items-center"
                        >
                          <div class="flex items-center gap-2">
                            <span>${versionName}</span>
                            ${isProduction
                              ? html`
                                  <ecc-utils-design-badge
                                    variant="default"
                                    class="part:text-xs"
                                    >Production</ecc-utils-design-badge
                                  >
                                `
                              : ""}
                          </div>
                        </ecc-utils-design-select-value>
                      </ecc-utils-design-select-trigger>
                      <ecc-utils-design-select-content>
                        ${this.tool.versions.map(
                          (version) => html`
                            <ecc-utils-design-select-item value=${version.id}>
                              <div
                                class="flex items-center justify-between w-full"
                              >
                                <span>${version.name || version.id}</span>
                              </div>
                            </ecc-utils-design-select-item>
                          `
                        )}
                      </ecc-utils-design-select-content>
                    </ecc-utils-design-select>
                  </div>
                `
              : ""}
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            ${selectedVersion?.is_production
              ? html`
                  <ecc-utils-design-badge
                    variant="default"
                    class="part:ml-2 part:text-xs"
                    >Production</ecc-utils-design-badge
                  >
                `
              : ""}
            ${this.tool.toolclass
              ? html`
                  <ecc-utils-design-badge variant="secondary">
                    ${this.tool.toolclass.name}
                  </ecc-utils-design-badge>
                `
              : ""}
            ${this.getAvailableDescriptorTypes().map(
              (type) => html`
                <ecc-utils-design-badge variant="outline">
                  ${type}
                </ecc-utils-design-badge>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }

  private getAvailableDescriptorTypes(): DescriptorType[] {
    if (!this.tool || !this.selectedVersion) return [];

    const version = this.tool.versions.find(
      (v) => v.id === this.selectedVersion
    );
    return version && version.descriptor_type ? version.descriptor_type : [];
  }

  static renderLoading() {
    return html`
      <div class="space-y-6">
        <!-- Tool header skeleton -->
        <div class="mb-6">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <ecc-utils-design-skeleton
                class="part:h-10 part:w-64"
              ></ecc-utils-design-skeleton>
              <div class="w-full md:w-auto">
                <ecc-utils-design-skeleton
                  class="part:h-10 part:w-full part:md:w-48"
                ></ecc-utils-design-skeleton>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-24"
              ></ecc-utils-design-skeleton>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-20"
              ></ecc-utils-design-skeleton>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-16"
              ></ecc-utils-design-skeleton>
            </div>
          </div>
        </div>

        <!-- Tabs skeleton -->
        <ecc-utils-design-skeleton
          class="part:h-10 part:w-full"
        ></ecc-utils-design-skeleton>

        <!-- Tab content skeleton -->
        <div class="mt-4">
          <div class="flex flex-col gap-4">
            <!-- Tool information section -->
            <div>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-48 part:mb-3"
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

            <ecc-utils-design-separator></ecc-utils-design-separator>

            <!-- Tool details section -->
            <div>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-48 part:mb-3"
              ></ecc-utils-design-skeleton>
              <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-32"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-48"
                  ></ecc-utils-design-skeleton>
                </div>
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex justify-between">
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-32"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-40"
                  ></ecc-utils-design-skeleton>
                </div>
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex justify-between">
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-32"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-56"
                  ></ecc-utils-design-skeleton>
                </div>
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex justify-between">
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-32"
                  ></ecc-utils-design-skeleton>
                  <ecc-utils-design-skeleton
                    class="part:h-4 part:w-36"
                  ></ecc-utils-design-skeleton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderOverviewTab() {
    if (!this.tool) return html``;

    const version = this.tool.versions.find(
      (v) => v.id === this.selectedVersion
    );

    return html`
      <div class="mt-4">
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">
            <div class="font-bold text-base">Tool Information</div>
            <div class="flex flex-col gap-3">
              <!-- Tool Information Section -->
              ${this.tool.description
                ? html`
                    <div>
                      ${this.tool.description
                        .split("\n")
                        .map((line) => html` <p>${line}</p> `)}
                    </div>
                  `
                : ""}
              <div>
                <dl class="flex flex-col gap-2">
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">ID</dt>
                    <dd class="font-mono">${this.tool.id}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Organization</dt>
                    <dd>${this.tool.organization || "Not specified"}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">URL</dt>
                    <dd>
                      <a
                        href="${this.tool.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline break-all"
                      >
                        ${this.tool.url}
                      </a>
                    </dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>

                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Checker Workflow</dt>
                    ${this.tool.has_checker
                      ? html`
                          <dd>
                            <a
                              href="${ifDefined(this.tool.checker_url)}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-primary hover:underline"
                            >
                              View Checker
                            </a>
                          </dd>
                        `
                      : html`
                          <span class="text-muted-foreground">
                            Not specified
                          </span>
                        `}
                  </div>
                </dl>
              </div>

              <ecc-utils-design-separator></ecc-utils-design-separator>
            </div>
          </div>

          <!-- Tool Aliases Section -->
          ${this.tool.aliases && this.tool.aliases.length > 0
            ? html`
                <div>
                  <h3 class="text-base font-medium mb-2">Aliases</h3>
                  <div class="flex flex-wrap gap-2">
                    ${this.tool.aliases.map(
                      (alias) => html`
                        <ecc-utils-design-badge variant="outline"
                          >${alias}</ecc-utils-design-badge
                        >
                      `
                    )}
                  </div>
                </div>
              `
            : ""}

          <!-- Active Version Information Section -->
          <div class="flex flex-col gap-3">
            <div class="font-bold text-base">Version Information</div>
            ${version
              ? html`
                  <div class="flex flex-col gap-3">
                    ${version.description
                      ? html`
                          <div>
                            ${version.description
                              .split("\n")
                              .map((line) => html` <p>${line}</p> `)}
                          </div>
                        `
                      : ""}
                    <div>
                      <dl class="flex flex-col gap-2">
                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">Version Name</dt>
                          <dd>${version.name || "Not specified"}</dd>
                        </div>
                        <ecc-utils-design-separator></ecc-utils-design-separator>
                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">Version ID</dt>
                          <dd class="font-mono">${version.id}</dd>
                        </div>
                        <ecc-utils-design-separator></ecc-utils-design-separator>

                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">Author(s)</dt>
                          ${version.author && version.author.length > 0
                            ? html` <dd>${version.author.join(", ")}</dd> `
                            : html`<dd class="text-muted-foreground">
                                Not specified
                              </dd>`}
                        </div>

                        <ecc-utils-design-separator></ecc-utils-design-separator>

                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">URL</dt>
                          <dd>
                            <a
                              href="${version.url}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-primary hover:underline break-all"
                            >
                              ${version.url}
                            </a>
                          </dd>
                        </div>
                        <ecc-utils-design-separator></ecc-utils-design-separator>

                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">Status</dt>
                          <dd class="flex items-center">
                            ${version.verified
                              ? html`
                                  <span
                                    class="text-green-500 flex items-center"
                                  >
                                    <svg
                                      class="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                      ></path>
                                    </svg>
                                    Verified
                                  </span>
                                `
                              : html`<span class="text-muted-foreground"
                                  >Not verified</span
                                >`}
                          </dd>
                        </div>
                        <ecc-utils-design-separator></ecc-utils-design-separator>
                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">
                            Supported Languages
                          </dt>
                          <dd class="flex flex-wrap gap-2">
                            ${version.descriptor_type &&
                            version.descriptor_type.length > 0
                              ? version.descriptor_type.map(
                                  (type) => html`
                                    <ecc-utils-design-badge variant="secondary"
                                      >${type}</ecc-utils-design-badge
                                    >
                                  `
                                )
                              : html`<span class="text-muted-foreground"
                                  >Not specified</span
                                >`}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                `
              : ""}
          </div>
        </div>
      </div>
    `;
  }

  private renderVersionsTab() {
    if (!this.tool || !this.tool.versions || this.tool.versions.length === 0) {
      return html`
        <div class="mt-4">
          <ecc-utils-design-card>
            <ecc-utils-design-card-content>
              <p class="text-muted-foreground">
                No versions available for this tool
              </p>
            </ecc-utils-design-card-content>
          </ecc-utils-design-card>
        </div>
      `;
    }

    return html`
      <div class="mt-4">
        <ecc-utils-design-table>
          <ecc-utils-design-table-header>
            <ecc-utils-design-table-row>
              <ecc-utils-design-table-head class="w-4/12"
                >Version</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-3/12"
                >Language(s)</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-3/12"
                >Author(s)</ecc-utils-design-table-head
              >
              <ecc-utils-design-table-head class="w-2/12"
                >Status</ecc-utils-design-table-head
              >
            </ecc-utils-design-table-row>
          </ecc-utils-design-table-header>
          <ecc-utils-design-table-body>
            ${this.tool.versions.map(
              (version) => html`
                <ecc-utils-design-table-row
                  class="${version.id === this.selectedVersion
                    ? "part:bg-primary/20"
                    : "part:hover:bg-muted part:cursor-pointer"}"
                  @click=${() => this.handleSetActiveVersion(version.id)}
                >
                  <ecc-utils-design-table-cell class="w-4/12">
                    <div class="flex flex-col w-full">
                      <div
                        class="flex items-center gap-2 justify-between w-full"
                      >
                        <span class="font-medium flex items-center gap-2">
                          <span>${version.name || version.id}</span>
                          ${version.is_production
                            ? html`
                                <ecc-utils-design-badge
                                  variant="default"
                                  size="sm"
                                  >Production</ecc-utils-design-badge
                                >
                              `
                            : ""}
                        </span>

                        <span class="text-xs text-muted-foreground"
                          >${version.meta_version}</span
                        >
                      </div>
                    </div>
                  </ecc-utils-design-table-cell>
                  <ecc-utils-design-table-cell class="w-3/12">
                    <div class="flex flex-wrap gap-1">
                      ${version.descriptor_type &&
                      version.descriptor_type.length > 0
                        ? version.descriptor_type.map(
                            (type) => html`
                              <ecc-utils-design-badge
                                variant="secondary"
                                size="sm"
                                >${type}</ecc-utils-design-badge
                              >
                            `
                          )
                        : html`<span class="text-xs text-muted-foreground"
                            >None specified</span
                          >`}
                    </div>
                  </ecc-utils-design-table-cell>
                  <ecc-utils-design-table-cell class="w-3/12">
                    ${version.author && version.author.length > 0
                      ? html`<span class="text-sm"
                          >${version.author.join(", ")}</span
                        >`
                      : html`<span class="text-xs text-muted-foreground"
                          >Not specified</span
                        >`}
                  </ecc-utils-design-table-cell>
                  <ecc-utils-design-table-cell class="w-2/12">
                    <div class="flex flex-col gap-1">
                      ${version.verified
                        ? html`
                            <span
                              class="text-green-500 flex items-center text-sm"
                            >
                              <svg
                                class="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                              Verified
                            </span>
                          `
                        : html`<span class="text-muted-foreground text-sm"
                            >Not verified</span
                          >`}
                    </div>
                  </ecc-utils-design-table-cell>
                </ecc-utils-design-table-row>
              `
            )}
          </ecc-utils-design-table-body>
        </ecc-utils-design-table>
      </div>
    `;
  }

  private renderFilesTab() {
    if (!this.tool || !this.selectedVersion) return html``;

    return html`
      <div class="mt-4">
        <div class="w-full flex items-start justify-between">
          <div class="w-full">Browse Files</div>
          <div
            class="flex items-center gap-2 text-sm w-full justify-end font-medium"
          >
            <ecc-utils-design-select
              @ecc-input-changed=${this.handleDescriptorTypeChange}
              value=${this.selectedDescriptorType}
            >
              <ecc-utils-design-select-trigger>
                <ecc-utils-design-select-value placeholder="Select language">
                  ${this.selectedDescriptorType || "Select language"}
                </ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>
              <ecc-utils-design-select-content>
                ${this.getAvailableDescriptorTypes().map(
                  (type) => html`
                    <ecc-utils-design-select-item value=${type}
                      >${type}</ecc-utils-design-select-item
                    >
                  `
                )}
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-4">
          <!-- Files List Section - 1/5 of screen -->
          <div class="col-span-5 md:col-span-1">
            ${this.toolFiles.length === 0
              ? html`<p class="text-muted-foreground">
                  No files available for ${this.selectedDescriptorType}
                </p>`
              : html`
                  <div class="space-y-1 max-h-[400px] overflow-y-auto">
                    ${this.toolFiles.map(
                      (file, index) => html`
                        <button
                          class="w-full text-left px-3 py-1 rounded-md text-sm ${this
                            .activeFileIndex === index
                            ? "bg-primary/30"
                            : "hover:bg-muted"}"
                          @click=${() => this.viewFileContent(index)}
                        >
                          <div class="flex items-center justify-between">
                            <span class="truncate">${file.path}</span>
                            ${file.file_type
                              ? html`
                                  <ecc-utils-design-badge
                                    variant="outline"
                                    class="ml-2"
                                    size="sm"
                                  >
                                    ${file.file_type}
                                  </ecc-utils-design-badge>
                                `
                              : ""}
                          </div>
                        </button>
                      `
                    )}
                  </div>
                `}
          </div>

          <!-- Mobile Separator -->
          <div class="block md:hidden col-span-5">
            <ecc-utils-design-separator
              orientation="horizontal"
              class="part:my-4"
            ></ecc-utils-design-separator>
          </div>

          <!-- File Content Section - 4/5 of screen -->
          <div
            class="col-span-5 md:col-span-4 md:border-l md:pl-4 md:border-muted w-full"
          >
            <div>
              <h3 class="text-sm font-medium mb-2">
                ${this.activeFileIndex >= 0 &&
                this.toolFiles[this.activeFileIndex]
                  ? this.toolFiles[this.activeFileIndex].path
                  : "File Content"}
              </h3>
              ${this.activeFileIndex >= 0 &&
              this.toolFiles[this.activeFileIndex]
                ? html`
                    <ecc-utils-design-code
                      value=${this.fileContents[
                        this.toolFiles[this.activeFileIndex].path
                      ] || "Loading file content..."}
                      extension=${ifDefined(
                        this.toolFiles[this.activeFileIndex].path
                          .split(".")
                          .pop()
                      )}
                      disabled
                      class="part:h-[500px]"
                    ></ecc-utils-design-code>
                  `
                : html`<p class="text-muted-foreground">
                    Select a file to view its content
                  </p>`}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private handleSetActiveVersion(versionId: string) {
    const previousVersion = this.selectedVersion;

    // Don't do anything if it's already the selected version
    if (versionId === previousVersion) return;

    this.selectedVersion = versionId;

    // Find the selected version object
    const version = this.tool?.versions.find(
      (v) => v.id === this.selectedVersion
    );

    // Update descriptor type if the current one is not available in the new version
    if (
      version &&
      version.descriptor_type &&
      !version.descriptor_type.includes(this.selectedDescriptorType) &&
      version.descriptor_type.length > 0
    ) {
      [this.selectedDescriptorType] = version.descriptor_type;
    }

    // Clear file content cache when changing versions
    this.fileContents = {};

    // Emit version change event
    this.dispatchEvent(
      new CustomEvent("ecc-tool-version-changed", {
        detail: {
          previousVersion,
          newVersion: versionId,
          version: version || null,
          toolId: this.toolId,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Reload tool files
    this.loadToolFiles();
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the TRS API or a custom provider.
        </div>
      `;
    }

    if (!this.toolId) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide a tool ID.
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          ${this.error}
        </div>
      `;
    }

    if (this.loading || !this.tool) {
      return ECCClientGa4ghTrsTool.renderLoading();
    }

    return html`
      <div class="space-y-4">
        ${this.renderToolHeader()}

        <ecc-utils-design-tabs
          default-value="overview"
          class="part:mb-6 part:w-full"
        >
          <ecc-utils-design-tabs-list class="part:w-full">
            <ecc-utils-design-tabs-trigger
              value="overview"
              class="part:flex-1 flex-1"
              >Overview</ecc-utils-design-tabs-trigger
            >
            <ecc-utils-design-tabs-trigger
              value="versions"
              class="part:flex-1 flex-1"
              >Versions</ecc-utils-design-tabs-trigger
            >
            <ecc-utils-design-tabs-trigger
              value="files"
              class="part:flex-1 flex-1"
              >Files</ecc-utils-design-tabs-trigger
            >
          </ecc-utils-design-tabs-list>

          <ecc-utils-design-tabs-content value="overview">
            ${this.renderOverviewTab()}
          </ecc-utils-design-tabs-content>

          <ecc-utils-design-tabs-content value="versions">
            ${this.renderVersionsTab()}
          </ecc-utils-design-tabs-content>

          <ecc-utils-design-tabs-content value="files">
            ${this.renderFilesTab()}
          </ecc-utils-design-tabs-content>
        </ecc-utils-design-tabs>
      </div>
    `;
  }
}

export default ECCClientGa4ghTrsTool;
