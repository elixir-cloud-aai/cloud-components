import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@elixir-cloud/design";
import { getServiceInfo } from "../../API/Workflow/wesGet.js";

// TODO: Import the interfaces from design package

export interface Children {
  label?: string;
  path: string;
  copy?: boolean;
  defaultValue?: any;
}

export interface Field {
  tabGroup: string;
  children: Array<Children>;
}

interface FooterButton {
  key: string;
  name: string;
  size: "small" | "medium" | "large";
  variant: "primary" | "success" | "neutral" | "warning" | "danger";
  outline: boolean;
  pill: boolean;
}

@customElement("ecc-client-lit-ga4gh-wes-service-info")
export class WESServiceInfo extends LitElement {
  @property({ type: String }) baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @property({ type: Array }) fields: Array<Field> = [
    {
      tabGroup: "General Info",
      children: [
        { label: "ID", path: "id", copy: true },
        { label: "Name", path: "name" },
        { label: "Description", path: "description" },
        { label: "Type", path: "type" },
        { label: "Organization", path: "organization", copy: true },
        { label: "Contact URL", path: "contactUrl", copy: true },
        { label: "Documentation URL", path: "documentationUrl", copy: true },
        { label: "Environment", path: "environment" },
        { label: "Version", path: "version" },
        {
          label: "Auth Instructions URL",
          path: "auth_instructions_url",
          copy: true,
        },
        { label: "Created At", path: "createdAt" },
        { label: "Updated At", path: "updatedAt" },
      ],
    },
    {
      tabGroup: "Workflow",
      children: [
        {
          label: "Default workflow engine parameters",
          path: "default_workflow_engine_parameters",
        },
        {
          label: "workflow engine versions",
          path: "workflow_engine_versions",
          copy: true,
        },
        {
          label: "Workflow type versions",
          path: "workflow_type_versions",
          copy: true,
        },
      ],
    },
    {
      tabGroup: "Supported Features",
      children: [
        {
          label: "Supported Filesystem Protocols",
          path: "supported_filesystem_protocols",
        },
        { label: "Supported WES Versions", path: "supported_wes_versions" },
      ],
    },
    {
      tabGroup: "Meta",
      children: [
        {
          label: "System state counts",
          path: "system_state_counts",
        },
        { label: "Tags", path: "tags" },
      ],
    },
  ];

  @state() data: any = {};
  @state() buttons: Array<FooterButton> = [
    {
      key: "wes",
      name: "WES",
      size: "medium",
      variant: "primary",
      outline: false,
      pill: false,
    },
  ];

  protected firstUpdated(): void {
    this.fetchData();
  }

  async fetchData() {
    this.data = await getServiceInfo(this.baseURL);
  }

  render() {
    return html`
      <ecc-utils-design-details
        .data=${this.data}
        .fields=${this.fields}
        .buttons=${this.buttons}
        @ecc-utils-button-wes-click=${() => {
          window.open(
            "https://github.com/ga4gh/workflow-execution-service-schemas/tree/develop",
            "_blank"
          );
        }}
      ></ecc-utils-design-details>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-lit-ga4gh-wes-service-info": WESServiceInfo;
  }
}
