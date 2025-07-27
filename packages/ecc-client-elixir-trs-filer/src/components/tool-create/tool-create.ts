import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import JSZip from "@progress/jszip-esm";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import { RestTrsFilerProvider } from "../../providers/rest-trs-filer-provider.js";
import {
  TrsFilerProvider,
  ToolRegister,
  ToolClass,
  DescriptorType,
  ImageType,
  ImageDataRegister,
} from "../../providers/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/select/index.js";
import "@elixir-cloud/design/components/multi-select/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/textarea/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/code/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/checkbox/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";

// Add file type enums based on TRS API specs
type FileType =
  | "TEST_FILE"
  | "PRIMARY_DESCRIPTOR"
  | "SECONDARY_DESCRIPTOR"
  | "CONTAINERFILE"
  | "OTHER";

// Add UI file type that includes container image types for better UX
type UIFileType =
  | "TEST_FILE"
  | "PRIMARY_DESCRIPTOR"
  | "SECONDARY_DESCRIPTOR"
  | "Docker"
  | "Singularity"
  | "Conda"
  | "OTHER";

/**
 * @summary Component for creating new tools in TRS-Filer
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the TRS instance/gateway
 * @property {TrsProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-tool-created - Fired when a tool is successfully created (includes toolId, toolData, and success message)
 * @fires ecc-tool-create-failed - Fired when tool creation fails
 * @fires ecc-tool-create-validation-failed - Fired when there are validation errors during tool creation
 */
export class ECCClientElixirTrsToolCreate extends LitElement {
  static styles = [
    TailwindStyles,
    GlobalStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }

      .tabs-scroll-container {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* Internet Explorer 10+ */
      }

      .tabs-scroll-container::-webkit-scrollbar {
        display: none; /* WebKit */
      }
    `,
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ attribute: false, reflect: true }) provider?: TrsFilerProvider;

  @state() private toolClasses: ToolClass[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private success: string | null = null;

  // Form state
  @state() private formData: {
    name: string;
    organization: string;
    description: string;
    toolClassId: string;
    aliases: string[];
    checkerUrl: string;
    hasChecker: boolean;
    customToolId: string;
    useCustomId: boolean;
  } = {
    name: "",
    organization: "",
    description: "",
    toolClassId: "",
    aliases: [],
    checkerUrl: "",
    hasChecker: false,
    customToolId: "",
    useCustomId: false,
  };

  @state() private versions: {
    name: string;
    author: string[];
    descriptorTypes: DescriptorType[];
    isProduction: boolean;
    signed: boolean;
    verified: boolean;
    verifiedSource: string[];
    includedApps: string[];
    files: {
      path: string;
      fileType: FileType;
      uiFileType: UIFileType;
      content?: string;
      file?: File;
      checksumType: string;
      checksumValue: string;
      descriptorType?: DescriptorType;
      containerImageType?: ImageType;
    }[];
    images: ImageDataRegister[];
    customVersionId: string;
    useCustomVersionId: boolean;
  }[] = [
    {
      name: "",
      author: [],
      descriptorTypes: [],
      isProduction: false,
      signed: false,
      verified: false,
      verifiedSource: [],
      includedApps: [],
      files: [],
      images: [],
      customVersionId: "",
      useCustomVersionId: false,
    },
  ];

  private _provider: TrsFilerProvider | null = null;

  @state() private activeFileIndex: { [versionIndex: number]: number } = {};
  @state() private activeDescriptorType: {
    [versionIndex: number]: DescriptorType | "ALL";
  } = {};

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-validation-failed", {
          detail: {
            error:
              "Please provide either a base URL for the TRS API or a custom provider.",
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
      this._provider = new RestTrsFilerProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider) {
      await this.loadToolClasses();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has("baseUrl") && this.baseUrl) {
      this._provider = new RestTrsFilerProvider(this.baseUrl);
      this.loadToolClasses();
    }
  }

  private async loadToolClasses(): Promise<void> {
    if (!this._provider) return;

    try {
      this.toolClasses = await this._provider.getToolClasses();
    } catch (error) {
      console.error("Failed to load tool classes:", error);
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-failed", {
          detail: { error: "Failed to load tool classes" },
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

  private handleArrayInputChange(
    field: keyof typeof this.formData,
    value: string
  ): void {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    this.formData = { ...this.formData, [field]: array };
  }

  private handleVersionChange(index: number, field: string, value: any): void {
    const updatedVersions = [...this.versions];
    updatedVersions[index] = { ...updatedVersions[index], [field]: value };

    // Update useCustomVersionId based on customVersionId value
    if (field === "customVersionId") {
      updatedVersions[index].useCustomVersionId = Boolean(value);
    }

    this.versions = updatedVersions;
  }

  private addVersion(): void {
    this.versions = [
      ...this.versions,
      {
        name: "",
        author: [],
        descriptorTypes: [],
        isProduction: false,
        signed: false,
        verified: false,
        verifiedSource: [],
        includedApps: [],
        files: [],
        images: [],
        customVersionId: "",
        useCustomVersionId: false,
      },
    ];
  }

  private removeVersion(index: number): void {
    if (this.versions.length > 1) {
      this.versions = this.versions.filter((_, i) => i !== index);
    }
  }

  private addFileToVersion(versionIndex: number): void {
    const version = this.versions[versionIndex];
    const activeDescriptorType =
      this.activeDescriptorType[versionIndex] ||
      (version.descriptorTypes.length > 0 ? version.descriptorTypes[0] : null);

    if (!activeDescriptorType) {
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-validation-failed", {
          detail: {
            error: "Please select a descriptor type before adding files.",
          },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    const updatedVersions = [...this.versions];
    const descriptorType = activeDescriptorType as DescriptorType;
    let fileType: FileType = "PRIMARY_DESCRIPTOR";

    if (
      updatedVersions[versionIndex].files.find(
        (file) => file.fileType === "PRIMARY_DESCRIPTOR"
      )
    ) {
      fileType = "SECONDARY_DESCRIPTOR";
    }

    updatedVersions[versionIndex].files.push({
      path: "",
      fileType,
      uiFileType: fileType,
      content: "",
      checksumType: "sha256",
      checksumValue: "",
      descriptorType,
    });
    this.versions = updatedVersions;
  }

  private removeFileFromVersion(versionIndex: number, fileIndex: number): void {
    const updatedVersions = [...this.versions];
    updatedVersions[versionIndex].files = updatedVersions[
      versionIndex
    ].files.filter((_, i) => i !== fileIndex);
    this.versions = updatedVersions;
  }

  private handleFileUpload(
    versionIndex: number,
    fileIndex: number,
    event: Event
  ): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const updatedVersions = [...this.versions];
      updatedVersions[versionIndex].files[fileIndex].file = file;
      updatedVersions[versionIndex].files[fileIndex].path = file.name;

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        updatedVersions[versionIndex].files[fileIndex].content = e.target
          ?.result as string;
        this.versions = [...updatedVersions];
      };
      reader.readAsText(file);

      this.versions = updatedVersions;
    }
  }

  private handleBulkFileUpload(versionIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const { files } = input;
    if (files && files.length > 0) {
      const version = this.versions[versionIndex];
      const activeDescriptorType =
        this.activeDescriptorType[versionIndex] ||
        (version.descriptorTypes.length > 0
          ? version.descriptorTypes[0]
          : null);

      if (!activeDescriptorType) {
        this.dispatchEvent(
          new CustomEvent("ecc-tool-create-validation-failed", {
            detail: {
              error: "Please select a descriptor type before uploading files.",
            },
            bubbles: true,
            composed: true,
          })
        );
        input.value = "";
        return;
      }

      const updatedVersions = [...this.versions];
      const descriptorType = activeDescriptorType as DescriptorType;

      // Process each file
      Array.from(files).forEach((file) => {
        const defaultFileType = ECCClientElixirTrsToolCreate.getDefaultFileType(
          file.name
        );
        const uiFileType = ECCClientElixirTrsToolCreate.getUIFileType(
          file.name,
          defaultFileType
        );
        const containerImageType =
          defaultFileType === "CONTAINERFILE"
            ? ECCClientElixirTrsToolCreate.getContainerImageType(file.name)
            : undefined;

        const fileData = {
          path: file.name,
          fileType: defaultFileType,
          uiFileType,
          content: "",
          file,
          checksumType: "sha256",
          checksumValue: "",
          descriptorType,
          containerImageType,
        };

        // Add to files array
        updatedVersions[versionIndex].files.push(fileData);

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          // Use current state instead of stale reference
          const currentVersions = [...this.versions];
          const targetFileIndex = currentVersions[versionIndex].files.findIndex(
            (f) => f.file === file
          );

          if (
            targetFileIndex !== -1 &&
            currentVersions[versionIndex].files[targetFileIndex]
          ) {
            currentVersions[versionIndex].files[targetFileIndex].content = e
              .target?.result as string;
            this.versions = currentVersions;
          }
        };
        reader.readAsText(file);
      });

      this.versions = updatedVersions;

      // Clear the input
      input.value = "";
    }
  }

  private async handleZipFileUpload(
    versionIndex: number,
    event: Event
  ): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.name.toLowerCase().endsWith(".zip")) {
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-validation-failed", {
          detail: { error: "Please select a valid ZIP file" },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    const version = this.versions[versionIndex];
    const activeDescriptorType =
      this.activeDescriptorType[versionIndex] ||
      (version.descriptorTypes.length > 0 ? version.descriptorTypes[0] : null);

    if (!activeDescriptorType) {
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-validation-failed", {
          detail: {
            error:
              "Please select a descriptor type before uploading ZIP files.",
          },
          bubbles: true,
          composed: true,
        })
      );
      input.value = "";
      return;
    }

    try {
      this.loading = true;

      // Dynamically import JSZip
      const zip = new (JSZip as any)();
      const zipContent = await zip.loadAsync(file);

      const updatedVersions = [...this.versions];

      // Process each file in the ZIP
      const filePromises: Promise<void>[] = [];
      const descriptorType = activeDescriptorType as DescriptorType;

      zipContent.forEach((relativePath: string, zipEntry: any) => {
        // Skip directories
        if (zipEntry.dir) return;

        const promise = ECCClientElixirTrsToolCreate.extractFileFromZip(
          zipEntry,
          relativePath
        )
          .then((fileData) => {
            if (fileData) {
              const fileDataWithDescriptor = { ...fileData, descriptorType };
              updatedVersions[versionIndex].files.push(fileDataWithDescriptor);
            }
          })
          .catch((error) => {
            console.error(`Failed to extract file ${relativePath}:`, error);
          });

        filePromises.push(promise);
      });

      // Wait for all files to be processed
      await Promise.all(filePromises);

      this.versions = updatedVersions;

      // Clear the input
      input.value = "";
    } catch (error) {
      console.error("ZIP extraction error details:", error);
      console.error("Error type:", typeof error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : String(error)
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );

      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-failed", {
          detail: {
            error: `Failed to extract ZIP file: ${
              error instanceof Error ? error.message : "Unknown error"
            }. Please ensure it's a valid ZIP archive.`,
          },
          bubbles: true,
          composed: true,
        })
      );
    } finally {
      this.loading = false;
    }
  }

  static async extractFileFromZip(
    zipEntry: any,
    relativePath: string
  ): Promise<any | null> {
    try {
      // Determine if file should be treated as text or binary
      const isTextFile = ECCClientElixirTrsToolCreate.isTextFile(relativePath);

      let content: string;
      if (isTextFile) {
        content = await zipEntry.async("text");
      } else {
        // For binary files, convert to base64
        const arrayBuffer = await zipEntry.async("arraybuffer");
        const uint8Array = new Uint8Array(arrayBuffer);
        content = btoa(String.fromCharCode(...uint8Array));
      }

      const defaultFileType =
        ECCClientElixirTrsToolCreate.getDefaultFileType(relativePath);
      const uiFileType = ECCClientElixirTrsToolCreate.getUIFileType(
        relativePath,
        defaultFileType
      );
      const containerImageType =
        defaultFileType === "CONTAINERFILE"
          ? ECCClientElixirTrsToolCreate.getContainerImageType(relativePath)
          : undefined;

      const fileData = {
        path: relativePath,
        fileType: defaultFileType,
        uiFileType,
        content,
        file: undefined, // No actual File object for extracted files
        checksumType: "sha256",
        checksumValue: "",
        descriptorType: undefined, // Will be set by the calling method
        containerImageType,
      };

      return fileData;
    } catch (error) {
      console.error(`Error extracting file ${relativePath}:`, error);
      console.error(`Error details for ${relativePath}:`, {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace",
      });
      return null;
    }
  }

  static isTextFile(filename: string): boolean {
    const textExtensions = [
      "txt",
      "md",
      "json",
      "yml",
      "yaml",
      "xml",
      "html",
      "htm",
      "css",
      "js",
      "ts",
      "cwl",
      "wdl",
      "nf",
      "py",
      "r",
      "sh",
      "bash",
      "dockerfile",
      "def",
      "config",
      "conf",
      "ini",
      "log",
      "csv",
      "tsv",
      "sql",
      "graphql",
      "gql",
    ];

    const extension = filename.split(".").pop()?.toLowerCase();
    return (
      textExtensions.includes(extension || "") ||
      filename.toLowerCase().includes("readme") ||
      filename.toLowerCase().includes("license") ||
      filename.toLowerCase().includes("changelog")
    );
  }

  static getDefaultFileType(filename: string): FileType {
    const extension = filename.split(".").pop()?.toLowerCase();
    const basename = filename.toLowerCase();

    // Check for common descriptor files
    if (
      basename.includes("workflow") ||
      basename.includes("main") ||
      extension === "cwl" ||
      extension === "wdl" ||
      extension === "nf"
    ) {
      return "PRIMARY_DESCRIPTOR";
    }

    // Check for test files
    if (basename.includes("test") || basename.includes("example")) {
      return "TEST_FILE";
    }

    // Check for container files
    if (
      basename === "dockerfile" ||
      basename.includes("container") ||
      extension === "def"
    ) {
      return "CONTAINERFILE";
    }

    // Default to secondary descriptor for workflow-related files
    // Let users manually select PRIMARY_DESCRIPTOR
    if (
      basename.includes("workflow") ||
      basename.includes("main") ||
      extension === "cwl" ||
      extension === "wdl" ||
      extension === "nf" ||
      extension === "yml" ||
      extension === "yaml" ||
      extension === "json"
    ) {
      return "SECONDARY_DESCRIPTOR";
    }

    return "OTHER";
  }

  static getContainerImageType(filename: string): ImageType {
    const basename = filename.toLowerCase();
    const extension = filename.split(".").pop()?.toLowerCase();

    // Check for Singularity files
    if (
      basename === "singularity" ||
      basename.includes("singularity") ||
      extension === "def" ||
      extension === "sif" ||
      basename.includes(".def")
    ) {
      return "Singularity";
    }

    // Check for Conda files
    if (
      basename === "environment.yml" ||
      basename === "environment.yaml" ||
      basename === "conda.yml" ||
      basename === "conda.yaml" ||
      basename.includes("conda") ||
      basename.includes("environment")
    ) {
      return "Conda";
    }

    // Default to Docker for most container files
    // This includes Dockerfile, dockerfile, containerfile, etc.
    return "Docker";
  }

  static getFileExtension(filename: string): string {
    return filename.split(".").pop()?.toLowerCase() || "txt";
  }

  private handleFileFieldChange(
    versionIndex: number,
    fileIndex: number,
    field: string,
    value: any
  ): void {
    const updatedVersions = [...this.versions];
    updatedVersions[versionIndex].files[fileIndex] = {
      ...updatedVersions[versionIndex].files[fileIndex],
      [field]: value,
    };
    this.versions = updatedVersions;
  }

  private addImageToVersion(versionIndex: number): void {
    const updatedVersions = [...this.versions];
    updatedVersions[versionIndex].images.push({
      registry_host: "",
      image_name: "",
      image_type: "Docker",
      checksum: [],
    });
    this.versions = updatedVersions;
  }

  private removeImageFromVersion(
    versionIndex: number,
    imageIndex: number
  ): void {
    const updatedVersions = [...this.versions];
    updatedVersions[versionIndex].images = updatedVersions[
      versionIndex
    ].images.filter((_, i) => i !== imageIndex);
    this.versions = updatedVersions;
  }

  private async handleSubmit(): Promise<void> {
    if (!this._provider || !this._provider.createTool) {
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-failed", {
          detail: {
            error: "Tool creation is not supported by the current provider",
          },
          bubbles: true,
          composed: true,
        })
      );
      return;
    }

    this.loading = true;

    try {
      // Find the selected tool class
      const selectedToolClass = this.toolClasses.find(
        (tc) => tc.id === this.formData.toolClassId
      );
      if (!selectedToolClass) {
        throw new Error("Please select a valid tool class");
      }

      // Prepare tool data
      const toolData: ToolRegister = {
        name: this.formData.name || undefined,
        organization: this.formData.organization,
        description: this.formData.description || undefined,
        toolclass: {
          id: selectedToolClass.id,
          name: selectedToolClass.name,
          description: selectedToolClass.description,
        },
        aliases:
          this.formData.aliases.length > 0 ? this.formData.aliases : undefined,
        checker_url: this.formData.checkerUrl || undefined,
        has_checker: this.formData.hasChecker,
        versions: this.versions.map((version) => ({
          ...(version.useCustomVersionId && version.customVersionId
            ? { id: version.customVersionId }
            : {}),
          name: version.name || undefined,
          author: version.author.length > 0 ? version.author : undefined,
          descriptor_type:
            version.descriptorTypes.length > 0
              ? version.descriptorTypes
              : undefined,
          is_production: version.isProduction,
          signed: version.signed,
          verified: version.verified,
          verified_source:
            version.verifiedSource.length > 0
              ? version.verifiedSource
              : undefined,
          included_apps:
            version.includedApps.length > 0 ? version.includedApps : undefined,
          files:
            version.files.length > 0
              ? version.files.map((file) => ({
                  tool_file: {
                    path: file.path,
                    file_type: file.fileType,
                  },
                  file_wrapper: {
                    content: file.content || undefined,
                    checksum: file.checksumValue
                      ? [
                          {
                            type: file.checksumType,
                            checksum: file.checksumValue,
                          },
                        ]
                      : undefined,
                  },
                  type:
                    file.fileType === "CONTAINERFILE"
                      ? file.containerImageType ||
                        ECCClientElixirTrsToolCreate.getContainerImageType(
                          file.path
                        )
                      : file.descriptorType ||
                        version.descriptorTypes[0] ||
                        "CWL", // Use file's descriptor type or first version descriptor type as default
                }))
              : undefined,
          images: version.images.length > 0 ? version.images : undefined,
        })),
      };

      let toolId: string;
      if (this.formData.useCustomId && this.formData.customToolId) {
        toolId = await this._provider.createToolWithId!(
          this.formData.customToolId,
          toolData
        );
      } else {
        toolId = await this._provider.createTool(toolData);
      }

      const successMessage = `Tool created successfully with ID: ${toolId}`;

      // Emit success event with comprehensive data
      this.dispatchEvent(
        new CustomEvent("ecc-tool-created", {
          detail: { toolId, toolData, message: successMessage },
          bubbles: true,
          composed: true,
        })
      );

      // Reset form
      this.resetForm();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create tool";

      // Emit error event
      this.dispatchEvent(
        new CustomEvent("ecc-tool-create-failed", {
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
    this.formData = {
      name: "",
      organization: "",
      description: "",
      toolClassId: "",
      aliases: [],
      checkerUrl: "",
      hasChecker: false,
      customToolId: "",
      useCustomId: false,
    };
    this.versions = [
      {
        name: "",
        author: [],
        descriptorTypes: [],
        isProduction: false,
        signed: false,
        verified: false,
        verifiedSource: [],
        includedApps: [],
        files: [],
        images: [],
        customVersionId: "",
        useCustomVersionId: false,
      },
    ];
  }

  private renderBasicFields() {
    return html`
      <div class="grid gap-4">
        <!-- Tool Name, Organization, Tool Class in same row on desktop -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label for="tool-name" class="text-sm font-medium">
              Tool Name
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="tool-name"
              .value=${this.formData.name}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("name", e.detail.value)}
              placeholder="Enter a descriptive name for your tool"
              class="h-10"
            ></ecc-utils-design-input>
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label
              for="organization"
              class="text-sm font-medium"
            >
              Organization <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-input
              id="organization"
              .value=${this.formData.organization}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleInputChange("organization", e.detail.value)}
              placeholder="Enter your organization name"
              required
              class="h-10"
            ></ecc-utils-design-input>
          </div>

          <div class="grid gap-1">
            <ecc-utils-design-label
              for="tool-class"
              class="text-sm font-medium"
            >
              Tool Class <span class="text-destructive">*</span>
            </ecc-utils-design-label>
            <ecc-utils-design-select
              id="tool-class-select"
              .value=${this.formData.toolClassId}
              @ecc-input-changed=${(e: CustomEvent) => {
                this.handleInputChange("toolClassId", e.detail.value);
              }}
              required
            >
              <ecc-utils-design-select-trigger class="h-10">
                <ecc-utils-design-select-value
                  placeholder="Select a tool class"
                ></ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>

              <ecc-utils-design-select-content>
                <ecc-utils-design-select-item value="">
                  Select a tool class
                </ecc-utils-design-select-item>
                ${this.toolClasses.map(
                  (tc) => html`
                    <ecc-utils-design-select-item value=${tc.id}>
                      <div class="flex flex-col">
                        <span class="font-medium">${tc.name}</span>
                      </div>
                    </ecc-utils-design-select-item>
                  `
                )}
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
            placeholder="Provide a detailed description of what your tool does"
            rows="4"
            class="resize-none"
          ></ecc-utils-design-textarea>
        </div>
        ${this.renderAdvancedFields()}
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
                  Advance Configuration
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
              <!-- Tool Configuration in grid layout -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Custom Tool ID Section -->
                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="custom-tool-id"
                    class="text-sm font-medium h-6"
                  >
                    Custom Tool ID
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="custom-tool-id"
                    .value=${this.formData.customToolId}
                    @ecc-input-changed=${(e: CustomEvent) => {
                      this.handleInputChange("customToolId", e.detail.value);
                      this.handleInputChange(
                        "useCustomId",
                        Boolean(e.detail.value)
                      );
                    }}
                    placeholder="my-org/my-tool (optional)"
                    class="h-10"
                  ></ecc-utils-design-input>
                </div>

                <!-- Aliases Section -->
                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="aliases"
                    class="text-sm font-medium h-6"
                  >
                    Aliases
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="aliases"
                    .value=${this.formData.aliases.join(", ")}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.handleArrayInputChange("aliases", e.detail.value)}
                    placeholder="alias1, alias2, alias3"
                    class="h-10"
                  ></ecc-utils-design-input>
                </div>

                <!-- Checker Tool Section -->
                <div class="grid gap-2">
                  <ecc-utils-design-label
                    for="checker-url"
                    class="text-sm font-medium h-6"
                  >
                    Checker Tool URL
                  </ecc-utils-design-label>
                  <ecc-utils-design-input
                    id="checker-url"
                    .value=${this.formData.checkerUrl}
                    @ecc-input-changed=${(e: CustomEvent) => {
                      this.handleInputChange("checkerUrl", e.detail.value);
                      this.handleInputChange(
                        "hasChecker",
                        Boolean(e.detail.value)
                      );
                    }}
                    placeholder="https://example.com/checker-tool (optional)"
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

  private renderVersions() {
    return html`
      <div class="space-y-6">
        <ecc-utils-design-tabs default-value="version-0" class="part:w-full">
          <div class="flex items-center w-full">
            <div class="flex-1 overflow-x-auto tabs-scroll-container">
              <ecc-utils-design-tabs-list
                class="part:flex part:min-w-max part:justify-start"
              >
                ${this.versions.map(
                  (version, index) => html`
                    <ecc-utils-design-tabs-trigger
                      value="version-${index}"
                      class="part:relative part:flex-shrink-0"
                    >
                      <span>Version ${index + 1}</span>
                      ${version.name
                        ? html`<span class="text-xs text-muted-foreground ml-1"
                            >(${version.name})</span
                          >`
                        : ""}
                      ${this.versions.length > 1
                        ? html`
                            <ecc-utils-design-button
                              variant="ghost"
                              size="sm"
                              class="part:ml-2 part:h-4 part:w-4 part:p-0 part:hover:bg-destructive part:hover:text-destructive-foreground"
                              @click=${(e: Event) => {
                                e.stopPropagation();
                                this.removeVersion(index);
                              }}
                            >
                              <svg
                                class="w-3 h-3"
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
                        : ""}
                    </ecc-utils-design-tabs-trigger>
                  `
                )}
              </ecc-utils-design-tabs-list>
            </div>

            <ecc-utils-design-button
              @click=${this.addVersion}
              variant="outline"
              size="sm"
              class="ml-4 flex-shrink-0 part:h-10"
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
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Add Version
            </ecc-utils-design-button>
          </div>

          ${this.versions.map(
            (version, index) => html`
              <ecc-utils-design-tabs-content value="version-${index}">
                ${this.renderVersionContent(version, index)}
              </ecc-utils-design-tabs-content>
            `
          )}
        </ecc-utils-design-tabs>
      </div>
    `;
  }

  private renderVersionContent(version: any, index: number) {
    return html`
      <div class="flex flex-col gap-4 pt-4">
        <!-- Basic Version Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="grid gap-2">
            <ecc-utils-design-label class="text-sm font-medium h-6"
              >Version Name</ecc-utils-design-label
            >
            <ecc-utils-design-input
              .value=${version.name}
              @ecc-input-changed=${(e: CustomEvent) =>
                this.handleVersionChange(index, "name", e.detail.value)}
              placeholder="e.g., v1.0.0"
              class="h-10"
            ></ecc-utils-design-input>
          </div>

          <div class="grid gap-2">
            <ecc-utils-design-label class="text-sm font-medium h-6">
              Authors (comma-separated)
            </ecc-utils-design-label>
            <ecc-utils-design-input
              .value=${version.author.join(", ")}
              @ecc-input-changed=${(e: CustomEvent) => {
                const authors = e.detail.value
                  .split(",")
                  .map((a: string) => a.trim())
                  .filter((a: string) => a);
                this.handleVersionChange(index, "author", authors);
              }}
              placeholder="author1, author2"
              class="h-10"
            ></ecc-utils-design-input>
          </div>

          <!-- Descriptor Types Selection -->
          <div class="grid">
            <ecc-utils-design-label class="text-sm font-medium"
              >Supported Languages</ecc-utils-design-label
            >
            <ecc-utils-design-multi-select
              .value=${version.descriptorTypes}
              placeholder="Select supported languages..."
              @ecc-input-changed=${(e: CustomEvent) => {
                const updatedVersions = [...this.versions];
                const oldDescriptorTypes =
                  updatedVersions[index].descriptorTypes;
                const newDescriptorTypes = e.detail.value;

                // Update descriptor types
                updatedVersions[index].descriptorTypes = newDescriptorTypes;

                // Find removed descriptor types
                const removedDescriptorTypes = oldDescriptorTypes.filter(
                  (type: DescriptorType) => !newDescriptorTypes.includes(type)
                );

                // Remove files associated with removed descriptor types
                if (removedDescriptorTypes.length > 0) {
                  updatedVersions[index].files = updatedVersions[
                    index
                  ].files.filter(
                    (file: any) =>
                      !removedDescriptorTypes.includes(file.descriptorType)
                  );
                }

                // Update active descriptor type if it was removed
                const currentActiveDescriptor =
                  this.activeDescriptorType[index];
                if (
                  currentActiveDescriptor &&
                  removedDescriptorTypes.includes(
                    currentActiveDescriptor as DescriptorType
                  )
                ) {
                  this.activeDescriptorType = {
                    ...this.activeDescriptorType,
                    [index]:
                      newDescriptorTypes.length > 0
                        ? newDescriptorTypes[0]
                        : undefined,
                  };

                  // Reset active file index when descriptor type changes
                  this.activeFileIndex = {
                    ...this.activeFileIndex,
                    [index]: -1,
                  };
                }

                this.versions = updatedVersions;
              }}
              class="mt-2"
            >
              <ecc-utils-design-multi-select-trigger>
              </ecc-utils-design-multi-select-trigger>

              <ecc-utils-design-multi-select-content>
                <ecc-utils-design-multi-select-item value="CWL">
                  CWL (Common Workflow Language)
                </ecc-utils-design-multi-select-item>
                <ecc-utils-design-multi-select-item value="WDL">
                  WDL (Workflow Description Language)
                </ecc-utils-design-multi-select-item>
                <ecc-utils-design-multi-select-item value="NFL">
                  Nextflow
                </ecc-utils-design-multi-select-item>
                <ecc-utils-design-multi-select-item value="GALAXY">
                  Galaxy
                </ecc-utils-design-multi-select-item>
                <ecc-utils-design-multi-select-item value="SMK">
                  Snakemake
                </ecc-utils-design-multi-select-item>
              </ecc-utils-design-multi-select-content>
            </ecc-utils-design-multi-select>
          </div>
        </div>

        <!-- Advanced Version Options -->
        <div class="">
          <ecc-utils-design-collapsible>
            <ecc-utils-design-collapsible-trigger>
              <div
                class="flex items-center justify-between w-full py-2 text-left hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring rounded cursor-pointer transition-colors px-2"
              >
                <h4 class="text-sm font-medium text-muted-foreground">
                  Advance Version Configuration
                </h4>
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
                <!-- Tags and Custom Version ID in same row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="grid gap-1">
                    <ecc-utils-design-label class="text-sm font-medium h-6">
                      Tags
                    </ecc-utils-design-label>
                    <ecc-utils-design-multi-select
                      .value=${ECCClientElixirTrsToolCreate.getVersionTags(
                        version
                      )}
                      placeholder="Select tags..."
                      @ecc-input-changed=${(e: CustomEvent) => {
                        this.handleVersionTagsChange(index, e.detail.value);
                      }}
                    >
                      <ecc-utils-design-multi-select-trigger>
                      </ecc-utils-design-multi-select-trigger>

                      <ecc-utils-design-multi-select-content>
                        <ecc-utils-design-multi-select-item value="prod">
                          Production
                        </ecc-utils-design-multi-select-item>
                        <ecc-utils-design-multi-select-item value="verified">
                          Verified
                        </ecc-utils-design-multi-select-item>
                        <ecc-utils-design-multi-select-item value="signed">
                          Signed
                        </ecc-utils-design-multi-select-item>
                      </ecc-utils-design-multi-select-content>
                    </ecc-utils-design-multi-select>
                  </div>

                  <div class="grid gap-2">
                    <ecc-utils-design-label class="text-sm font-medium h-6">
                      Custom Version ID
                    </ecc-utils-design-label>
                    <ecc-utils-design-input
                      .value=${version.customVersionId}
                      @ecc-input-changed=${(e: CustomEvent) =>
                        this.handleVersionChange(
                          index,
                          "customVersionId",
                          e.detail.value
                        )}
                      placeholder="Enter custom version ID (optional)"
                      class="h-10"
                    ></ecc-utils-design-input>
                  </div>
                </div>
              </div>
            </ecc-utils-design-collapsible-content>
          </ecc-utils-design-collapsible>
        </div>

        <!-- Files Section -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <h4 class="text-base font-semibold">Files</h4>
            <div class="flex gap-2">
              <div class="relative">
                <input
                  type="file"
                  multiple
                  @change=${(e: Event) => this.handleBulkFileUpload(index, e)}
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="bulk-upload-${index}"
                  ?disabled=${version.descriptorTypes.length === 0}
                />
                <ecc-utils-design-button
                  variant="outline"
                  size="sm"
                  as="label"
                  for="bulk-upload-${index}"
                  .disabled=${version.descriptorTypes.length === 0}
                >
                  Upload Files
                </ecc-utils-design-button>
              </div>
              <div class="relative">
                <input
                  type="file"
                  accept=".zip"
                  @change=${(e: Event) => this.handleZipFileUpload(index, e)}
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="zip-upload-${index}"
                  ?disabled=${version.descriptorTypes.length === 0}
                />
                <ecc-utils-design-button
                  variant="outline"
                  size="sm"
                  as="label"
                  for="zip-upload-${index}"
                  .disabled=${version.descriptorTypes.length === 0}
                >
                  Upload ZIP
                </ecc-utils-design-button>
              </div>
              <ecc-utils-design-button
                @click=${() => this.addFileToVersion(index)}
                variant="outline"
                size="sm"
                .disabled=${version.descriptorTypes.length === 0}
              >
                Add File Manually
              </ecc-utils-design-button>
              ${version.descriptorTypes.length > 0
                ? html`
                    <div
                      class="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span
                        class="text-sm text-muted-foreground"
                        style="font-style: italic;"
                        >for:</span
                      >
                      <ecc-utils-design-select
                        .value=${this.activeDescriptorType[index] ||
                        version.descriptorTypes[0]}
                        @ecc-input-changed=${(e: CustomEvent) => {
                          this.activeDescriptorType = {
                            ...this.activeDescriptorType,
                            [index]: e.detail.value,
                          };

                          // Find the first file of the newly selected descriptor type and select it
                          if (e.detail.value) {
                            const filteredFiles = version.files.filter(
                              (file: any) =>
                                file.descriptorType === e.detail.value
                            );
                            if (filteredFiles.length > 0) {
                              // Find the original index of the first filtered file
                              const firstFileIndex = version.files.indexOf(
                                filteredFiles[0]
                              );
                              this.activeFileIndex = {
                                ...this.activeFileIndex,
                                [index]: firstFileIndex,
                              };
                            } else {
                              // No files for this descriptor type, clear selection
                              this.activeFileIndex = {
                                ...this.activeFileIndex,
                                [index]: -1,
                              };
                            }
                          } else {
                            // No descriptor type selected, clear selection
                            this.activeFileIndex = {
                              ...this.activeFileIndex,
                              [index]: -1,
                            };
                          }

                          this.requestUpdate();
                        }}
                        class="w-24"
                      >
                        <ecc-utils-design-select-trigger
                          class="part:text-sm part:h-8 part:w-24"
                        >
                          <ecc-utils-design-select-value></ecc-utils-design-select-value>
                        </ecc-utils-design-select-trigger>
                        <ecc-utils-design-select-content
                          class="part:text-sm part:w-24 part:min-w-24"
                        >
                          ${version.descriptorTypes.map(
                            (descriptorType: DescriptorType) => html`
                              <ecc-utils-design-select-item
                                value=${descriptorType}
                                class="part:text-sm"
                              >
                                ${descriptorType}
                              </ecc-utils-design-select-item>
                            `
                          )}
                        </ecc-utils-design-select-content>
                      </ecc-utils-design-select>
                    </div>
                  `
                : ``}
            </div>
          </div>

          <!-- Language Filter Section -->

          ${version.files.length === 0
            ? html`<p class="text-gray-500 text-sm">
                ${version.descriptorTypes.length > 0
                  ? "No files added yet. Upload files or add them manually."
                  : "Select a language this version supports to upload and manage files."}
              </p>`
            : this.renderFilesLayout(index, version.files)}
        </div>
      </div>
    `;
  }

  private renderFilesLayout(versionIndex: number, files: any[]) {
    // Get the current version to access descriptor types
    const version = this.versions[versionIndex];

    // Filter files based on selected descriptor type, using first descriptor type as default
    const activeDescriptor =
      this.activeDescriptorType[versionIndex] ||
      (version.descriptorTypes.length > 0 ? version.descriptorTypes[0] : null);

    if (!activeDescriptor) {
      return html`
        <div class="text-center py-8 text-gray-500">
          <p>Please select a descriptor type to view and manage files</p>
          <p class="text-sm">
            Files will be filtered by the selected descriptor type
          </p>
        </div>
      `;
    }

    const filteredFiles = files.filter(
      (file) => file.descriptorType === activeDescriptor
    );

    return html`
      <div class="grid grid-cols-5 gap-4">
        <!-- Files List Section - 1/5 of screen -->
        <div class="col-span-5 md:col-span-1">
          <div class="space-y-1 max-h-[400px] overflow-y-auto">
            ${filteredFiles.map((file: any) => {
              const originalIndex = files.indexOf(file);
              return html`
                <ecc-utils-design-button
                  variant="ghost"
                  type="button"
                  class="part:h-8 part:w-full part:text-left part:px-3 part:py-1 part:rounded-md part:text-sm part:flex part:items-center part:justify-between ${this
                    .activeFileIndex[versionIndex] === originalIndex
                    ? "part:bg-primary/10"
                    : "part:hover:bg-muted"}"
                  @click=${() => {
                    this.activeFileIndex = {
                      ...this.activeFileIndex,
                      [versionIndex]: originalIndex,
                    };
                    this.requestUpdate();
                  }}
                >
                  <span class="truncate">
                    ${file.path || `File ${originalIndex + 1}`}
                    ${file.uiFileType
                      ? html`<span class="text-xs text-muted-foreground ml-1"
                          >(${file.uiFileType})</span
                        >`
                      : ""}
                  </span>
                  <ecc-utils-design-button
                    type="button"
                    variant="ghost"
                    class="part:h-8 part:w-8 part:text-left part:px-3 part:py-1 part:rounded-md part:text-sm part:flex part:items-center part:justify-between"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this.removeFileFromVersion(versionIndex, originalIndex);
                    }}
                  >
                    ×
                  </ecc-utils-design-button>
                </ecc-utils-design-button>
              `;
            })}
          </div>
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
          ${this.renderFileContentArea(versionIndex, files)}
        </div>
      </div>
    `;
  }

  private renderFileContentArea(versionIndex: number, files: any[]) {
    const activeIndex = this.activeFileIndex[versionIndex] ?? 0;
    const activeFile = files[activeIndex];

    if (!activeFile) {
      return html`
        <div class="text-center py-8 text-gray-500">
          <p>No files available</p>
          <p class="text-sm">Add files to see content preview</p>
        </div>
      `;
    }

    // Check if any other file in this version has PRIMARY_DESCRIPTOR selected
    // but only for the same descriptor type (since different descriptor types can have their own PRIMARY_DESCRIPTOR)
    const otherFileHasPrimaryDescriptor = files.some(
      (file, index) =>
        index !== activeIndex &&
        file.uiFileType === "PRIMARY_DESCRIPTOR" &&
        file.descriptorType === activeFile.descriptorType
    );

    const checksumTypes = ["sha256", "sha1", "md5"];

    return html`
      <div class="space-y-4">
        <!-- File Configuration -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <ecc-utils-design-label>File Path</ecc-utils-design-label>
            <ecc-utils-design-input
              .value=${activeFile.path}
              @ecc-input-changed=${(e: CustomEvent) => {
                this.handleFileFieldChange(
                  versionIndex,
                  activeIndex,
                  "path",
                  e.detail.value
                );
              }}
              placeholder="e.g., Readme.md"
            ></ecc-utils-design-input>
          </div>

          <div>
            <ecc-utils-design-label>File Type</ecc-utils-design-label>
            <ecc-utils-design-select
              .value=${activeFile.uiFileType}
              @ecc-input-changed=${(e: CustomEvent) => {
                const newUIFileType = e.detail.value as UIFileType;
                const newFileType =
                  ECCClientElixirTrsToolCreate.convertUIFileTypeToFileType(
                    newUIFileType
                  );
                const newContainerImageType =
                  ECCClientElixirTrsToolCreate.convertUIFileTypeToImageType(
                    newUIFileType
                  );

                // Update multiple fields at once
                this.handleFileFieldChange(
                  versionIndex,
                  activeIndex,
                  "uiFileType",
                  newUIFileType
                );
                this.handleFileFieldChange(
                  versionIndex,
                  activeIndex,
                  "fileType",
                  newFileType
                );
                if (newContainerImageType) {
                  this.handleFileFieldChange(
                    versionIndex,
                    activeIndex,
                    "containerImageType",
                    newContainerImageType
                  );
                } else {
                  this.handleFileFieldChange(
                    versionIndex,
                    activeIndex,
                    "containerImageType",
                    undefined
                  );
                }
              }}
            >
              <ecc-utils-design-select-trigger>
                <ecc-utils-design-select-value></ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>
              <ecc-utils-design-select-content>
                <!-- Source Files Group -->
                <ecc-utils-design-select-group>
                  <ecc-utils-design-select-label
                    >Source file</ecc-utils-design-select-label
                  >
                  <ecc-utils-design-select-item
                    value="PRIMARY_DESCRIPTOR"
                    .disabled=${otherFileHasPrimaryDescriptor &&
                    activeFile.uiFileType !== "PRIMARY_DESCRIPTOR"}
                  >
                    Primary Descriptor
                  </ecc-utils-design-select-item>
                  <ecc-utils-design-select-item value="SECONDARY_DESCRIPTOR">
                    Secondary Descriptor
                  </ecc-utils-design-select-item>
                  <ecc-utils-design-select-item value="TEST_FILE">
                    Test File
                  </ecc-utils-design-select-item>
                  <ecc-utils-design-select-item value="OTHER">
                    Other
                  </ecc-utils-design-select-item>
                </ecc-utils-design-select-group>

                <ecc-utils-design-select-separator></ecc-utils-design-select-separator>

                <!-- Image Files Group -->
                <ecc-utils-design-select-group>
                  <ecc-utils-design-select-label
                    >Image file</ecc-utils-design-select-label
                  >
                  <ecc-utils-design-select-item value="Docker">
                    Docker
                  </ecc-utils-design-select-item>
                  <ecc-utils-design-select-item value="Singularity">
                    Singularity
                  </ecc-utils-design-select-item>
                  <ecc-utils-design-select-item value="Conda">
                    Conda
                  </ecc-utils-design-select-item>
                </ecc-utils-design-select-group>
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>

          <div>
            <ecc-utils-design-label>Checksum Type</ecc-utils-design-label>
            <ecc-utils-design-select
              .value=${activeFile.checksumType}
              @ecc-input-changed=${(e: CustomEvent) => {
                this.handleFileFieldChange(
                  versionIndex,
                  activeIndex,
                  "checksumType",
                  e.detail.value
                );
              }}
            >
              <ecc-utils-design-select-trigger>
                <ecc-utils-design-select-value></ecc-utils-design-select-value>
              </ecc-utils-design-select-trigger>
              <ecc-utils-design-select-content>
                ${checksumTypes.map(
                  (type) => html`
                    <ecc-utils-design-select-item value=${type}>
                      ${type.toUpperCase()}
                    </ecc-utils-design-select-item>
                  `
                )}
              </ecc-utils-design-select-content>
            </ecc-utils-design-select>
          </div>

          <div>
            <ecc-utils-design-label
              >Checksum Value (optional)</ecc-utils-design-label
            >
            <ecc-utils-design-input
              .value=${activeFile.checksumValue}
              @ecc-input-changed=${(e: CustomEvent) => {
                this.handleFileFieldChange(
                  versionIndex,
                  activeIndex,
                  "checksumValue",
                  e.detail.value
                );
              }}
              placeholder="Enter checksum value"
            ></ecc-utils-design-input>
          </div>
        </div>

        <!-- File Content -->
        <div class="space-y-2">
          <ecc-utils-design-label>File Content</ecc-utils-design-label>

          ${activeFile.content !== undefined
            ? html`
                <ecc-utils-design-code
                  value=${activeFile.content}
                  extension=${ECCClientElixirTrsToolCreate.getFileExtension(
                    activeFile.path
                  )}
                  @ecc-input-changed=${(e: CustomEvent) => {
                    this.handleFileFieldChange(
                      versionIndex,
                      activeIndex,
                      "content",
                      e.detail.value
                    );
                  }}
                  class="part:h-[500px]"
                ></ecc-utils-design-code>
              `
            : html`
                <div
                  class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"
                >
                  <p>No content available</p>
                  <p class="text-sm">This file was not uploaded with content</p>
                </div>
              `}
        </div>
      </div>
    `;
  }

  static getVersionTags(version: any): string[] {
    const tags: string[] = [];
    if (version.isProduction) tags.push("prod");
    if (version.verified) tags.push("verified");
    if (version.signed) tags.push("signed");
    return tags;
  }

  private handleVersionTagsChange(index: number, tags: string[]): void {
    const updatedVersions = [...this.versions];
    updatedVersions[index] = {
      ...updatedVersions[index],
      isProduction: tags.includes("prod"),
      verified: tags.includes("verified"),
      signed: tags.includes("signed"),
    };
    this.versions = updatedVersions;
  }

  static getUIFileType(filename: string, fileType: FileType): UIFileType {
    if (fileType === "CONTAINERFILE") {
      return ECCClientElixirTrsToolCreate.getContainerImageType(filename);
    }
    return fileType as UIFileType;
  }

  static convertUIFileTypeToFileType(uiFileType: UIFileType): FileType {
    if (
      uiFileType === "Docker" ||
      uiFileType === "Singularity" ||
      uiFileType === "Conda"
    ) {
      return "CONTAINERFILE";
    }
    return uiFileType as FileType;
  }

  static convertUIFileTypeToImageType(
    uiFileType: UIFileType
  ): ImageType | undefined {
    if (
      uiFileType === "Docker" ||
      uiFileType === "Singularity" ||
      uiFileType === "Conda"
    ) {
      return uiFileType as ImageType;
    }
    return undefined;
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
          <div class="space-y-4">
            ${this.renderBasicFields()} ${this.renderVersions()}
          </div>

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
                !this.formData.organization ||
                !this.formData.toolClassId}
              >
                ${this.loading ? "Creating..." : "Create"}
              </ecc-utils-design-button>
            </div>
          </div>
        </form>
      </div>
    `;
  }
}

export default ECCClientElixirTrsToolCreate;
