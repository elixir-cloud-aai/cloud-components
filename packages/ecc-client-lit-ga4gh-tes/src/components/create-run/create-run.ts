import { html, LitElement } from "lit";
import "@elixir-cloud/design";

export class CreateRun extends LitElement {
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
      children: [
        {
          key: "command",
          label: "Command",
          type: "array",
          fieldOptions: {
            required: true,
          },
          children: [
            {
              key: "name",
              label: "Name",
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
      label: "CPU Cores",
      type: "number",
    },
    {
      key: "disk_gb",
      label: "Disk Gb",
      type: "number",
    },
    {
      key: "ram_gb",
      label: "Ram Gb",
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
      label: "Project Group",
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
      children: [
        {
          key: "volumes",
          label: "Volume",
          type: "text",
        },
      ],
    },
  ];

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @form-submit=${(e: any) => {
          console.log("form - submitted", e.detail);
        }}
      >
      </ecc-utils-design-form>
    `;
  }
}
