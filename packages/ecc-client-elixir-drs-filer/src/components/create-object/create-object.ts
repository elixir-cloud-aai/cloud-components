/* eslint-disable camelcase */

import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import EccUtilsDesignForm, {
  Field,
} from "@elixir-cloud/design/dist/components/form/index.js";
import type { EccUtilsButtonClickEvent } from "@elixir-cloud/design/src/events/index.js";
import { postObject } from "../../API/Object/drsAPI.js";

export interface Checksum {
  checksum: string;
  type: string;
}

export interface AccessMethods {
  type: string;
  accessUrl?: string;
  accessId?: string;
  region?: string;
}

export interface Contents {
  name: string;
  id?: string;
  drs_uri: string[];
  contents?: Contents[];
}

export interface postObjectForm {
  id: string;
  name?: string;
  self_uri: string;
  size: number;
  createdTime: Date;
  updatedTime?: Date;
  version?: string;
  mimeType?: string;
  checksum: Checksum[];
  accessMethods: AccessMethods[];
  contents: Contents[];
  description?: string;
  aliases?: string[];
}

/**
 * @summary This component is used to create object using DRS API.
 * @since 1.0.0
 *
 * @property {string} baseURL - Base URL
 *
 */

export default class ECCCLientElixirDrsCreateObject extends LitElement {
  @property({ type: String }) private baseURL =
    "http://localhost:8080/ga4gh/drs/v1";

  @state() form: postObjectForm = {
    id: "",
    self_uri: "",
    size: 0,
    createdTime: new Date(),
    checksum: [],
    accessMethods: [],
    contents: [],
  };

  @state() private response: any = {};

  @state() private fields: Field[] = [
    {
      key: "id",
      label: "ID",
      type: "text",
    },
    {
      key: "name",
      label: "Name",
      type: "text",
    },
    {
      key: "self_uri",
      label: "Self URI",
      type: "text",
    },
    {
      key: "size",
      label: "Size",
      type: "number",
    },
    {
      key: "created_time",
      label: "Created Time",
      type: "datetime-local",
    },
    {
      key: "updated_time",
      label: "Updated Time",
      type: "datetime-local",
    },
    {
      key: "version",
      label: "Version",
      type: "text",
    },
    {
      key: "mime_type",
      label: "Mime Type",
      type: "text",
    },
    {
      key: "checksums",
      label: "Checksums",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "checksums",
          label: "",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "checksum",
              label: "Checksum",
              type: "text",
            },
            {
              key: "type",
              label: "Type",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      key: "access_methods",
      label: "Access Methods",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "access_methods",
          label: "",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "type",
              label: "Type",
              type: "select",
              fieldOptions: {
                required: true,
              },
              selectOptions: [
                { label: "s3", value: "1" },
                { label: "gs", value: "2" },
                { label: "ftp", value: "3" },
                { label: "gsiftp", value: "4" },
                { label: "globus", value: "5" },
                { label: "htsget", value: "6" },
                { label: "https", value: "7" },
                { label: "file", value: "8" },
              ],
            },
            {
              key: "access_url",
              label: "Access URL",
              type: "group",
              groupOptions: {
                collapsible: true,
              },
              children: [
                {
                  key: "url",
                  label: "URL",
                  type: "text",
                },
                {
                  key: "headers",
                  label: "Headers",
                  type: "array",
                  arrayOptions: {
                    defaultInstances: 0,
                  },
                  children: [
                    {
                      key: "header",
                      label: "Header",
                      type: "text",
                    },
                  ],
                },
              ],
            },
            {
              key: "access_id",
              label: "Access Id",
              type: "text",
            },
            {
              key: "region",
              label: "Region",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      key: "contents",
      label: "Contents",
      type: "group",
      groupOptions: {
        collapsible: true,
      },
      children: [
        {
          key: "contents",
          label: "",
          type: "array",
          arrayOptions: {
            defaultInstances: 0,
          },
          children: [
            {
              key: "name",
              label: "Name",
              type: "text",
            },
            {
              key: "id",
              label: "Id",
              type: "text",
            },
            {
              key: "drs_uri",
              label: "DRS_URI",
              type: "array",
              arrayOptions: {
                defaultInstances: 0,
              },
              children: [
                {
                  key: "url",
                  label: "URL",
                  type: "text",
                },
              ],
            },
            {
              key: "contents",
              label: "Content",
              type: "array",
              arrayOptions: {
                defaultInstances: 0,
              },
              children: [
                {
                  key: "name",
                  label: "Name",
                  type: "text",
                },
                {
                  key: "id",
                  label: "Id",
                  type: "text",
                },
                {
                  key: "drs_uri",
                  label: "DRS_URI",
                  type: "array",
                  arrayOptions: {
                    defaultInstances: 0,
                  },
                  children: [
                    {
                      key: "url",
                      label: "URL",
                      type: "text",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      key: "description",
      label: "Description",
      type: "text",
    },
    {
      key: "aliases",
      label: "Aliases",
      type: "array",
      arrayOptions: {
        defaultInstances: 0,
      },
      children: [
        {
          key: "aliase",
          label: "Aliase",
          type: "text",
        },
      ],
    },
  ];

  /**
   * Logs the error if UI breaks else uses public method of `ecc-utils-design-form` to show error on UI
   * @param message Error message
   * @param breakMethod The class method where the error occured
   */
  private _handleError(message: string, breakMethod: string) {
    const eccUtilsDesignForm =
      this.shadowRoot?.querySelector<EccUtilsDesignForm>(
        "ecc-utils-design-form"
      );
    if (eccUtilsDesignForm) {
      eccUtilsDesignForm.error({
        message,
      });
    } else {
      console.error({
        message: "ecc-utils-design-form not found",
        breakPoint: `ECCCLientElixirDrsCreateObject.${breakMethod}`,
      });
    }
  }

  // Extracting the API call into a separate method
  private async _callAPI(data: any) {
    try {
      const eccUtilsDesignForm =
        this.shadowRoot?.querySelector<EccUtilsDesignForm>(
          "ecc-utils-design-form"
        );
      if (eccUtilsDesignForm) {
        eccUtilsDesignForm.loading();
        this.response = await postObject(this.baseURL, data);

        if (this.response.id) {
          eccUtilsDesignForm.success({
            message: this.response.id,
          });
        } else {
          this._handleError(this.response.message, "callAPI");
        }
      } else {
        console.error({
          message: "ecc-utils-design-form not found",
          breakPoint: "ECCCLientElixirDrsCreateObject.callApi",
        });
      }
    } catch (error) {
      this._handleError("Internal Server Error", "callAPI");
    }
  }

  // form submit method
  private async _submitForm(form: any) {
    const data: any = {};
    // Process the form data
    for (const [key, value] of Object.entries(form)) {
      switch (key) {
        case "id":
        case "name":
        case "self_uri":
        case "size":
        case "createdTime":
        case "updatedTime":
        case "version":
        case "mimeType":
        case "checksum":
          data.checksum = (value as { checksum: unknown }).checksum;
          break;
        case "inputs":
          data.inputs = (value as { inputs: unknown }).inputs;
          break;
        case "outputs":
          data.output = (value as { outputs: unknown }).outputs;
          break;
        case "accessMethods":
          data.accessMethods = (
            value as { accessMethods: unknown }
          ).accessMethods;
          break;
        case "contents":
          data.contents = (value as { contents: unknown }).contents;
          break;
        case "description":
        case "aliases":
          data.aliases = this._processAlias(value as any);
          break;
        default:
          break;
      }
    }

    this.form = data;

    try {
      await this._callAPI(data);
    } catch (error) {
      this._handleError("Couldn't call the API", "submitForm");
    }
  }

  // Process alias data
  private _processAlias = (value: Array<{ alias: string }>) =>
    value.map((vol) => vol.alias);

  // Render component
  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.fields}
        @ecc-utils-submit=${(e: EccUtilsButtonClickEvent) => {
          this._submitForm(e.detail.form.data);
        }}
      >
      </ecc-utils-design-form>
    `;
  }
}
