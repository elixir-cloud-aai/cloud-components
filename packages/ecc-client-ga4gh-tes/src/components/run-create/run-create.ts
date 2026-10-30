import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { ComponentStyles as TailwindStyles } from "./tw-styles.js";
import { GlobalStyles } from "../../global.js";
import {
  TesProvider,
  TaskRequest,
  Executor,
  Input,
  Output,
} from "../../providers/tes-provider.js";
import { RestTesProvider } from "../../providers/rest-tes-provider.js";
import "@elixir-cloud/design/components/button/index.js";
import "@elixir-cloud/design/components/input/index.js";
import "@elixir-cloud/design/components/label/index.js";
import "@elixir-cloud/design/components/textarea/index.js";
import "@elixir-cloud/design/components/checkbox/index.js";
import "@elixir-cloud/design/components/separator/index.js";
import "@elixir-cloud/design/components/collapsible/index.js";

type Row = Record<string, string>;

interface ExecutorForm {
  image: string;
  command: string;
  workdir: string;
  stdin: string;
  stdout: string;
  stderr: string;
  env: Row[];
  ignoreError: boolean;
}

interface FormState {
  name: string;
  description: string;
  executors: ExecutorForm[];
  inputs: Row[];
  outputs: Row[];
  tags: Row[];
  volumes: Row[];
  cpuCores: string;
  ramGb: string;
  diskGb: string;
  zones: string;
  preemptible: boolean;
  backendParametersStrict: boolean;
  backendParameters: Row[];
}

type ListKey = "inputs" | "outputs" | "tags" | "volumes" | "backendParameters";

const NO_SOURCE_ERROR =
  "Please provide either a base URL for the TES API or a custom provider.";

const emptyExecutor = (): ExecutorForm => ({
  image: "",
  command: "",
  workdir: "",
  stdin: "",
  stdout: "",
  stderr: "",
  env: [],
  ignoreError: false,
});

const emptyForm = (): FormState => ({
  name: "",
  description: "",
  executors: [emptyExecutor()],
  inputs: [],
  outputs: [],
  tags: [],
  volumes: [],
  cpuCores: "",
  ramGb: "",
  diskGb: "",
  zones: "",
  preemptible: false,
  backendParametersStrict: false,
  backendParameters: [],
});

const toRecord = (rows: Row[]): Record<string, string> =>
  Object.fromEntries(
    rows
      .filter((row) => row.key?.trim())
      .map((row) => [row.key.trim(), row.value ?? ""])
  );

const compact = <T extends object>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
  ) as T;

/**
 * @summary Component for creating tasks on a TES service
 * @since 2.0.0
 *
 * @property {string} baseUrl - Base URL of the TES instance/gateway
 * @property {TesProvider} provider - Custom data provider (optional, overrides baseUrl)
 *
 * @fires ecc-run-submitted - Fired when a task is successfully created
 * @fires ecc-run-create-failed - Fired when task creation fails
 * @fires ecc-run-create-reset - Fired when the form is reset
 */
export class ECCClientGa4ghTesRunCreate extends LitElement {
  static styles = [
    GlobalStyles,
    TailwindStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ];

  @property({ type: String, reflect: true }) baseUrl = "";
  @property({ attribute: false }) provider?: TesProvider;

  @state() private form: FormState = emptyForm();
  @state() private submitting = false;
  @state() private error: string | null = null;
  @state() private success: string | null = null;

  private get activeProvider(): TesProvider | null {
    if (this.provider) return this.provider;
    return this.baseUrl ? new RestTesProvider(this.baseUrl) : null;
  }

  private setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    this.form = { ...this.form, [key]: value };
  }

  private setRow(key: ListKey, index: number, field: string, value: string) {
    this.setField(
      key,
      this.form[key].map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  }

  private addRow(key: ListKey) {
    this.setField(key, [...this.form[key], {}]);
  }

  private removeRow(key: ListKey, index: number) {
    this.setField(
      key,
      this.form[key].filter((_, i) => i !== index)
    );
  }

  private updateExecutor(index: number, patch: Partial<ExecutorForm>) {
    this.setField(
      "executors",
      this.form.executors.map((ex, i) =>
        i === index ? { ...ex, ...patch } : ex
      )
    );
  }

  private buildRequest(): TaskRequest {
    const { form } = this;

    const executors: Executor[] = form.executors.map((ex) => ({
      ...compact({
        image: ex.image.trim(),
        workdir: ex.workdir.trim(),
        stdin: ex.stdin.trim(),
        stdout: ex.stdout.trim(),
        stderr: ex.stderr.trim(),
      }),
      command: ex.command.split(/\r?\n/),
      env: ex.env.some((e) => e.key?.trim()) ? toRecord(ex.env) : undefined,
      ...(ex.ignoreError ? { ignore_error: true } : {}),
    })) as Executor[];

    const resources = compact({
      cpu_cores: form.cpuCores ? Number(form.cpuCores) : undefined,
      ram_gb: form.ramGb ? Number(form.ramGb) : undefined,
      disk_gb: form.diskGb ? Number(form.diskGb) : undefined,
      zones: form.zones
        ? form.zones
            .split(",")
            .map((z) => z.trim())
            .filter(Boolean)
        : undefined,
      preemptible: form.preemptible || undefined,
      backend_parameters: form.backendParameters.some((p) => p.key?.trim())
        ? toRecord(form.backendParameters)
        : undefined,
      backend_parameters_strict: form.backendParametersStrict || undefined,
    });

    const request: TaskRequest = {
      ...compact({
        name: form.name.trim(),
        description: form.description.trim(),
      }),
      executors,
    };

    const inputs = form.inputs
      .map(compact)
      .filter((r) => r.path || r.url) as unknown as Input[];
    const outputs = form.outputs
      .map(compact)
      .filter((r) => r.path || r.url) as unknown as Output[];
    const volumes = form.volumes.map((v) => v.value?.trim()).filter(Boolean);

    if (inputs.length) request.inputs = inputs;
    if (outputs.length) request.outputs = outputs;
    if (volumes.length) request.volumes = volumes;
    if (Object.keys(resources).length) request.resources = resources;
    if (form.tags.some((t) => t.key?.trim())) {
      request.tags = toRecord(form.tags);
    }

    return request;
  }

  private validate(): string | null {
    if (this.form.executors.length === 0)
      return "At least one executor is required";

    for (const [i, ex] of this.form.executors.entries()) {
      if (!ex.image.trim()) return `Executor ${i + 1}: image is required`;
      if (!ex.command.trim()) return `Executor ${i + 1}: command is required`;
    }

    const numbers = [this.form.cpuCores, this.form.ramGb, this.form.diskGb];
    if (numbers.some((n) => n && Number.isNaN(Number(n)))) {
      return "Resource values must be numbers";
    }

    const rows = (key: "inputs" | "outputs") =>
      this.form[key].filter((r) => r.path?.trim() || r.url?.trim());
    for (const [i, r] of rows("inputs").entries()) {
      if (!r.path?.trim()) return `Input ${i + 1}: path is required`;
      if (!r.url?.trim()) return `Input ${i + 1}: url is required`;
    }
    for (const [i, r] of rows("outputs").entries()) {
      if (!r.path?.trim()) return `Output ${i + 1}: path is required`;
      if (!r.url?.trim()) return `Output ${i + 1}: url is required`;
    }
    const badType = [...rows("inputs"), ...rows("outputs")].find(
      (r) => r.type && !["FILE", "DIRECTORY"].includes(r.type.trim())
    );
    if (badType) return "Type must be FILE or DIRECTORY";

    return null;
  }

  private async handleSubmit(): Promise<void> {
    const provider = this.activeProvider;
    if (!provider) {
      this.error = NO_SOURCE_ERROR;
      return;
    }

    const validationError = this.validate();
    if (validationError) {
      this.error = validationError;
      return;
    }

    this.submitting = true;
    this.error = null;
    this.success = null;

    try {
      const request = this.buildRequest();
      const result = await provider.createTask(request);

      this.success = `Task submitted successfully! Task ID: ${result.id}`;
      this.dispatchEvent(
        new CustomEvent("ecc-run-submitted", {
          detail: { runId: result.id, request },
          bubbles: true,
          composed: true,
        })
      );
      this.form = emptyForm();
    } catch (err) {
      this.error = err instanceof Error ? err.message : "Failed to submit task";
      console.error({
        error: this.error,
        breakPoint: "ECCClientGa4ghTesRunCreate.handleSubmit",
      });
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
    this.form = emptyForm();
    this.error = null;
    this.success = null;
    this.dispatchEvent(
      new CustomEvent("ecc-run-create-reset", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private static renderText(
    label: string,
    current: string,
    onChange: (next: string) => void,
    options: { required?: boolean; placeholder?: string; type?: string } = {}
  ) {
    return html`
      <div class="grid gap-2">
        <ecc-utils-design-label class="text-sm font-medium">
          ${label}
          ${options.required
            ? html`<span class="text-destructive">*</span>`
            : ""}
        </ecc-utils-design-label>
        <ecc-utils-design-input
          .value=${current}
          type=${options.type ?? "text"}
          placeholder=${options.placeholder ?? ""}
          class="h-10"
          @ecc-input-changed=${(e: CustomEvent) => onChange(e.detail.value)}
        ></ecc-utils-design-input>
      </div>
    `;
  }

  private static renderRemoveButton(onClick: () => void) {
    return html`
      <ecc-utils-design-button
        type="button"
        variant="ghost"
        size="sm"
        class="part:h-9 part:w-9 part:p-0"
        @click=${onClick}
        >×</ecc-utils-design-button
      >
    `;
  }

  private renderRows(
    title: string,
    key: ListKey,
    fields: { name: string; placeholder: string }[]
  ) {
    return html`
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <ecc-utils-design-label class="text-sm font-medium">
            ${title}
          </ecc-utils-design-label>
          <ecc-utils-design-button
            type="button"
            variant="outline"
            size="sm"
            @click=${() => this.addRow(key)}
            >Add</ecc-utils-design-button
          >
        </div>
        ${this.form[key].map(
          (row, index) => html`
            <div class="flex gap-2 items-center">
              ${fields.map(
                (field) => html`
                  <ecc-utils-design-input
                    class="flex-1 h-9"
                    placeholder=${field.placeholder}
                    .value=${row[field.name] ?? ""}
                    @ecc-input-changed=${(e: CustomEvent) =>
                      this.setRow(key, index, field.name, e.detail.value)}
                  ></ecc-utils-design-input>
                `
              )}
              ${ECCClientGa4ghTesRunCreate.renderRemoveButton(() =>
                this.removeRow(key, index)
              )}
            </div>
          `
        )}
      </div>
    `;
  }

  private renderExecutor(executor: ExecutorForm, index: number) {
    const set = (patch: Partial<ExecutorForm>) =>
      this.updateExecutor(index, patch);

    return html`
      <div class="grid gap-4 p-4 border rounded-md">
        <div class="flex items-center justify-between">
          <div class="font-medium text-sm">Executor ${index + 1}</div>
          ${this.form.executors.length > 1
            ? ECCClientGa4ghTesRunCreate.renderRemoveButton(() =>
                this.setField(
                  "executors",
                  this.form.executors.filter((_, i) => i !== index)
                )
              )
            : ""}
        </div>
        ${ECCClientGa4ghTesRunCreate.renderText(
          "Image",
          executor.image,
          (image) => set({ image }),
          {
            required: true,
            placeholder: "ubuntu:latest",
          }
        )}
        <div class="grid gap-2">
          <ecc-utils-design-label class="text-sm font-medium">
            Command (one argument per line)
            <span class="text-destructive">*</span>
          </ecc-utils-design-label>
          <ecc-utils-design-textarea
            .value=${executor.command}
            placeholder="echo&#10;hello world"
            @ecc-input-changed=${(e: CustomEvent) =>
              set({ command: e.detail.value })}
          ></ecc-utils-design-textarea>
        </div>
        <ecc-utils-design-collapsible>
          <ecc-utils-design-collapsible-trigger>
            <div
              class="flex items-center justify-between w-full py-2 text-left hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring rounded-t cursor-pointer transition-colors px-2"
            >
              <div class="space-y-0.5">
                <h4 class="text-sm font-medium text-muted-foreground">
                  Advanced executor options
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
            <div class="grid gap-4 pt-2">
              ${ECCClientGa4ghTesRunCreate.renderText(
                "Workdir",
                executor.workdir,
                (workdir) => set({ workdir })
              )}
              ${ECCClientGa4ghTesRunCreate.renderText(
                "Stdin",
                executor.stdin,
                (stdin) => set({ stdin })
              )}
              ${ECCClientGa4ghTesRunCreate.renderText(
                "Stdout",
                executor.stdout,
                (stdout) => set({ stdout })
              )}
              ${ECCClientGa4ghTesRunCreate.renderText(
                "Stderr",
                executor.stderr,
                (stderr) => set({ stderr })
              )}
              <div class="flex items-center gap-2">
                <ecc-utils-design-checkbox
                  ?checked=${executor.ignoreError}
                  @ecc-input-changed=${(e: CustomEvent) =>
                    set({ ignoreError: e.detail.checked })}
                ></ecc-utils-design-checkbox>
                <ecc-utils-design-label class="text-sm font-medium">
                  Ignore error (continue to next executor on failure)
                </ecc-utils-design-label>
              </div>
              <div class="grid gap-2">
                <div class="flex items-center justify-between">
                  <ecc-utils-design-label class="text-sm font-medium">
                    Environment
                  </ecc-utils-design-label>
                  <ecc-utils-design-button
                    type="button"
                    variant="outline"
                    size="sm"
                    @click=${() => set({ env: [...executor.env, {}] })}
                    >Add</ecc-utils-design-button
                  >
                </div>
                ${executor.env.map(
                  (row, envIndex) => html`
                    <div class="flex gap-2 items-center">
                      <ecc-utils-design-input
                        class="flex-1 h-9"
                        placeholder="Name"
                        .value=${row.key ?? ""}
                        @ecc-input-changed=${(e: CustomEvent) =>
                          set({
                            env: executor.env.map((r, i) =>
                              i === envIndex ? { ...r, key: e.detail.value } : r
                            ),
                          })}
                      ></ecc-utils-design-input>
                      <ecc-utils-design-input
                        class="flex-1 h-9"
                        placeholder="Value"
                        .value=${row.value ?? ""}
                        @ecc-input-changed=${(e: CustomEvent) =>
                          set({
                            env: executor.env.map((r, i) =>
                              i === envIndex
                                ? { ...r, value: e.detail.value }
                                : r
                            ),
                          })}
                      ></ecc-utils-design-input>
                      ${ECCClientGa4ghTesRunCreate.renderRemoveButton(() =>
                        set({
                          env: executor.env.filter((_, i) => i !== envIndex),
                        })
                      )}
                    </div>
                  `
                )}
              </div>
            </div>
          </ecc-utils-design-collapsible-content>
        </ecc-utils-design-collapsible>
      </div>
    `;
  }

  private renderResources() {
    const { form } = this;

    return html`
      <div class="grid gap-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${ECCClientGa4ghTesRunCreate.renderText(
            "CPU cores",
            form.cpuCores,
            (v) => this.setField("cpuCores", v),
            { type: "number" }
          )}
          ${ECCClientGa4ghTesRunCreate.renderText(
            "RAM (GB)",
            form.ramGb,
            (v) => this.setField("ramGb", v),
            { type: "number" }
          )}
          ${ECCClientGa4ghTesRunCreate.renderText(
            "Disk (GB)",
            form.diskGb,
            (v) => this.setField("diskGb", v),
            { type: "number" }
          )}
        </div>
        ${ECCClientGa4ghTesRunCreate.renderText(
          "Zones (comma separated)",
          form.zones,
          (v) => this.setField("zones", v)
        )}
        <div class="flex items-center gap-2 justify-between">
          <ecc-utils-design-label class="text-sm font-medium">
            Preemptible
          </ecc-utils-design-label>
          <ecc-utils-design-checkbox
            ?checked=${form.preemptible}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.setField("preemptible", e.detail.checked)}
          ></ecc-utils-design-checkbox>
        </div>
        <div class="flex items-center gap-2 justify-between">
          <ecc-utils-design-label class="text-sm font-medium">
            Backend parameters strict (fail if any are unsupported)
          </ecc-utils-design-label>
          <ecc-utils-design-checkbox
            ?checked=${form.backendParametersStrict}
            @ecc-input-changed=${(e: CustomEvent) =>
              this.setField("backendParametersStrict", e.detail.checked)}
          ></ecc-utils-design-checkbox>
        </div>
        ${this.renderRows("Backend parameters", "backendParameters", [
          { name: "key", placeholder: "Parameter name" },
          { name: "value", placeholder: "Parameter value" },
        ])}
      </div>
    `;
  }

  private renderAdvanced() {
    return html`
      <ecc-utils-design-collapsible>
        <ecc-utils-design-collapsible-trigger>
          <div
            class="flex items-center justify-between w-full py-2 text-left hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-ring rounded-t cursor-pointer transition-colors px-2"
          >
            <div class="space-y-0.5">
              <h4 class="text-sm font-medium text-muted-foreground">
                Inputs, outputs, resources and metadata
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
          <div class="pt-4 grid gap-6 border-t border-border/50">
            ${this.renderRows("Inputs", "inputs", [
              { name: "path", placeholder: "Path in container" },
              { name: "url", placeholder: "URL" },
              { name: "type", placeholder: "Type (FILE or DIRECTORY)" },
            ])}
            ${this.renderRows("Outputs", "outputs", [
              { name: "path", placeholder: "Path in container" },
              { name: "url", placeholder: "URL" },
              { name: "path_prefix", placeholder: "Path prefix (wildcards)" },
              { name: "type", placeholder: "Type (FILE or DIRECTORY)" },
            ])}
            ${this.renderResources()}
            ${this.renderRows("Tags", "tags", [
              { name: "key", placeholder: "Tag name" },
              { name: "value", placeholder: "Tag value" },
            ])}
            ${this.renderRows("Volumes", "volumes", [
              { name: "value", placeholder: "Volume path" },
            ])}
          </div>
        </ecc-utils-design-collapsible-content>
      </ecc-utils-design-collapsible>
    `;
  }

  render() {
    const renderNoSourceErr = () =>
      !this.baseUrl && !this.provider
        ? html`
            <div
              class="p-4 border border-destructive rounded-md text-destructive-foreground bg-destructive/10"
            >
              ${NO_SOURCE_ERROR}
            </div>
          `
        : ``;

    return html`
      <form
        @submit=${(e: Event) => {
          e.preventDefault();
          this.handleSubmit();
        }}
      >
        ${renderNoSourceErr()}
        <div class="space-y-6">
          <div class="grid gap-4">
            ${ECCClientGa4ghTesRunCreate.renderText(
              "Name",
              this.form.name,
              (v) => this.setField("name", v)
            )}
            ${ECCClientGa4ghTesRunCreate.renderText(
              "Description",
              this.form.description,
              (v) => this.setField("description", v)
            )}
          </div>

          <div class="grid gap-4">
            <div class="flex items-center justify-between">
              <div class="font-bold text-base">Executors</div>
              <ecc-utils-design-button
                type="button"
                variant="outline"
                size="sm"
                @click=${() =>
                  this.setField("executors", [
                    ...this.form.executors,
                    emptyExecutor(),
                  ])}
                >Add executor</ecc-utils-design-button
              >
            </div>
            ${this.form.executors.map((ex, i) => this.renderExecutor(ex, i))}
          </div>

          ${this.renderAdvanced()}
        </div>

        ${this.error
          ? html`<div class="text-sm text-destructive mt-4">${this.error}</div>`
          : ""}
        ${this.success
          ? html`<div class="text-sm mt-4">${this.success}</div>`
          : ""}

        <div class="flex justify-end gap-2 mt-6">
          <ecc-utils-design-button
            type="button"
            variant="outline"
            ?disabled=${this.submitting}
            @click=${this.resetForm}
          >
            Reset
          </ecc-utils-design-button>
          <ecc-utils-design-button
            type="submit"
            ?disabled=${this.submitting}
            @click=${this.handleSubmit}
          >
            ${this.submitting ? "Submitting..." : "Submit Task"}
          </ecc-utils-design-button>
        </div>
      </form>
    `;
  }
}

export default ECCClientGa4ghTesRunCreate;
