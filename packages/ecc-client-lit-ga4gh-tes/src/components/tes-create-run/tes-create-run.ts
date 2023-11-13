import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { postTask } from "../../API/Task/tesGet.js";
import "@elixir-cloud/design";

@customElement("ecc-client-lit-ga4gh-tes-create-run")
export class TESCreateRun extends LitElement {
  @property({ type: String }) accessor baseURL =
    "https://protes.rahtiapp.fi/ga4gh/tes/v1";

  @state() accessor form: any = {};
  @state() accessor response: any = {};

  fields = [
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
              label: "Name",
              type: "text",
            },
            {
              key: "value",
              label: "Value",
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
      key: "PROJECT_GROUP",
      label: "Project group",
      type: "text",
    },
    {
      key: "WORKFLOW_ID",
      label: "Workflow ID",
      type: "text",
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

  resourcesTemp = ["cpu_cores", "disk_gb", "preemptible", "ram_gb", "zones"];
  tagsTemp = ["PROJECT_GROUP", "WORKFLOW_ID"];

  // Submit form function
  async submitForm(form: any) {
    const data: any = {};

    // Process the form data
    for (const [key, value] of Object.entries(form)) {
      // Handle form data based on keys
      if (key === "name" || key === "description") {
        data[key] = value;
      } else if (key === "executors") {
        data.executors = this.processExecutors(value);
      } else if (key === "inputs" || key === "outputs") {
        data[key] = this.processInputsOutputs(value);
      } else if (key === "volumes") {
        data.volumes = this.processVolumes(value);
      } else if (this.resourcesTemp.includes(key)) {
        data.resources = this.processResources(data.resources, key, value);
      } else if (this.tagsTemp.includes(key)) {
        data.tags = this.processTags(data.tags, key, value);
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
        if (this.response.run_id) {
          eccUtilsDesignForm.success({
            message: this.response.run_id,
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
  processExecutors = (value: any): any[] => {
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

        if (executorElement.image) executor.image = executorElement.image;
        if (executorElement.stderr) executor.stderr = executorElement.stderr;
        if (executorElement.stdin) executor.stdin = executorElement.stdin;
        if (executorElement.stdout) executor.stdout = executorElement.stdout;
        if (executorElement.workdir) executor.workdir = executorElement.workdir;

        return executor;
      });
  };

  // Process env data
  processEnv = (envArray: any[]): any => {
    envArray.reduce(
      (envObject: any, item: any) => ({
        ...envObject,
        [item.name]: item.value,
      }),
      {}
    );
  };

  // Process inputs and outputs data
  processInputsOutputs = (value: any): any[] => {
    if (!Array.isArray(value)) return [];

    return value
      .filter(
        (itemElement: any) =>
          typeof itemElement === "object" &&
          Object.entries(itemElement).length !== 0 &&
          itemElement !== null
      )
      .map((itemElement: any) => ({
        path:
          typeof itemElement.path === "string" ? itemElement.path : undefined,
        url: typeof itemElement.url === "string" ? itemElement.url : undefined,
      }));
  };

  // Process volume data
  processVolumes = (value: any): string[] =>
    (value as any)
      .filter((vol: any) => typeof vol.volume === "string")
      .map((vol: any) => vol.volume);

  // Process resources data
  processResources = (resources: any, key: string, value: any): any => {
    let updatedResources = { ...resources };
    if (!updatedResources) updatedResources = {};
    updatedResources[key] = value;
    return updatedResources;
  };

  // Process tags data
  processTags = (tags: any, key: string, value: any): any => {
    let updatedTags = { ...tags };
    if (!tags) updatedTags = {};
    updatedTags[key] = value;
    return updatedTags;
  };

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
