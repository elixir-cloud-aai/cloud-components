import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { postTask } from "../../API/Task/tesGet.js";
import { Executor, postTaskForm, Resources } from "./types.js";
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

  private resourcesTemp = [
    "cpu_cores",
    "disk_gb",
    "preemptible",
    "ram_gb",
    "zones",
  ];

  // Submit form function
  private async submitForm(form: any) {
    const data: any = {};

    // Process the form data
    for (const [key, value] of Object.entries(form)) {
      // Handle form data based on keys
      if (key === "name" || key === "description") {
        data[key] = value;
      } else if (key === "executors") {
        data.executors = this.processExecutors(value);
      } else if (key === "volumes") {
        data.volumes = this.processVolumes(value as any);
      } else if (key === "tags") {
        data.tags = this.processTags(value as any);
      } else if (this.resourcesTemp.includes(key)) {
        data.resources = this.processResources(
          data.resources as Resources,
          key as keyof Resources,
          value as any
        );
      }
    }

    this.form = data;

    const eccUtilsDesignForm = this.shadowRoot?.querySelector(
      "ecc-utils-design-form"
    ) as any;

    if (eccUtilsDesignForm) {
      eccUtilsDesignForm.loading();
      this.response = await postTask(this.baseURL, data);

      try {
        if (this.response.id) {
          eccUtilsDesignForm.success({
            message: this.response.id,
          });
        } else {
          eccUtilsDesignForm.error({
            message: this.response.message,
          });
        }
      } catch (error) {
        eccUtilsDesignForm.error({
          message: "Internal Server Error",
        });
      }
    } else {
      console.error({
        message: "ecc-utils-design-form not found",
        breakPoint: "TESCreateRun.submitForm",
      });
    }
  }

  // Process executors data
  private processExecutors = (value: any): Executor[] => {
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
          executor.env = this.processEnv(executorElement.env);
        }

        const execOptions = ["image", "stderr", "stdin", "stdout", "workdir"];
        for (const opt of execOptions) {
          if (executorElement[opt]) executor[opt] = executorElement[opt];
        }

        return executor;
      });
  };

  // Process env data
  private processEnv = (
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
  private processVolumes = (value: Array<{ volume: string }>) =>
    value.map((vol) => vol.volume);

  // Process resources data
  private processResources = (
    resources: Resources,
    key: keyof Resources,
    value: any
  ): Resources => {
    let updatedResources: Resources = { ...resources };
    if (!updatedResources) updatedResources = {};
    updatedResources[key] = value;
    return updatedResources;
  };

  // Process tags data
  private processTags = (
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
          this.submitForm(e.detail.form.data);
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
