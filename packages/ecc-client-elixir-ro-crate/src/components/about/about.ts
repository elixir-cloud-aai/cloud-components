import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
import "@elixir-cloud/design/dist/components/form/index.js";
import { Field } from "@elixir-cloud/design/dist/components/form/form";

export default class ECCClientRoCrateAbout extends LitElement {
  @state()
  private activeTab = 0;

  private _switchTab(index: number): void {
    this.activeTab = index;
  }
  private _handleDataset(e: CustomEvent): void {
    const licenceFieldIndex = this.AboutFields.findIndex(
      (field) => field.key === "licence"
    );
    const licenceChildren = this.AboutFields[licenceFieldIndex].children ?? [];
    if (licenceFieldIndex === -1) return;
    let updatedChildren: Array<Field> = [];

    if (e.detail.key === "licence" && e.detail.value === "URL") {
      updatedChildren = licenceChildren
        .filter((child) => child.key !== "@id")
        .filter((child) => child.key !== "@type")
        .filter((child) => child.key !== "name")
        .filter((child) => child.key !== "desc");

      const hasUrl = updatedChildren.some((child) => child.key === "url");
      if (!hasUrl) {
        updatedChildren.push({
          key: "url",
          label: "URL",
          type: "url",
          fieldOptions: {
            required: true,
          },
        });
      }
    } else if (
      e.detail.key === "licence" &&
      e.detail.value === "CreativeWork"
    ) {
      updatedChildren = licenceChildren.filter((child) => child.key !== "url");

      updatedChildren.push(
        {
          key: "@id",
          label: "@id",
          type: "text",
          fieldOptions: {
            required: true,
            tooltip: "Persistent, managed unique ID in URL format",
          },
        },
        {
          key: "@type",
          label: "@type",
          type: "text",
          fieldOptions: {
            default: "CreativeWork",
            required: true,
            tooltip: "The type of the entity.",
          },
        },
        {
          key: "name",
          label: "Name",
          type: "text",
          fieldOptions: {
            required: true,
            tooltip: "The name of the item.",
          },
        },
        {
          key: "desc",
          label: "Description",
          type: "text",
          fieldOptions: {
            required: true,
            tooltip: "A description of the item.",
          },
        }
      );
    }
    this.AboutFields = [
      ...this.AboutFields.slice(0, licenceFieldIndex),
      {
        ...this.AboutFields[licenceFieldIndex],
        children: updatedChildren,
      },
      ...this.AboutFields.slice(licenceFieldIndex + 1),
    ];
  }
  private _handleChangeContextualType(e: CustomEvent): void {
    const entityField: Field = {
      key: "entity",
      label: "Entity",
      type: "array",
      arrayOptions: {
        defaultInstances: 0,
      },
      children: [
        {
          key: "entityID",
          label: "@id",
          type: "url",
          fieldOptions: {
            required: true,
          },
        },
        {
          key: "entityType",
          label: "@type",
          type: "select",
          selectOptions: [
            { label: "Person", value: "Person" },
            { label: "Organisation", value: "Organisation" },
          ],
        },
        {
          key: "entityName",
          label: "Name",
          type: "text",
          fieldOptions: {
            required: true,
          },
        },
      ],
    };
    const updatedField = this.RelatedPeopleFields.map((f) =>
      f.key === "author-entities" ? { ...f, children: [] } : f
    );
    if (e.detail.value === "Person") {
      const personFields: Field[] = [
        {
          key: "orgURL",
          label: "URL",
          type: "url",
          fieldOptions: {
            required: false,
          },
        },
      ];
      entityField.children?.push(...personFields);
    } else if (e.detail.value === "Organisation") {
      const orgFields: Field[] = [
        {
          key: "orgURL",
          label: "URL",
          type: "url",
          fieldOptions: {
            required: true,
          },
        },
      ];
      entityField.children?.push(...orgFields);
    }
    updatedField.forEach((f) => {
      if (f.key === "author-entities") {
        f.children?.push(entityField);
      }
    });
    this.RelatedPeopleFields = updatedField;
  }
  @state()
  AboutFields: Field[] = [
    {
      key: "@id",
      label: "@id",
      type: "text",
      fieldOptions: {
        tooltip:
          "Persistent, managed unique ID in URL format (if available), for example a DOI for a collection or an ORCID, personal home page URL or email address for a person",
        default: "./",
        required: true,
      },
    },

    {
      key: "@type",
      label: "@type",
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
        required: true,
      },
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      fieldOptions: {
        tooltip: "A description of the item.",
        required: true,
      },
    },
    {
      key: "datePublished",
      label: "Date Published",
      type: "date",
      fieldOptions: {
        tooltip: "Date of first broadcast or publication.",
        required: true,
      },
    },
    {
      key: "licence",
      label: "Licence",
      type: "group",
      fieldOptions: {
        required: true,
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "licence",
          label: "Licence Type",
          type: "select",
          fieldOptions: {
            required: true,
          },
          selectOptions: [
            { label: "URL", value: "URL" },
            { label: "CreativeWork", value: "CreativeWork" },
          ],
        },
      ],
    },
  ];
  @state()
  RelatedPeopleFields: Field[] = [
    {
      key: "author-entities",
      label: "Author Entities",
      type: "group",
      fieldOptions: {
        required: false,
        default: "",
        tooltip: "The author of this content.",
      },
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "entity",
          label: "Entity",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "entityID",
              label: "@id",
              type: "url",
              fieldOptions: {
                required: true,
              },
            },
            {
              key: "entityType",
              label: "@type",
              type: "select",
              selectOptions: [
                { label: "Person", value: "Person" },
                { label: "Organisation", value: "Organisation" },
              ],
            },
            {
              key: "entityName",
              label: "Name",
              type: "text",
              fieldOptions: {
                required: true,
              },
            },
            {
              key: "orgURL",
              label: "URL",
              type: "url",
              fieldOptions: {
                required: false,
              },
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
              @ecc-utils-change=${(e: CustomEvent) => {
                this._handleDataset(e);
              }}
              .fields=${this.AboutFields}
            />`
          : ""}
        ${this.activeTab === 1
          ? html`<ecc-utils-design-form
              .fields=${this.RelatedPeopleFields}
              @ecc-utils-change=${(e: CustomEvent) => {
                this._handleChangeContextualType(e);
              }}
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
