import { html, LitElement } from "lit";
import "@elixir-cloud/design";

export class CreateRun extends LitElement {
  fields = [
    {
      key: "name",
      label: "Name",
      type: "text",
      fieldOptions: {
        required: true,
      },
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      fieldOptions: {
        // required: false,
      },
    },
    {
      key: "address",
      label: "Address",
      type: "array",
      children: [
        {
          key: "street",
          label: "Street",
          type: "text",
          fieldOptions: {
            // required: false,
          },
        },
        {
          key: "city",
          label: "City",
          type: "text",
          fieldOptions: {
            required: true,
          },
        },
        {
          key: "isPrimary",
          label: "Primary",
          type: "switch",
        },
      ],
    },
    {
      key: "18+",
      label: "18+",
      type: "switch",
      switchOptions: {
        default: true,
      },
    },
    {
      key: "id",
      label: "ID",
      type: "file",
      fieldOptions: {
        required: true,
      },
    },
  ];

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @form-submit=${(e) => {
          console.log("form - submitted", e.detail);
        }}
      >
      </ecc-utils-design-form>
    `;
  }
}
