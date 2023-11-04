import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";
// import { postWorkflow } from "../../API/Workflow/wesGet";
import "@elixir-cloud/design";

export class WESCreateRun extends LitElement {
  @property({ type: Object }) form: any = {};
  @property({ type: String }) baseURL = "";

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
        required: true,
      },
    },
    {
      key: "workflow_type_version",
      label: "Workflow Type Version",
      type: "text",
      fieldOptions: {
        required: true,
      },
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
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "workflow_attachment",
      label: "Workflow Attachment",
      type: "file",
    },
  ];

  submitForm(form: any) {
    this.form = form;
    console.log(form);
  }

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @form-submit=${(e: CustomEvent) => {
          this.submitForm(e.detail);
        }}
      ></ecc-utils-design-form>
    `;
  }
}
