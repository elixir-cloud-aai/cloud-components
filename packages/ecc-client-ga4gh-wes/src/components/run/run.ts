import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  WesProvider,
  RunLog,
  State,
  Log,
} from "../../providers/wes-provider.js";
import { RestWesProvider } from "../../providers/rest-wes-provider.js";
import "@elixir-cloud/design/components/table/index.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/card/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/code/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";

/**
 * @summary Displays details of a single workflow run.
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the WES instance.
 * @property {string} runId - The ID of the workflow run to display.
 * @property {WesProvider} provider - Custom data provider (optional, overrides baseUrl).
 *
 * @fires ecc-run-log-changed - Fired when the run log data is loaded.
 */
export class ECCClientGa4ghWesRun extends LitElement {
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
  @property({ type: String, reflect: true }) runId = "";
  @property({ attribute: false }) provider?: WesProvider;

  @state() private run: RunLog | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;

  private _provider: WesProvider | null = null;

  protected async firstUpdated(): Promise<void> {
    if (!this.baseUrl && !this.provider) {
      this.error =
        "Please provide either a base URL for the WES API or a custom provider.";
      return;
    }

    if (!this.runId) {
      this.error = "Please provide a run ID.";
      return;
    }

    this.initializeProvider();
    if (this._provider && this.runId) {
      await this.loadRunData();
    }
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    // Handle provider changes
    if (changedProperties.has("provider")) {
      if (!this.provider && !this.baseUrl) {
        this.error =
          "Please provide either a base URL for the WES API or a custom provider.";
        return;
      }
      // Only update provider if it's actually different
      if (this.provider !== this._provider) {
        this._provider = this.provider || null;
        if (this.runId) {
          this.loadRunData();
        }
      }
      return;
    }

    // Handle baseUrl changes
    if (changedProperties.has("baseUrl") && !this.provider) {
      if (!this.baseUrl) {
        this.error =
          "Please provide either a base URL for the WES API or a custom provider.";
        return;
      }
      this._provider = new RestWesProvider(this.baseUrl);
      if (this.runId) {
        this.loadRunData();
      }
      return;
    }

    // Handle runId changes
    if (changedProperties.has("runId") && this._provider) {
      if (!this.runId) {
        this.error = "Please provide a run ID.";
        return;
      }
      this.loadRunData();
    }
  }

  private initializeProvider(): void {
    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestWesProvider(this.baseUrl);
    } else {
      this._provider = null;
    }
  }

  private async loadRunData(): Promise<void> {
    if (!this._provider || !this.runId) return;

    this.loading = true;
    this.error = null;
    this.run = null;

    try {
      const runLog = await this._provider.getRunLog(this.runId);
      this.run = runLog;
      this.dispatchEvent(
        new CustomEvent("ecc-run-log-changed", {
          detail: { runLog },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Failed to load run details";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghWesRun.loadRunData",
      });
    } finally {
      this.loading = false;
    }
  }

  private static getStateInfo(runState: State): {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  } {
    const stateInfo: Record<
      State,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      UNKNOWN: { variant: "outline", label: "Unknown" },
      QUEUED: { variant: "secondary", label: "Queued" },
      INITIALIZING: { variant: "secondary", label: "Initializing" },
      RUNNING: { variant: "default", label: "Running" },
      PAUSED: { variant: "outline", label: "Paused" },
      COMPLETE: { variant: "default", label: "Complete" },
      EXECUTOR_ERROR: { variant: "destructive", label: "Executor Error" },
      SYSTEM_ERROR: { variant: "destructive", label: "System Error" },
      CANCELED: { variant: "outline", label: "Canceled" },
      CANCELING: { variant: "outline", label: "Canceling" },
    };

    return stateInfo[runState] || { variant: "outline", label: runState };
  }

  private static formatDateTime(dateTime: string | null | undefined): string {
    if (!dateTime) return "N/A";

    try {
      const date = new Date(dateTime);
      if (Number.isNaN(date.getTime())) return dateTime; // Return original if invalid

      return date.toLocaleString();
    } catch {
      return dateTime; // Return original if parsing fails
    }
  }

  private static getTimeDuration(
    startTime: string | null | undefined,
    endTime: string | null | undefined
  ): string {
    if (!startTime || !endTime) return "";

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
        return "";

      const diffInMinutes = Math.round(
        (end.getTime() - start.getTime()) / 60000
      );
      const diffInSeconds = Math.round(
        (end.getTime() - start.getTime()) / 1000
      );

      if (diffInMinutes < 1) {
        return `${diffInSeconds}s`;
      }
      if (diffInMinutes < 60) {
        const remainingSeconds = diffInSeconds % 60;
        return remainingSeconds > 0
          ? `${diffInMinutes}m ${remainingSeconds}s`
          : `${diffInMinutes}m`;
      }
      const hours = Math.floor(diffInMinutes / 60);
      const remainingMinutes = diffInMinutes % 60;
      return remainingMinutes > 0
        ? `${hours}h ${remainingMinutes}m`
        : `${hours}h`;
    } catch {
      return "";
    }
  }

  private renderRunHeader() {
    if (!this.run) return html``;
    const stateInfo = ECCClientGa4ghWesRun.getStateInfo(this.run.state);

    return html`
      <div class="mb-6">
        <div class="w-full flex flex-col gap-2">
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <h2 class="text-xl truncate" title=${this.run.run_id}>
              ${this.run.run_id}
            </h2>
          </div>

          <div class="flex flex-wrap gap-2 items-center">
            <ecc-utils-design-badge variant=${stateInfo.variant}>
              ${stateInfo.label}
            </ecc-utils-design-badge>
            <ecc-utils-design-badge variant="outline">
              ${this.run.request.workflow_type}
            </ecc-utils-design-badge>
          </div>
        </div>
      </div>
    `;
  }

  static renderLoading() {
    return html`
      <div class="space-y-6">
        <!-- Run header skeleton -->
        <div class="mb-6">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col md:flex-row md:items-center gap-2">
              <ecc-utils-design-skeleton
                class="part:h-10 part:w-64"
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

        <!-- Tab content skeleton -->
        <div class="mt-4">
          <div class="flex flex-col gap-4">
            <!-- Run information section -->
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

            <!-- Run details section -->
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
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderOverviewTab() {
    if (!this.run) return html``;
    const { request } = this.run;

    return html`
      <div class="mt-4">
        <div class="flex flex-col gap-4 text-sm">
          <div class="flex flex-col gap-2">
            <div class="font-bold text-base">Run Information</div>
            <div class="flex flex-col gap-3">
              <div>
                <dl class="flex flex-col gap-2">
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Run ID</dt>
                    <dd class="font-mono break-all">${this.run.run_id}</dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">State</dt>
                    <dd>
                      ${(() => {
                        const stateInfo = ECCClientGa4ghWesRun.getStateInfo(
                          this.run.state
                        );
                        return html`
                          <ecc-utils-design-badge variant=${stateInfo.variant}>
                            ${stateInfo.label}
                          </ecc-utils-design-badge>
                        `;
                      })()}
                    </dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Workflow Type</dt>
                    <dd>
                      ${request.workflow_type}
                      (${request.workflow_type_version})
                    </dd>
                  </div>
                  <ecc-utils-design-separator></ecc-utils-design-separator>
                  <div class="flex flex-row gap-2 w-full justify-between">
                    <dt class="text-muted-foreground">Workflow URL</dt>
                    <dd>
                      <a
                        href="${request.workflow_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary hover:underline break-all"
                      >
                        ${request.workflow_url}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <ecc-utils-design-separator></ecc-utils-design-separator>
            </div>
          </div>

          <!-- Workflow Parameters Section -->
          <div class="flex flex-col gap-3">
            <div class="font-bold text-base">Workflow Parameters</div>
            <div class="flex flex-col gap-3">
              <div>
                <h4 class="font-medium mb-2">Parameters</h4>
                <ecc-utils-design-code
                  value=${JSON.stringify(request.workflow_params, null, 2)}
                  extension="json"
                  class="part:h-[300px]"
                  disabled
                ></ecc-utils-design-code>
              </div>

              ${request.workflow_engine_parameters
                ? html`
                    <div>
                      <h4 class="font-medium mb-2">Engine Parameters</h4>
                      <ecc-utils-design-code
                        value=${JSON.stringify(
                          request.workflow_engine_parameters,
                          null,
                          2
                        )}
                        extension="json"
                        class="part:h-[200px]"
                        disabled
                      ></ecc-utils-design-code>
                    </div>
                  `
                : ""}
            </div>
          </div>

          <!-- Tags Section -->
          ${request.tags
            ? (() => {
                let tagsObj: Record<string, string> | null = null;
                if (typeof request.tags === "string") {
                  try {
                    tagsObj = JSON.parse(request.tags);
                  } catch {
                    tagsObj = null;
                  }
                } else if (
                  typeof request.tags === "object" &&
                  request.tags !== null
                ) {
                  tagsObj = request.tags;
                }
                return tagsObj
                  ? html`
                      <div class="flex flex-col gap-3">
                        <div class="font-bold text-base">Tags</div>
                        <div class="flex flex-wrap gap-2">
                          ${Object.entries(tagsObj).map(
                            ([key, value]) => html`
                              <ecc-utils-design-badge variant="outline"
                                >${key}: ${value}</ecc-utils-design-badge
                              >
                            `
                          )}
                        </div>
                      </div>
                    `
                  : "";
              })()
            : ""}
        </div>
      </div>
    `;
  }

  private static renderLog(log: Log) {
    return html`
      <div class="space-y-4 text-sm">
        <div class="flex flex-col gap-2">
          <div class="font-bold text-base">Log Information</div>
          <div class="flex flex-col gap-3">
            <div>
              <dl class="flex flex-col gap-2">
                ${log.name
                  ? html`
                      <div class="flex flex-row gap-2 w-full justify-between">
                        <dt class="text-muted-foreground">Name</dt>
                        <dd>${log.name}</dd>
                      </div>
                      <ecc-utils-design-separator></ecc-utils-design-separator>
                    `
                  : ""}
                <div class="flex flex-row gap-2 w-full justify-between">
                  <dt class="text-muted-foreground">Start Time</dt>
                  <dd>
                    ${ECCClientGa4ghWesRun.formatDateTime(log.start_time)}
                  </dd>
                </div>
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex flex-row gap-2 w-full justify-between">
                  <dt class="text-muted-foreground">End Time</dt>
                  <dd>${ECCClientGa4ghWesRun.formatDateTime(log.end_time)}</dd>
                </div>
                <ecc-utils-design-separator></ecc-utils-design-separator>
                <div class="flex flex-row gap-2 w-full justify-between">
                  <dt class="text-muted-foreground">Exit Code</dt>
                  <dd>
                    ${log.exit_code !== undefined ? log.exit_code : "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            <ecc-utils-design-separator></ecc-utils-design-separator>
          </div>
        </div>

        ${log.cmd && log.cmd.length > 0
          ? html`
              <div class="flex flex-col gap-3">
                <div class="font-bold text-base">Command</div>
                <ecc-utils-design-code
                  value=${log.cmd.join(" ")}
                  extension="sh"
                  disabled
                  class="part:h-[40px]"
                ></ecc-utils-design-code>
              </div>
            `
          : ""}

        <div class="flex flex-col gap-3">
          <div class="font-bold text-base">Output Logs</div>
          <div class="flex flex-col gap-3">
            <div>
              <h4 class="font-medium mb-2">Standard Output</h4>
              <ecc-utils-design-code
                value=${log.stdout || "No standard output."}
                extension="log"
                class="part:h-[300px]"
                disabled
              ></ecc-utils-design-code>
            </div>

            <div>
              <h4 class="font-medium mb-2">Standard Error</h4>
              <ecc-utils-design-code
                value=${log.stderr || "No standard error."}
                extension="log"
                class="part:h-[300px]"
                disabled
              ></ecc-utils-design-code>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderRunLogTab() {
    if (!this.run || !this.run.run_log) {
      return html`
        <div class="mt-4">
          <ecc-utils-design-card>
            <ecc-utils-design-card-content>
              <p class="text-muted-foreground">No run log available.</p>
            </ecc-utils-design-card-content>
          </ecc-utils-design-card>
        </div>
      `;
    }
    return html`<div class="mt-4">
      ${ECCClientGa4ghWesRun.renderLog(this.run.run_log)}
    </div>`;
  }

  private renderTaskLogsTab() {
    if (!this.run || !this.run.task_logs || this.run.task_logs.length === 0) {
      return html`
        <div class="mt-4">
          <ecc-utils-design-card>
            <ecc-utils-design-card-content>
              <p class="text-muted-foreground">No task logs available.</p>
            </ecc-utils-design-card-content>
          </ecc-utils-design-card>
        </div>
      `;
    }
    return html`
      <div class="mt-4 space-y-2">
        ${this.run.task_logs.map(
          (taskLog, index) => html`
            <ecc-utils-design-collapsible>
              <ecc-utils-design-collapsible-trigger class="part:w-full">
                <div
                  class="flex items-center justify-between font-medium p-2 border rounded-md"
                >
                  <span>${taskLog.name || `Task ${index + 1}`}</span>
                  <span class="text-sm text-muted-foreground"
                    >Click to expand</span
                  >
                </div>
              </ecc-utils-design-collapsible-trigger>
              <ecc-utils-design-collapsible-content>
                <div class="p-4 border border-t-0 rounded-b-md">
                  ${ECCClientGa4ghWesRun.renderLog(taskLog)}
                </div>
              </ecc-utils-design-collapsible-content>
            </ecc-utils-design-collapsible>
          `
        )}
      </div>
    `;
  }

  private renderOutputsTab() {
    if (!this.run || !this.run.outputs) {
      return html`
        <div class="mt-4">
          <ecc-utils-design-card>
            <ecc-utils-design-card-content>
              <p class="text-muted-foreground">No outputs available.</p>
            </ecc-utils-design-card-content>
          </ecc-utils-design-card>
        </div>
      `;
    }
    return html`
      <div class="mt-4">
        <ecc-utils-design-code
          value=${JSON.stringify(this.run.outputs, null, 2)}
          extension="json"
          class="part:h-[500px]"
          disabled
        ></ecc-utils-design-code>
      </div>
    `;
  }

  private hasTaskLogs(): boolean {
    return !!(this.run && this.run.task_logs && this.run.task_logs.length > 0);
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide either a base URL for the WES API or a custom provider.
        </div>
      `;
    }

    if (!this.runId) {
      return html`
        <div
          class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
        >
          Please provide a run ID.
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

    if (this.loading || !this.run) {
      return ECCClientGa4ghWesRun.renderLoading();
    }

    return html`
      <div class="space-y-4">
        <slot name="header">${this.renderRunHeader()}</slot>

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
              value="run_log"
              class="part:flex-1 flex-1"
              >Run Log</ecc-utils-design-tabs-trigger
            >
            ${this.hasTaskLogs()
              ? html`
                  <ecc-utils-design-tabs-trigger
                    value="task_logs"
                    class="part:flex-1 flex-1"
                    >Task Logs</ecc-utils-design-tabs-trigger
                  >
                `
              : ""}
            <ecc-utils-design-tabs-trigger
              value="outputs"
              class="part:flex-1 flex-1"
              >Outputs</ecc-utils-design-tabs-trigger
            >
          </ecc-utils-design-tabs-list>

          <ecc-utils-design-tabs-content value="overview">
            ${this.renderOverviewTab()}
          </ecc-utils-design-tabs-content>

          <ecc-utils-design-tabs-content value="run_log">
            ${this.renderRunLogTab()}
          </ecc-utils-design-tabs-content>

          ${this.hasTaskLogs()
            ? html`
                <ecc-utils-design-tabs-content value="task_logs">
                  ${this.renderTaskLogsTab()}
                </ecc-utils-design-tabs-content>
              `
            : ""}

          <ecc-utils-design-tabs-content value="outputs">
            <slot name="outputs">${this.renderOutputsTab()}</slot>
          </ecc-utils-design-tabs-content>
        </ecc-utils-design-tabs>
      </div>
    `;
  }
}

export default ECCClientGa4ghWesRun;
