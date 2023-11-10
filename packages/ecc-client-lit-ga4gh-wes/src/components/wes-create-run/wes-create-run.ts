import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { postWorkflow } from "../../API/Workflow/wesGet.js";
import "@elixir-cloud/design";

@customElement("ecc-client-lit-ga4gh-wes-create-run")
export class WESCreateRun extends LitElement {
  @state() private form: FormData = new FormData();
  @property({ type: String }) private baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

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
    // {
    // 	key: 'workflow_engine',
    // 	label: 'Workflow Engine',
    // 	type: 'text',
    // },
    {
      key: "workflow_engine_parameters",
      label: "Workflow Engine Parameters",
      type: "text",
    },
    // {
    // 	key: 'workflow_engine_version',
    // 	label: 'Workflow Engine Version',
    // 	type: 'text',
    // },
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

  private async submitForm(form: any) {
    Object.keys(form).forEach((key) => {
      this.form.append(key, form[key]);
    });

    const response = await postWorkflow(this.baseURL, this.form);
    console.log(response);
  }

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @form-submit=${(e: CustomEvent) => {
          this.submitForm(e.detail.form.data);
        }}
      ></ecc-utils-design-form>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-lit-ga4gh-wes-create-run": WESCreateRun;
  }
}
