import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import "@elixir-cloud/design/dist/components/form/index.js";
import { Field } from "@elixir-cloud/design/dist/components/form/form";

export default class ECCClientRoCrateAbout extends LitElement {
  @state()
  private activeTab = 0;

  // Method to switch tabs
  private _switchTab(index: number) {
    this.activeTab = index;
  }

  static AboutFields: Field[] = [
    {
      key: "@id",
      label: "@id",
      type: "text",
      fieldOptions: {
        tooltip:
          "Persistent, managed unique ID in URL format (if available), for example a DOI for a collection or an ORCID, personal home page URL or email address for a person",
        default: "./",
      },
    },

    {
      key: "@type",
      label: "Type",
      type: "array",
      fieldOptions: {
        tooltip: "The type of the entity.",
      },
      arrayOptions: {
        defaultInstances: 1,
        max: 3,
      },
      children: [
        {
          key: "Type",
          label: "Select",
          type: "text",
          fieldOptions: {
            required: true,
            default: "Dataset",
          },
        },
      ],
    },

    {
      key: "name",
      label: "Name",
      type: "text",
      fieldOptions: {
        tooltip: "The name of the item.",
      },
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      fieldOptions: {
        tooltip: "A description of the item.",
      },
    },
    {
      key: "datePublished",
      label: "Date Published",
      type: "date",
      fieldOptions: {
        tooltip: "Date of first broadcast or publication.",
      },
    },
    {
      key: "about",
      label: "About Dataset",
      type: "array",
      fieldOptions: {
        required: true,
        default: "",
      },
      arrayOptions: {
        defaultInstances: 0,
      },

      children: [
        {
          key: "datasetInput",
          label: "Dataset",
          type: "group",
          fieldOptions: {
            tooltip: "Enter Text",
          },
          groupOptions: {
            collapsible: true,
          },
          children: [
            {
              key: "@id",
              label: "@id",
              type: "text",
              fieldOptions: {
                tooltip:
                  "Persistent, managed unique ID in URL format (if available), for example a DOI for a collection or an ORCID, personal home page URL or email address for a person",
                default: "./",
              },
            },

            {
              key: "@type",
              label: "Type",
              type: "array",
              fieldOptions: {
                tooltip: "The type of the entity.",
              },
              arrayOptions: {
                defaultInstances: 1,
                max: 3,
              },
              children: [
                {
                  key: "Type",
                  label: "Select",
                  type: "text",
                  fieldOptions: {
                    required: true,
                    default: "Dataset",
                  },
                },
              ],
            },

            {
              key: "name",
              label: "Name",
              type: "text",
              fieldOptions: {
                tooltip: "The name of the item.",
              },
            },
            {
              key: "description",
              label: "Description",
              type: "text",
              fieldOptions: {
                tooltip: "A description of the item.",
              },
            },
            {
              key: "datePublished",
              label: "Date Published",
              type: "date",
              fieldOptions: {
                tooltip: "Date of first broadcast or publication.",
              },
            },
          ],
        },
      ],
    },
  ];

  static RelatedPeopleFields: Field[] = [
    {
      key: "author",
      label: "Author",
      type: "group",
      fieldOptions: {
        required: false,
        default: "",
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "text",
          label: "Text",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "textInput",
              label: "Text",
              type: "text",
              fieldOptions: {
                tooltip: "Enter Text",
              },
            },
          ],
        },
        {
          key: "number",
          label: "Number",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "numberInput",
              label: "Number",
              type: "number",
              fieldOptions: {
                tooltip: "Enter Number",
              },
            },
          ],
        },
        {
          key: "entity",
          label: "Entity",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "entityInput",
              label: "Entity",
              type: "number",
            },
          ],
        },
      ],
    },
    {
      key: "publisher",
      label: "Publisher",
      type: "group",
      fieldOptions: {
        required: false,
        default: "",
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "text",
          label: "Text",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "textInput",
              label: "Text",
              type: "text",
              fieldOptions: {
                tooltip: "Enter Text",
              },
            },
          ],
        },
        {
          key: "number",
          label: "Number",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "numberInput",
              label: "Number",
              type: "number",
              fieldOptions: {
                tooltip: "Enter Number",
              },
            },
          ],
        },
        {
          key: "entity",
          label: "Entity",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "entityInput",
              label: "Entity",
              type: "number",
            },
          ],
        },
      ],
    },
    {
      key: "funder",
      label: "Funder",
      type: "group",
      fieldOptions: {
        required: false,
        default: "",
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "text",
          label: "Text",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "textInput",
              label: "Text",
              type: "text",
              fieldOptions: {
                tooltip: "Enter Text",
              },
            },
          ],
        },
        {
          key: "number",
          label: "Number",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "numberInput",
              label: "Number",
              type: "number",
              fieldOptions: {
                tooltip: "Enter Number",
              },
            },
          ],
        },
        {
          key: "entity",
          label: "Entity",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
            max: 1,
          },
          children: [
            {
              key: "entityInput",
              label: "Entity",
              type: "number",
            },
          ],
        },
      ],
    },
  ];

  static StructureFields: Field[] = [
    {
      key: "hasPart",
      label: "Has Part",
      type: "array",
      fieldOptions: {
        required: false,
        default: "",
      },
      arrayOptions: {
        defaultInstances: 0,
      },
      children: [
        {
          key: "entity",
          label: "Entity",
          type: "group",
          groupOptions: {
            collapsible: true,
          },
          children: [
            {
              key: "type",
              label: "Type",
              type: "select",
              fieldOptions: {
                default: "Dataset",
              },
              selectOptions: [
                {
                  label: "Dataset",
                  value: "Dataset",
                },
                {
                  label: "File",
                  value: "File",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  render() {
    return html`
      <div class="tabs">
        <div
          class="tab ${this.activeTab === 0 ? "active" : ""}"
          @click="${() => this._switchTab(0)}"
        >
          About
        </div>
        <div
          class="tab ${this.activeTab === 1 ? "active" : ""}"
          @click="${() => this._switchTab(1)}"
        >
          Related People, Orgs & Works
        </div>
        <div
          class="tab ${this.activeTab === 2 ? "active" : ""}"
          @click="${() => this._switchTab(2)}"
        >
          Structure
        </div>
      </div>
      <div class="content">
        ${this.activeTab === 0
          ? html`<ecc-utils-design-form
              .fields=${ECCClientRoCrateAbout.AboutFields}
            />`
          : ""}
        ${this.activeTab === 1
          ? html`<ecc-utils-design-form
              .fields=${ECCClientRoCrateAbout.RelatedPeopleFields}
            />`
          : ""}
        ${this.activeTab === 2
          ? html`<ecc-utils-design-form
              .fields=${ECCClientRoCrateAbout.StructureFields}
            />`
          : ""}
      </div>
    `;
  }
}
