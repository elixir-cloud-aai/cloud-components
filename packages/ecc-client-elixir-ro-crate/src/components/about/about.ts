import { LitElement, html } from "lit";
import { state } from "lit/decorators.js";
// import EccUtilDesignForm from "@elixir-cloud/design/dist/react/form/index";
import "@elixir-cloud/design/dist/components/form/index.js";
import { Field } from "@elixir-cloud/design/dist/components/form/form";

export default class ECCCLientRoCrateAbout extends LitElement {
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
            tooltip: "Your house number",
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
      label: "About",
      type: "text",
      fieldOptions: {
        tooltip: "The subject matter of the content",
      },
    },
  ];

  static RelatedPeopleFields: Field[] = [
    // todo :  dropdown
    {
      key: "author",
      label: "Author",
      type: "text",
      fieldOptions: {
        default: "Choose a Type",
      },
    },
    {
      key: "pulisher",
      label: "Publisher",
      type: "text",
      fieldOptions: {
        default: "Choose a Type",
      },
    },
  ];

  static StructureFields: Field[] = [
    // todo :  dropdown
    {
      key: "HasPart",
      label: "Has Part",
      type: "text",
      fieldOptions: {
        default: "Choose a Type",
      },
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
              .fields=${ECCCLientRoCrateAbout.AboutFields}
            />`
          : ""}
        ${this.activeTab === 1
          ? html`<ecc-utils-design-form
              .fields=${ECCCLientRoCrateAbout.RelatedPeopleFields}
            />`
          : ""}
        ${this.activeTab === 2
          ? html`<ecc-utils-design-form
              .fields=${ECCCLientRoCrateAbout.StructureFields}
            />`
          : ""}
      </div>
    `;
  }
}
