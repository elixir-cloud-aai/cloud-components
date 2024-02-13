/* eslint-disable lit/no-classfield-shadowing */
import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { postTask } from "../../API/Task/tesGet.js";
import { Executor, postTaskForm } from "./types.js";
import "@elixir-cloud/design/dist/components/form/index.js";

// TODO: import the interface from the design package
interface Field {
  key: string;
  label: string;
  type?:
    | "text"
    | "date"
    | "number"
    | "email"
    | "password"
    | "tel"
    | "url"
    | "search"
    | "datetime-local"
    | "time"
    | "array"
    | "switch"
    | "file"
    | "group";
  fieldOptions?: {
    required?: boolean;
    default?: string | boolean;
    multiple?: boolean;
    accept?: string;
    returnIfEmpty?: string;
    tooltip?: string;
  };
  arrayOptions?: {
    defaultInstances?: number;
    max?: number;
    min?: number;
  };
  groupOptions?: {
    collapsible: boolean;
  };
  error?: string;
  children?: Array<Field>;
}

@customElement("ecc-client-lit-ga4gh-tes-create-run")
export class TESCreateRun extends LitElement {
  @property({ type: String }) baseURL =
    "https://protes.rahtiapp.fi/ga4gh/tes/v1";

  @state() form: postTaskForm = {
    executors: [
      {
        command: [],
        image: "",
      },
    ],
  };

  @state() response: any = {};

  @state() private fields: Array<Field> = [
    {
      key: "name",
      label: "Name",
      type: "text",
      fieldOptions: {
        tooltip: "Task name.",
      },
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      fieldOptions: {
        tooltip: "Task description for documentation purposes.",
      },
    },
    {
      key: "executors",
      label: "Executors",
      type: "group",
      fieldOptions: {
        required: true,
        tooltip:
          "A sequence of program arguments to execute, where the first argument is the program to execute (i.e. argv).",
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "executors",
          label: "",
          type: "array",
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
                tooltip:
                  "A sequence of program arguments to execute, where the first argument is the program to execute (i.e. argv).",
              },
              arrayOptions: {
                defaultInstances: 1,
                min: 1,
              },
              children: [
                {
                  key: "command",
                  label: "",
                  type: "text",
                },
              ],
            },
            {
              key: "env",
              label: "Env",
              type: "array",
              fieldOptions: {
                tooltip: "Enviromental variables to set within the container",
              },
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
                tooltip:
                  " Name of the container image. The string will be passed as the image argument to the containerization run command.",
              },
            },
            {
              key: "stderr",
              label: "STDERR",
              type: "text",
              fieldOptions: {
                tooltip:
                  "Path inside the container to a file where the executor's stderr will be written to. Must be an absolute path.",
              },
            },
            {
              key: "stdin",
              label: "STDIN",
              type: "text",
              fieldOptions: {
                tooltip:
                  "Path inside the container to a file where the executor's stdout will be written to. Must be an absolute path.",
              },
            },
            {
              key: "stdout",
              label: "STDOUT",
              type: "text",
              fieldOptions: {
                tooltip:
                  "Path inside the container to a file where the executor's stdout will be written to. Must be an absolute path.",
              },
            },
            {
              key: "workdir",
              label: "Workdir",
              type: "text",
              fieldOptions: {
                tooltip:
                  "The working directory that the command will be executed in. If not defined, the system will default to the directory set by the container image.",
              },
            },
          ],
        },
      ],
    },
    {
      key: "inputs",
      label: "Inputs",
      type: "group",
      fieldOptions: {
        tooltip:
          "Input files that will be used by the task. Inputs will be downloaded and mounted into the executor container as defined by the task request document.",
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "inputs",
          label: "",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "path",
              label: "Path",
              type: "text",
              fieldOptions: {
                tooltip:
                  "Path of the file inside the container. Must be an absolute path.",
              },
            },
            {
              key: "url",
              label: "URL",
              type: "text",
              fieldOptions: {
                tooltip:
                  "REQUIRED, unless content is set. URL in long term storage, for example:- s3://my-object-store/file1.",
              },
            },
          ],
        },
      ],
    },
    {
      key: "outputs",
      label: "Outputs",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      fieldOptions: {
        tooltip: "Output describes Task output files.",
      },
      children: [
        {
          key: "outputs",
          label: "",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "path",
              label: "Path",
              type: "text",
              fieldOptions: {
                tooltip:
                  "Path of the file inside the container. Must be an absolute path.",
              },
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
              fieldOptions: {
                tooltip:
                  "URL at which the TES server makes the output accessible after the task is complete.",
              },
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
          fieldOptions: {
            tooltip: "Number of CPUs requested for the task.",
          },
        },
        {
          key: "disk_gb",
          label: "Disk space",
          type: "number",
          fieldOptions: {
            tooltip: "Disk space required in gigabytes (GB).",
          },
        },
        {
          key: "ram_gb",
          label: "Ram space",
          type: "number",
          fieldOptions: {
            tooltip: "RAM required in gigabytes (GB).",
          },
        },
        {
          key: "zones",
          label: "Zones",
          type: "text",
          fieldOptions: {
            tooltip: "Compute zones in which the task should be run.",
          },
        },
        {
          key: "preemptible",
          label: "Preemptible",
          type: "switch",
          fieldOptions: {
            tooltip:
              "Define if the task is allowed to run on preemptible compute instances, for example: AWS Spot.",
          },
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
      fieldOptions: {
        tooltip:
          "Directories which may be used to share data between Executors. Volumes are initialized as empty directories by the system when the task starts and are mounted at the same path in each Executor.",
      },
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
        @ecc-utils-submit=${(e: any) => {
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
