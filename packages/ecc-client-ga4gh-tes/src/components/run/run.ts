import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  TesProvider,
  Task,
  STATE_INFO,
  CANCELLABLE_STATES,
} from "../../providers/tes-provider.js";
import { RestTesProvider } from "../../providers/rest-tes-provider.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/badge/index.js";
import "@elixir-cloud/design/components/skeleton/index.js";
import "@elixir-cloud/design/components/card/index.js";
import "@elixir-cloud/design/components/tabs/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/code/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";

const NO_SOURCE_ERROR =
  "Please provide either a base URL for the TES API or a custom provider.";

/**
 * @summary Displays details of a single TES task.
 * @since 0.1.0
 *
 * @property {string} baseUrl - Base URL of the TES instance.
 * @property {string} runId - The ID of the task to display.
 * @property {TesProvider} provider - Custom data provider (optional, overrides baseUrl).
 *
 * @fires ecc-run-log-changed - Fired when the task data is loaded.
 */
export class ECCClientGa4ghTesRun extends LitElement {
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
  @property({ attribute: false }) provider?: TesProvider;

  @state() private task: Task | null = null;
  @state() private loading = false;
  @state() private error: string | null = null;

  private requestGeneration = 0;
  private _provider: TesProvider | null = null;
  private initialized = false;

  protected firstUpdated(): void {
    this.initializeProvider();
    this.loadTask();
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    const isFirstUpdate = !this.initialized;
    this.initialized = true;
    if (isFirstUpdate) return;

    if (
      changedProperties.has("provider") ||
      changedProperties.has("baseUrl") ||
      changedProperties.has("runId")
    ) {
      this.initializeProvider();
      this.loadTask();
    }
  }

  private initializeProvider(): void {
    if (this.provider) {
      this._provider = this.provider;
    } else if (this.baseUrl) {
      this._provider = new RestTesProvider(this.baseUrl);
    } else {
      this.error =
        "Please provide either a base URL for the TES API or a custom provider.";
    }
  }

  private async loadTask(): Promise<void> {
    this.requestGeneration += 1;
    const generation = this.requestGeneration;

    if (!this._provider) return;
    if (!this.runId) {
      this.loading = false;
      this.task = null;
      this.error = "Please provide a run ID.";
      return;
    }

    this.loading = true;
    this.error = null;
    this.task = null;

    try {
      const task = await this._provider.getTask(this.runId, "FULL");
      if (generation !== this.requestGeneration) return;

      this.task = task;
      this.dispatchEvent(
        new CustomEvent("ecc-run-log-changed", {
          detail: { task: this.task },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err) {
      if (generation !== this.requestGeneration) return;
      this.error =
        err instanceof Error ? err.message : "Failed to load task details";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghTesRun.loadTask",
      });
    } finally {
      if (generation === this.requestGeneration) this.loading = false;
    }
  }

  private async handleDelete(): Promise<void> {
    if (!this._provider || !this.task) return;

    try {
      await this._provider.cancelTask(this.task.id);
      await this.loadTask();
    } catch (err) {
      this.error = `Failed to cancel task: ${
        err instanceof Error ? err.message : String(err)
      }`;
    }
  }

  private static formatDateTime(dateTime?: string): string {
    if (!dateTime) return "N/A";

    try {
      const date = new Date(dateTime);
      return Number.isNaN(date.getTime()) ? dateTime : date.toLocaleString();
    } catch {
      return dateTime;
    }
  }

  private static renderRow(label: string, value: unknown) {
    if (value === undefined || value === null || value === "") return html``;

    let val = value;

    if (typeof value === "boolean") {
      val = value ? "True" : "False";
    }

    return html`
      <div class="flex flex-row gap-2 w-full justify-between">
        <dt class="text-muted-foreground">${label}</dt>
        <dd class="text-right break-all">${val}</dd>
      </div>
      <ecc-utils-design-separator></ecc-utils-design-separator>
    `;
  }

  private static renderJson(value: unknown) {
    return html`
      <ecc-utils-design-code
        value=${JSON.stringify(value, null, 2)}
        extension="json"
        class="part:h-[250px]"
        disabled
      ></ecc-utils-design-code>
    `;
  }

  private static renderEmpty(message: string) {
    return html`
      <ecc-utils-design-card>
        <ecc-utils-design-card-content>
          <p class="text-muted-foreground">${message}</p>
        </ecc-utils-design-card-content>
      </ecc-utils-design-card>
    `;
  }

  private static renderSection(title: string, content: unknown) {
    return html`
      <div class="flex flex-col gap-3">
        <div class="font-bold text-base">${title}</div>
        ${content}
      </div>
    `;
  }

  private static renderLoading() {
    return html`
      <div class="space-y-6">
        <ecc-utils-design-skeleton
          class="part:h-10 part:w-64"
        ></ecc-utils-design-skeleton>
        <ecc-utils-design-skeleton
          class="part:h-10 part:w-full"
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

  private renderHeader(task: Task) {
    const info = STATE_INFO[task.state] || {
      variant: "outline",
      label: task.state,
    };

    return html`
      <div class="mb-6 flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-xl truncate" title=${task.id}>
            ${task.name || task.id}
          </h2>
          ${CANCELLABLE_STATES.includes(task.state)
            ? html`
                <ecc-utils-design-button
                  size="sm"
                  variant="destructive"
                  @click=${() => this.handleDelete()}
                >
                  Delete
                </ecc-utils-design-button>
              `
            : ""}
        </div>
        <div class="flex flex-wrap gap-2 items-center">
          <ecc-utils-design-badge variant=${info.variant}>
            ${info.label}
          </ecc-utils-design-badge>
          ${Object.entries(task.tags ?? {}).map(
            ([key, value]) => html`
              <ecc-utils-design-badge variant="outline"
                >${key}${value ? `: ${value}` : ""}</ecc-utils-design-badge
              >
            `
          )}
        </div>
      </div>
    `;
  }

  private static renderOverview(task: Task) {
    const { resources } = task;

    return html`
      <div class="mt-4 flex flex-col gap-6 text-sm">
        ${ECCClientGa4ghTesRun.renderSection(
          "Task Information",
          html`<dl class="flex flex-col gap-2">
            ${ECCClientGa4ghTesRun.renderRow("ID", task.id)}
            ${ECCClientGa4ghTesRun.renderRow("Name", task.name)}
            ${ECCClientGa4ghTesRun.renderRow("Description", task.description)}
            ${ECCClientGa4ghTesRun.renderRow(
              "Created",
              task.creation_time
                ? ECCClientGa4ghTesRun.formatDateTime(task.creation_time)
                : undefined
            )}
            ${ECCClientGa4ghTesRun.renderRow(
              "Volumes",
              task.volumes?.length ? task.volumes.join(", ") : undefined
            )}
          </dl>`
        )}
        ${resources
          ? ECCClientGa4ghTesRun.renderSection(
              "Resources",
              html`<dl class="flex flex-col gap-2">
                ${ECCClientGa4ghTesRun.renderRow(
                  "CPU cores",
                  resources.cpu_cores
                )}
                ${ECCClientGa4ghTesRun.renderRow("RAM (GB)", resources.ram_gb)}
                ${ECCClientGa4ghTesRun.renderRow(
                  "Disk (GB)",
                  resources.disk_gb
                )}
                ${ECCClientGa4ghTesRun.renderRow(
                  "Preemptible",
                  resources.preemptible === undefined
                    ? undefined
                    : String(resources.preemptible)
                )}
                ${ECCClientGa4ghTesRun.renderRow(
                  "Zones",
                  resources.zones?.join(", ")
                )}
              </dl>`
            )
          : ""}
      </div>
    `;
  }

  private static renderExecutors(task: Task) {
    if (!task.executors?.length) {
      return html`<div class="mt-4">
        ${ECCClientGa4ghTesRun.renderEmpty("No executors available.")}
      </div>`;
    }

    return html`
      <div class="mt-4 space-y-2">
        ${task.executors.map(
          (executor, index) => html`
            <ecc-utils-design-collapsible>
              <ecc-utils-design-collapsible-trigger class="part:w-full">
                <div
                  class="flex items-center justify-between font-medium p-2 border rounded-md"
                >
                  <span>${executor.image || `Executor ${index + 1}`}</span>
                  <span class="text-sm text-muted-foreground"
                    >Click to expand</span
                  >
                </div>
              </ecc-utils-design-collapsible-trigger>
              <ecc-utils-design-collapsible-content>
                <div
                  class="p-4 border border-t-0 rounded-b-md flex flex-col gap-3 text-sm"
                >
                  <dl class="flex flex-col gap-2">
                    ${ECCClientGa4ghTesRun.renderRow("Image", executor.image)}
                    ${ECCClientGa4ghTesRun.renderRow(
                      "Workdir",
                      executor.workdir
                    )}
                    ${ECCClientGa4ghTesRun.renderRow("Stdin", executor.stdin)}
                    ${ECCClientGa4ghTesRun.renderRow("Stdout", executor.stdout)}
                    ${ECCClientGa4ghTesRun.renderRow("Stderr", executor.stderr)}
                    ${ECCClientGa4ghTesRun.renderRow(
                      "Ignore_err",
                      executor.ignore_error
                    )}
                  </dl>
                  <div class="font-medium">Command</div>
                  <ecc-utils-design-code
                    value=${executor.command.join(" ")}
                    extension="sh"
                    class="part:h-[40px]"
                    disabled
                  ></ecc-utils-design-code>
                  ${executor.env
                    ? html`
                        <div class="font-medium">Environment</div>
                        ${ECCClientGa4ghTesRun.renderJson(executor.env)}
                      `
                    : ""}
                </div>
              </ecc-utils-design-collapsible-content>
            </ecc-utils-design-collapsible>
          `
        )}
      </div>
    `;
  }

  private static renderFiles(title: string, files?: object[]) {
    if (!files?.length) return "";
    return ECCClientGa4ghTesRun.renderSection(
      title,
      ECCClientGa4ghTesRun.renderJson(files)
    );
  }

  private static renderInputsOutputs(task: Task) {
    if (!task.inputs?.length && !task.outputs?.length) {
      return html`<div class="mt-4">
        ${ECCClientGa4ghTesRun.renderEmpty("No inputs or outputs defined.")}
      </div>`;
    }

    return html`
      <div class="mt-4 flex flex-col gap-6">
        ${ECCClientGa4ghTesRun.renderFiles("Inputs", task.inputs)}
        ${ECCClientGa4ghTesRun.renderFiles("Outputs", task.outputs)}
      </div>
    `;
  }

  private static renderLogs(task: Task) {
    if (!task.logs?.length) {
      return html`<div class="mt-4">
        ${ECCClientGa4ghTesRun.renderEmpty("No logs available.")}
      </div>`;
    }

    return html`
      <div class="mt-4 space-y-2">
        ${task.logs.map(
          (log, index) => html`
            <ecc-utils-design-collapsible>
              <ecc-utils-design-collapsible-trigger class="part:w-full">
                <div
                  class="flex items-center justify-between font-medium p-2 border rounded-md"
                >
                  <span
                    >Attempt ${index + 1}
                    ${log.start_time
                      ? `- ${ECCClientGa4ghTesRun.formatDateTime(
                          log.start_time
                        )}`
                      : ""}</span
                  >
                  <span class="text-sm text-muted-foreground"
                    >Click to Expand</span
                  >
                </div>
              </ecc-utils-design-collapsible-trigger>
              <ecc-utils-design-collapsible-content>
                <div
                  class="p-4 border border-t-0 rounded-b-md flex flex-col gap-4 text-sm"
                >
                  <dl class="flex flex-col gap-2">
                    ${ECCClientGa4ghTesRun.renderRow(
                      "Start Time",
                      ECCClientGa4ghTesRun.formatDateTime(log.start_time)
                    )}
                    ${ECCClientGa4ghTesRun.renderRow(
                      "End Time",
                      ECCClientGa4ghTesRun.formatDateTime(log.end_time)
                    )}
                  </dl>
                  ${log.metadata && Object.keys(log.metadata).length
                    ? ECCClientGa4ghTesRun.renderSection(
                        "Metadata",
                        html`<dl class="flex flex-col gap-2">
                          ${Object.entries(log.metadata).map(([key, value]) =>
                            ECCClientGa4ghTesRun.renderRow(key, value)
                          )}
                        </dl>`
                      )
                    : ""}
                  ${log.logs.map(
                    (executorLog, i) => html`
                      <div class="flex flex-col gap-2">
                        <div class="font-medium">
                          Executor ${i + 1} (exit code ${executorLog.exit_code})
                        </div>
                        <h4 class="text-muted-foreground">Standard Output</h4>
                        <ecc-utils-design-code
                          value=${executorLog.stdout || "No standard output."}
                          extension="log"
                          class="part:h-[250px]"
                          disabled
                        ></ecc-utils-design-code>
                        <h4 class="text-muted-foreground">Standard Error</h4>
                        <ecc-utils-design-code
                          value=${executorLog.stderr || "No standard error."}
                          extension="log"
                          class="part:h-[250px]"
                          disabled
                        ></ecc-utils-design-code>
                      </div>
                    `
                  )}
                  ${ECCClientGa4ghTesRun.renderFiles(
                    "Output Files",
                    log.outputs
                  )}
                  ${log.system_logs?.length
                    ? ECCClientGa4ghTesRun.renderSection(
                        "System Logs",
                        html`<ecc-utils-design-code
                          value=${log.system_logs.join("\n")}
                          extension="log"
                          class="part:h-[200px]"
                          disabled
                        ></ecc-utils-design-code>`
                      )
                    : ""}
                </div>
              </ecc-utils-design-collapsible-content>
            </ecc-utils-design-collapsible>
          `
        )}
      </div>
    `;
  }

  private static renderError(message: string) {
    return html`
      <div
        class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
      >
        ${message}
      </div>
    `;
  }

  render() {
    if (!this.baseUrl && !this.provider) {
      return ECCClientGa4ghTesRun.renderError(NO_SOURCE_ERROR);
    }
    if (!this.runId) {
      return ECCClientGa4ghTesRun.renderError("Please provide a task ID.");
    }
    if (this.error) return ECCClientGa4ghTesRun.renderError(this.error);
    if (this.loading) return ECCClientGa4ghTesRun.renderLoading();

    if (!this.task) return html``;

    return html`
      <div class="space-y-4">
        <div>${this.renderHeader(this.task)}</div>

        <ecc-utils-design-tabs
          default-value="overview"
          class="part:mb-6 part:w-full"
        >
          <ecc-utils-design-tabs-list class="part:w-full">
            <ecc-utils-design-tabs-trigger value="overview" class="flex-1"
              >Overview</ecc-utils-design-tabs-trigger
            >
            <ecc-utils-design-tabs-trigger value="executors" class="flex-1"
              >Executors</ecc-utils-design-tabs-trigger
            >
            <ecc-utils-design-tabs-trigger value="files" class="flex-1"
              >Inputs / Outputs</ecc-utils-design-tabs-trigger
            >
            <ecc-utils-design-tabs-trigger value="logs" class="flex-1"
              >Logs</ecc-utils-design-tabs-trigger
            >
          </ecc-utils-design-tabs-list>

          <ecc-utils-design-tabs-content value="overview">
            ${ECCClientGa4ghTesRun.renderOverview(this.task)}
          </ecc-utils-design-tabs-content>
          <ecc-utils-design-tabs-content value="executors">
            ${ECCClientGa4ghTesRun.renderExecutors(this.task)}
          </ecc-utils-design-tabs-content>
          <ecc-utils-design-tabs-content value="files">
            ${ECCClientGa4ghTesRun.renderInputsOutputs(this.task)}
          </ecc-utils-design-tabs-content>
          <ecc-utils-design-tabs-content value="logs">
            ${ECCClientGa4ghTesRun.renderLogs(this.task)}
          </ecc-utils-design-tabs-content>
        </ecc-utils-design-tabs>
      </div>
    `;
  }
}

export default ECCClientGa4ghTesRun;
