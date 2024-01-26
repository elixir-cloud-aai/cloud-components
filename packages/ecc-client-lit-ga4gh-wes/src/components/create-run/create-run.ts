import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { postWorkflow } from "../../API/Workflow/wesGet.js";
import "@elixir-cloud/design/dist/components/form/index.js";

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

export default class ECCClientGA4GHWESCreateRuns extends LitElement {
  @property({ type: String }) private baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @state() private form: FormData = new FormData();
  @state() private fields: Field[] = [
    {
      key: "workflow_url",
      label: "Workflow URL",
      type: "text",
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "workflow_type",
      label: "Workflow type",
      type: "text",
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "workflow_type_version",
      label: "Workflow type version",
      type: "text",
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "workflow_params",
      label: "Workflow parameters",
      type: "text",
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "tags",
      label: "Tags",
      type: "text",
    },
    {
      key: "workflow_engine_parameters",
      label: "Workflow engine parameters",
      type: "text",
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
      label: "Workflow attachment",
      type: "file",
      fieldOptions: {
        multiple: true,
      },
    },
  ];

  async submitForm(form: any) {
    Object.keys(form).forEach((key) => {
      this.form.append(key, form[key]);
    });

    const eccUtilsDesignForm = this.shadowRoot?.querySelector(
      "ecc-utils-design-form"
    ) as any;

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
        breakPoint: "WESCreateRun.submitForm",
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
