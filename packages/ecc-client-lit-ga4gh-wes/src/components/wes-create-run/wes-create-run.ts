import { html, LitElement } from "lit";
import "@elixir-cloud/design";

export class WESCreateRun extends LitElement {
  fields = [
    {
      key: "workflow_params",
      label: "Workflow Parameters",
      type: "text",
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "workflow_type",
      label: "Workflow Type",
      type: "text",
      fieldOptions: {
        required: false,
      },
    },
    {
      key: "workflow_type_version",
      label: "Workflow Type Version",
      type: "text",
    },
    {
      key: "workflow_engine",
      label: "Workflow Engine",
      type: "text",
    },
    {
      key: "workflow_engine_version",
      label: "Workflow Engine Version",
      type: "text",
    },
    {
      key: "workflow_url",
      label: "Workflow URL",
      type: "text",
    },
    {
      key: "workflow_attachment",
      label: "Workflow Attachment",
      type: "file",
    },
  ];

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @form-submit=${(e: { detail: any }) => {
          console.log("form - submitted", e.detail);
        }}
      ></ecc-utils-design-form>
    `;
  }
}
