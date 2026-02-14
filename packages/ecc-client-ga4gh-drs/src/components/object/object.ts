import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  DrsProvider,
  DrsObject,
  AccessURL,
} from "../../providers/drs-provider.js";
import { RestDrsProvider } from "../../providers/rest-drs-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/card/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";

/**
 * @summary This component displays a single DRS object with details.
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the DRS instance/gateway
 * @property {string} objectId - ID of the object to display
 * @property {boolean} expand - Whether to expand bundle contents
 * @property {DrsProvider} provider - Custom data provider (optional, overrides baseUrl)
 */
export class ECCClientGa4ghDrsObject extends LitElement {
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
  @property({ type: String, reflect: true }) objectId = "";
  @property({ type: Boolean, reflect: true }) expand = false;
  @property({ attribute: false }) provider?: DrsProvider;

  @state() private object: DrsObject | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;
  @state() private accessUrls: { [accessId: string]: AccessURL } = {};
  @state() private loadingAccess: { [accessId: string]: boolean } = {};

  private _provider: DrsProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the DRS API or a custom provider.";
      return;
    }

    if (!this.objectId) {
      this.error = "Please provide an object ID.";
      return;
    }

    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestDrsProvider(this.baseUrl);
    } else {
      this._provider = null;
    }

    if (this._provider && this.objectId) {
      await this.loadObjectData();
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
        if (this.objectId) {
          this.loadObjectData();
        }
      }
      return;
    }

    if (changedProperties.has("baseUrl") && !this.provider) {
      if (!this.baseUrl) {
        this.error =
          "Please provide either a base URL for the DRS API or a custom provider.";
        return;
      }
      this._provider = new RestDrsProvider(this.baseUrl);
      if (this.objectId) {
        this.loadObjectData();
      }
      return;
    }

    if (changedProperties.has("objectId") && this._provider) {
      if (!this.objectId) {
        this.error = "Please provide an object ID.";
        return;
      }
      this.loadObjectData();
    }

    if (changedProperties.has("expand") && this._provider && this.objectId) {
      this.loadObjectData();
    }
  }

  private async loadObjectData(): Promise<void> {
    if (!this._provider || !this.objectId) return;

    this.loading = true;
    this.error = null;

    try {
      const object = await this._provider.getObject(this.objectId, this.expand);
      this.object = object;
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to load object";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghDrsObject.loadObjectData",
      });
    } finally {
      this.loading = false;
    }
  }

  private async getAccessURL(accessId: string): Promise<void> {
    if (!this._provider || !this.objectId || this.accessUrls[accessId]) return;

    this.loadingAccess = { ...this.loadingAccess, [accessId]: true };

    try {
      const accessUrl = await this._provider.getAccessURL(
        this.objectId,
        accessId
      );
      this.accessUrls = { ...this.accessUrls, [accessId]: accessUrl };
    } catch (err) {
      console.error("Failed to get access URL:", err);
    } finally {
      this.loadingAccess = { ...this.loadingAccess, [accessId]: false };
    }
  }

  private renderObjectHeader() {
    if (!this.object) return html``;

    // const objectType =
    //   this.object.contents && this.object.contents.length > 0
    //     ? "Bundle"
    //     : "Blob";
    // const objectTypeVariant = objectType === "Bundle" ? "default" : "secondary";

    return html`
      <div class="mb-6">
        <div class="w-full flex flex-col gap-3">
          <div
            class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between"
          >
            <div class="flex flex-col gap-2">
              <div class="flex flex-col md:flex-row md:items-center gap-2">
                <h2 class="text-xl truncate">
                  ${this.object.name || this.object.id}
                </h2>
              </div>

              <div class="flex flex-wrap gap-2 items-center">
                ${this.object.mime_type
                  ? html`
                      <ecc-utils-design-badge variant="outline">
                        ${this.object.mime_type}
                      </ecc-utils-design-badge>
                    `
                  : ""}
              </div>
            </div>

            <div
              class="flex flex-row flex-wrap items-center gap-4 text-xs text-muted-foreground md:justify-end"
            >
              <div class="flex items-center gap-1.5">
                <svg
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path>
                  <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path>
                </svg>
                <span>
                  Size
                  ${ECCClientGa4ghDrsObject.formatFileSize(this.object.size)}
                </span>
              </div>
              <div class="flex items-center gap-1.5">
                <svg
                  class="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <span>
                  Created
                  ${ECCClientGa4ghDrsObject.formatShortDate(
                    this.object.created_time
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static renderLoading() {
    return html`
      <div class="space-y-6">
        <!-- Object header skeleton -->
        <div class="mb-6">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <ecc-utils-design-skeleton
                class="part:h-10 part:w-64"
              ></ecc-utils-design-skeleton>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-16"
              ></ecc-utils-design-skeleton>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-24"
              ></ecc-utils-design-skeleton>
              <ecc-utils-design-skeleton
                class="part:h-6 part:w-20"
              ></ecc-utils-design-skeleton>
            </div>
          </div>
        </div>

        <!-- Tabs skeleton -->
        <ecc-utils-design-skeleton
          class="part:h-10 part:w-full"
        ></ecc-utils-design-skeleton>

        <!-- Content skeleton -->
        <div class="mt-4">
          <div class="flex flex-col gap-4">
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
          </div>
        </div>
      </div>
    `;
  }

  private renderOverviewTab() {
    if (!this.object) return html``;

    return html`
      <div class="mt-4">
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">
            <div class="font-bold text-base">Dataset Information</div>
            <div class="flex flex-col gap-3">
              ${this.object.description
                ? html`
                    <div>
                      ${this.object.description
                        .split("\n")
                        .map((line) => html` <p>${line}</p> `)}
                    </div>
                  `
                : ""}
              <div>
                <dl class="flex flex-col gap-2">
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">ID</dt>
                    <dd class="font-mono">${this.object.id}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Size</dt>
                    <dd>
                      ${ECCClientGa4ghDrsObject.formatFileSize(
                        this.object.size
                      )}
                    </dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Created</dt>
                    <dd>
                      ${ECCClientGa4ghDrsObject.formatDate(
                        this.object.created_time
                      )}
                    </dd>
                  </div>
                  ${this.object.updated_time
                    ? html`
                        <ecc-utils-design-separator></ecc-utils-design-separator>
                        <div class="flex flex-row gap-2 w-full justify-between">
                          <dt class="text-muted-foreground">Updated</dt>
                          <dd>
                            ${ECCClientGa4ghDrsObject.formatDate(
                              this.object.updated_time
                            )}
                          </dd>
                        </div>
                      `
                    : ""}
                </dl>
              </div>
            </div>
          </div>

          <!-- Checksums Section -->
          ${this.object.checksums && this.object.checksums.length > 0
            ? html`
                <div>
                  <h3 class="text-base font-medium mb-2">Checksums</h3>
                  <div class="flex flex-col gap-2">
                    ${this.object.checksums.map(
                      (checksum) => html`
                        <div
                          class="flex justify-between items-center p-2 bg-muted rounded"
                        >
                          <span class="font-medium"
                            >${checksum.type.toUpperCase()}</span
                          >
                          <span class="font-mono text-sm break-all"
                            >${checksum.checksum}</span
                          >
                        </div>
                      `
                    )}
                  </div>
                </div>
              `
            : ""}

          <!-- Aliases Section -->
          ${this.object.aliases && this.object.aliases.length > 0
            ? html`
                <div>
                  <h3 class="text-base font-medium mb-2">Aliases</h3>
                  <div class="flex flex-wrap gap-2">
                    ${this.object.aliases.map(
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
        </div>
      </div>
    `;
  }

  private renderContentsTab() {
    if (!this.object) return html``;

    const { object } = this; // Fix for TypeScript null checks
    const hasContents = object.contents && object.contents.length > 0;
    const hasAccessMethods =
      object.access_methods && object.access_methods.length > 0;

    return html`
      <div class="mt-4 space-y-6">
        <!-- Access Methods Section -->
        ${hasAccessMethods
          ? html`
              <div>
                <h3 class="text-lg font-semibold mb-4">Access Methods</h3>
                <div class="space-y-4">
                  ${object.access_methods!.map(
                    (method) => html`
                      <ecc-utils-design-card>
                        <ecc-utils-design-card-content>
                          <div class="flex flex-col gap-4">
                            <div class="flex justify-between items-center">
                              <div class="flex items-center gap-2">
                                <ecc-utils-design-badge variant="default">
                                  ${method.type.toUpperCase()}
                                </ecc-utils-design-badge>
                                ${method.region
                                  ? html`
                                      <ecc-utils-design-badge variant="outline">
                                        ${method.region}
                                      </ecc-utils-design-badge>
                                    `
                                  : ""}
                              </div>
                            </div>

                            ${method.access_url
                              ? html`
                                  <div>
                                    <strong>Direct URL:</strong>
                                    <div
                                      class="mt-1 p-2 bg-muted rounded font-mono text-sm break-all"
                                    >
                                      <a
                                        href="${method.access_url.url}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-primary hover:underline"
                                      >
                                        ${method.access_url.url}
                                      </a>
                                    </div>
                                    ${method.access_url.headers &&
                                    method.access_url.headers.length > 0
                                      ? html`
                                          <div class="mt-2">
                                            <strong>Headers:</strong>
                                            <ul class="mt-1 text-sm">
                                              ${method.access_url.headers.map(
                                                (header) =>
                                                  html`<li class="font-mono">
                                                    ${header}
                                                  </li>`
                                              )}
                                            </ul>
                                          </div>
                                        `
                                      : ""}
                                  </div>
                                `
                              : ""}
                            ${method.access_id
                              ? html`
                                  <div>
                                    <strong>Access ID:</strong>
                                    <div class="mt-1 flex gap-2 items-center">
                                      <span class="font-mono text-sm"
                                        >${method.access_id}</span
                                      >
                                      <ecc-utils-design-button
                                        size="sm"
                                        variant="outline"
                                        ?disabled=${this.loadingAccess[
                                          method.access_id
                                        ]}
                                        @click=${() =>
                                          this.getAccessURL(method.access_id!)}
                                      >
                                        ${this.loadingAccess[method.access_id]
                                          ? "Loading..."
                                          : "Get Access URL"}
                                      </ecc-utils-design-button>
                                    </div>
                                    ${this.accessUrls[method.access_id]
                                      ? html`
                                          <div
                                            class="mt-2 p-2 bg-muted rounded"
                                          >
                                            <strong>Access URL:</strong>
                                            <div
                                              class="mt-1 font-mono text-sm break-all"
                                            >
                                              <a
                                                href="${this.accessUrls[
                                                  method.access_id
                                                ].url}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="text-primary hover:underline"
                                              >
                                                ${this.accessUrls[
                                                  method.access_id
                                                ].url}
                                              </a>
                                            </div>
                                          </div>
                                        `
                                      : ""}
                                  </div>
                                `
                              : ""}
                          </div>
                        </ecc-utils-design-card-content>
                      </ecc-utils-design-card>
                    `
                  )}
                </div>
              </div>
            `
          : html`
              <div>
                <h3 class="text-lg font-semibold mb-4">Access Methods</h3>
                <ecc-utils-design-card>
                  <ecc-utils-design-card-content>
                    <p class="text-muted-foreground">
                      No access methods available for this object
                    </p>
                  </ecc-utils-design-card-content>
                </ecc-utils-design-card>
              </div>
            `}

        <!-- Bundle Contents Section -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Bundle Contents</h3>
          ${hasContents
            ? html`
                <ecc-utils-design-card>
                  <ecc-utils-design-card-content>
                    <div class="font-mono text-sm space-y-1">
                      ${object.contents!.map((content) =>
                        this.renderContentItem(content, 0)
                      )}
                    </div>
                  </ecc-utils-design-card-content>
                </ecc-utils-design-card>
              `
            : html`
                <ecc-utils-design-card>
                  <ecc-utils-design-card-content>
                    <p class="text-muted-foreground">
                      This object does not contain any bundle contents
                    </p>
                  </ecc-utils-design-card-content>
                </ecc-utils-design-card>
              `}
        </div>
      </div>
    `;
  }

  private renderContentItem(content: any, depth: number): any {
    const hasChildren = content.contents && content.contents.length > 0;

    return html`
      <div>
        <div class="py-1" style="padding-left: ${depth * 16}px;">
          ${content.name}
          ${content.id
            ? html`<span class="text-muted-foreground ml-2"
                >(${content.id})</span
              >`
            : ""}
        </div>
        ${hasChildren
          ? html`${content.contents.map((child: any) =>
              this.renderContentItem(child, depth + 1)
            )}`
          : ""}
      </div>
    `;
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
  }

  private static formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  }

  private static formatShortDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
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

    if (!this.objectId) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide an object ID.
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

    if (this.loading || !this.object) {
      return ECCClientGa4ghDrsObject.renderLoading();
    }

    return html`
      <div class="space-y-4">
        ${this.renderObjectHeader()}

        <ecc-utils-design-tabs
          default-value="contents"
          class="part:mb-6 part:w-full"
        >
          <ecc-utils-design-tabs-list class="part:w-full">
            <ecc-utils-design-tabs-trigger
              value="contents"
              class="part:flex-1 flex-1"
              >Contents</ecc-utils-design-tabs-trigger
            >
            <ecc-utils-design-tabs-trigger
              value="details"
              class="part:flex-1 flex-1"
              >Details</ecc-utils-design-tabs-trigger
            >
          </ecc-utils-design-tabs-list>

          <ecc-utils-design-tabs-content value="contents">
            <slot name="contents"> ${this.renderContentsTab()} </slot>
          </ecc-utils-design-tabs-content>

          <ecc-utils-design-tabs-content value="details">
            ${this.renderOverviewTab()}
          </ecc-utils-design-tabs-content>
        </ecc-utils-design-tabs>
      </div>
    `;
  }
}

export default ECCClientGa4ghDrsObject;
