import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { postTask } from "../../API/Task/tesGet.js";
import { Executor, postTaskForm } from "./types.js";
import "@elixir-cloud/design";

@customElement("ecc-client-lit-ga4gh-tes-create-run")
export class TESCreateRun extends LitElement {
  @property({ type: String }) accessor baseURL =
    "https://protes.rahtiapp.fi/ga4gh/tes/v1";

  @state() accessor form: postTaskForm = {
    executors: [
      {
        command: [],
        image: "",
      },
    ],
  };

  @state() accessor response: any = {};

  private fields = [
    {
      key: "name",
      label: "Name",
      type: "text",
    },
    {
      key: "description",
      label: "Description",
      type: "test",
    },
    {
      key: "executors",
      label: "Executors section",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "executors",
          label: "Executors",
          type: "array",
          fieldOptions: {
            required: true,
          },
          arrayOptions: {
            defaultInstances: 1,
            min: 1,
          },
          children: [
            {
              key: "command",
              label: "Commands",
              type: "array",
              fieldOptions: {
                required: true,
              },
              arrayOptions: {
                defaultInstances: 1,
                min: 1,
              },
              children: [
                {
                  key: "command",
                  label: "Command",
                  type: "text",
                  fieldOptions: {
                    required: true,
                  },
                },
              ],
            },
            {
              key: "env",
              label: "Env",
              type: "array",
              arrayOptions: {
                defaultInstances: 0,
              },
              children: [
                {
                  key: "name",
                  label: "Env name",
                  type: "text",
                },
                {
                  key: "value",
                  label: "Env value",
                  type: "text",
                },
              ],
            },
            {
              key: "image",
              label: "Image",
              type: "text",
              fieldOptions: {
                required: true,
              },
            },
            {
              key: "stderr",
              label: "Stderr",
              type: "text",
            },
            {
              key: "stdin",
              label: "Stdin",
              type: "text",
            },
            {
              key: "stdout",
              label: "Stdout",
              type: "text",
            },
            {
              key: "workdir",
              label: "Workdir",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      key: "inputs",
      label: "Input section",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "inputs",
          label: "Inputs",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "path",
              label: "Path",
              type: "text",
            },
            {
              key: "url",
              label: "URL",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      key: "outputs",
      label: "Output section",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "outputs",
          label: "Outputs",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "path",
              label: "Path",
              type: "text",
            },
            {
              key: "type",
              label: "Type",
              type: "text",
            },
            {
              key: "url",
              label: "URL",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      key: "resources",
      label: "Resources section",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "cpu_cores",
          label: "CPU cores",
          type: "number",
        },
        {
          key: "disk_gb",
          label: "Disk space (Gb)",
          type: "number",
        },
        {
          key: "ram_gb",
          label: "Ram space (Gb)",
          type: "number",
        },
        {
          key: "zones",
          label: "Zones",
          type: "text",
        },
        {
          key: "preemptible",
          label: "Preemptible",
          type: "switch",
        },
      ],
    },
    {
      key: "tags",
      label: "Tags",
      type: "array",
      arrayOptions: {
        defaultInstances: 0,
      },
      children: [
        {
          key: "name",
          label: "Tag name",
          type: "text",
        },
        {
          key: "value",
          label: "Tag value",
          type: "text",
        },
      ],
    },
    {
      key: "volumes",
      label: "Volumes",
      type: "array",
      arrayOptions: {
        defaultInstances: 0,
      },
      children: [
        {
          key: "volume",
          label: "Volume",
          type: "text",
        },
      ],
    },
  ];

  /**
   * Logs the error if UI breaks else uses public method of `ecc-utils-design-form` to show error on UI
   * @param message Error message
   * @param breakMethod The class method where the error occured
   */
  private _handleError(message: string, breakMethod: string) {
    const eccUtilsDesignForm = this.shadowRoot?.querySelector(
      "ecc-utils-design-form"
    ) as any;
    if (eccUtilsDesignForm) {
      eccUtilsDesignForm.error({
        message,
      });
    } else {
      console.error({
        message: "ecc-utils-design-form not found",
        breakPoint: `TESCreateRun.${breakMethod}`,
      });
    }
  }

  // Extracting the API call into a separate method
  private async _callAPI(data: any) {
    try {
      const eccUtilsDesignForm = this.shadowRoot?.querySelector(
        "ecc-utils-design-form"
      ) as any;
      if (eccUtilsDesignForm) {
        eccUtilsDesignForm.loading();
        this.response = await postTask(this.baseURL, data);

        if (this.response.id) {
          eccUtilsDesignForm.success({
            message: this.response.id,
          });
        } else {
          this._handleError(this.response.message, "callAPI");
        }
      } else {
        console.error({
          message: "ecc-utils-design-form not found",
          breakPoint: "TESCreateRun.callApi",
        });
      }
    } catch (error) {
      this._handleError("Internal Server Error", "callAPI");
    }
  }

  // form submit method
  private async _submitForm(form: any) {
    const data: any = {};
    // Process the form data
    for (const [key, value] of Object.entries(form)) {
      switch (key) {
        case "name":
        case "description":
        case "resources":
          data[key] = value;
          break;
        case "executors":
          data.executors = this._processExecutors(
            (value as { executors: unknown }).executors
          );
          break;
        case "inputs":
          data.inputs = (value as { inputs: unknown }).inputs;
          break;
        case "outputs":
          data.output = (value as { outputs: unknown }).outputs;
          break;
        case "volumes":
          data.volumes = this._processVolumes(value as any);
          break;
        case "tags":
          data.tags = this._processTags(value as any);
          break;
        default:
          break;
      }
    }

    this.form = data;

    try {
      await this._callAPI(data);
    } catch (error) {
      this._handleError("Couldn't call the API", "submitForm");
    }
  }

  // Process executors data
  private _processExecutors = (value: any): Executor[] => {
    if (!Array.isArray(value)) return [];

    return value
      .filter(
        (executorElement: any) =>
          typeof executorElement === "object" && executorElement !== null
      )
      .map((executorElement: any) => {
        const executor: any = {};

        if (executorElement.command && Array.isArray(executorElement.command)) {
          executor.command = executorElement.command.map(
            (execObject: any) => execObject.command
          );
        }

        if (executorElement.env && Array.isArray(executorElement.env)) {
          executor.env = this._processEnv(executorElement.env);
        }

        const execOptions = ["image", "stderr", "stdin", "stdout", "workdir"];
        for (const opt of execOptions) {
          if (executorElement[opt]) executor[opt] = executorElement[opt];
        }

        return executor;
      });
  };

  // Process env data
  private _processEnv = (
    envArray: Record<string, string>[]
  ): Record<string, string> =>
    envArray.reduce(
      (envObject, item) => ({
        ...envObject,
        [item.name]: item.value,
      }),
      {}
    );

  // Process volume data
  private _processVolumes = (value: Array<{ volume: string }>) =>
    value.map((vol) => vol.volume);

  // Process tags data
  private _processTags = (
    tagArray: Array<{ name: string; value: string }>
  ): Record<string, string> =>
    tagArray.reduce(
      (tagObject, item) => ({
        ...tagObject,
        [item.name]: item.value,
      }),
      {}
    );

  // Render component
  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @form-submit=${(e: any) => {
          this._submitForm(e.detail.form.data);
        }}
      >
      </ecc-utils-design-form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-lit-ga4gh-tes-create-run": TESCreateRun;
  }
}
