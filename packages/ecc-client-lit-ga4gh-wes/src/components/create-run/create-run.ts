import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import EccUtilsDesignForm, {
  Field,
} from "@elixir-cloud/design/src/components/form/index.js";
import { postWorkflow } from "../../API/Workflow/wesGet.js";

/**
 * @summary This component is used to create task runs using WES API.
 * @since 1.0.0
 *
 * @property {string} baseURL - Base URL
 *
 */

export default class ECCClientGa4ghWesCreateRuns extends LitElement {
  @state() private form: FormData = new FormData();
  @property({ type: String }) private baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @state() fields: Field[] = [
    {
      key: "workflow_url",
      label: "URL",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip:
          "An absolute URL to a workflow file that is accessible by the WES endpoint, or a relative URL corresponding to one of the files attached using `workflow_attachment`.",
      },
    },
    {
      key: "workflow_type",
      label: "Type",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip:
          "The type of workflow language and must be CWL or WDL currently.",
      },
    },
    {
      key: "workflow_type_version",
      label: "Type version",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip:
          "The version of the workflow language submitted and must be one supported by this WES instance.",
      },
    },
    {
      key: "workflow_params",
      label: "Parameters",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip:
          "JSON object specifies input parameters, such as input files. The exact format of the JSON object depends on the conventions of the workflow language being used. Input files should either be absolute URLs, or relative URLs corresponding to files uploaded using `workflow_attachment`.",
      },
    },
    {
      key: "tags",
      label: "Tags",
      type: "text",
      fieldOptions: {
        tooltip:
          "Arbitrary key/value tags added by the client during run creation.",
      },
    },
    {
      key: "workflow_engine_parameters",
      label: "Engine parameters",
      type: "text",
      fieldOptions: {
        tooltip:
          "Each workflow engine can present additional parameters that can be sent to the workflow engine. This message will list the default values, and their types for each workflow engine.",
      },
    },
    // {
    // 	key: 'workflow_engine',
    // 	label: 'Workflow Engine',
    // 	type: 'text',
    // },
    // {
    // 	key: 'workflow_engine_version',
    // 	label: 'Workflow Engine Version',
    // 	type: 'text',
    // },
    {
      key: "workflow_attachment",
      label: "Attachment",
      type: "file",
      fieldOptions: {
        multiple: true,
        tooltip:
          "Used to upload files that are required to execute the workflow, including the primary workflow, tools imported by the workflow, other files referenced by the workflow, or files which are part of the input.",
      },
    },
  ];

  async submitForm(form: any) {
    Object.keys(form).forEach((key) => {
      this.form.append(key, form[key]);
    });

    const eccUtilsDesignForm =
      this.shadowRoot?.querySelector<EccUtilsDesignForm>(
        "ecc-utils-design-form"
      );

    if (eccUtilsDesignForm) {
      eccUtilsDesignForm.loading();

      try {
        const response = await postWorkflow(this.baseURL, this.form);

        if (response.run_id) {
          eccUtilsDesignForm.success({
            message: response.run_id,
          });
        } else {
          eccUtilsDesignForm.error({
            message: response.message,
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
        breakPoint: "ECCClientGa4ghWesCreateRuns.submitForm",
      });
    }
  }

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @ecc-utils-submit=${(e: CustomEvent) => {
          this.submitForm(e.detail.form.data);
        }}
      ></ecc-utils-design-form>
    `;
  }
}
