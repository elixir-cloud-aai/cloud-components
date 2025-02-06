import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import "@elixir-cloud/design/dist/components/form/index.js";
import type { Field } from "@elixir-cloud/design/dist/components/form/index.js";
import styles from "./create-service.styles.js";
import type { ServiceCreatedEvent } from "../../events/index.js";
import { createService } from "../../API/Service/serviceGet.js";
import type { Service } from "../services/services.js";

export type CreateServiceForm = Omit<Service, "id">;

export default class ECCClientGa4ghServiceRegistryCreateService extends LitElement {
  static styles = styles;

  @property({ type: String })
  baseURL = "https://ga4gh-service-registry.rahtiapp.fi/ga4gh/registry/v1";

  @property({ type: String })
  authToken?: string;

  @state()
  private loading = false;

  @state()
  private error: string | null = null;

  private formFields: Field[] = [
    {
      key: "name",
      label: "Service Name",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip: "Name of this service. Should be human readable.",
      },
    },
    {
      key: "type",
      label: "Service Type",
      type: "group",
      fieldOptions: {
        required: true,
      },
      children: [
        {
          key: "group",
          label: "Group",
          type: "text",
          fieldOptions: {
            required: true,
            default: "org.ga4gh",
            tooltip:
              "Namespace in reverse domain name format. Use 'org.ga4gh' for implementations compliant with official GA4GH specifications.",
          },
        },
        {
          key: "artifact",
          label: "Artifact",
          type: "select",
          selectOptions: [
            { label: "TES", value: "tes" },
            { label: "WES", value: "wes" },
            { label: "DRS", value: "drs" },
          ],
          fieldOptions: {
            required: true,
            tooltip: "Name of the API or GA4GH specification implemented",
          },
        },
        {
          key: "version",
          label: "API Version",
          type: "text",
          fieldOptions: {
            required: true,
            tooltip:
              "Version of the API or specification. GA4GH specifications use semantic versioning.",
          },
        },
      ],
    },
    {
      key: "organization",
      label: "Organization",
      type: "group",
      fieldOptions: {
        required: true,
      },
      children: [
        {
          key: "name",
          label: "Organization Name",
          type: "text",
          fieldOptions: {
            required: true,
            tooltip: "Name of the organization responsible for the service",
          },
        },
        {
          key: "url",
          label: "Organization URL",
          type: "url",
          fieldOptions: {
            required: true,
            tooltip: "URL of the website of the organization",
          },
        },
      ],
    },
    {
      key: "version",
      label: "Service Version",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip: "Version of the service. Semantic versioning is recommended.",
      },
    },
    {
      key: "url",
      label: "Service URL",
      type: "url",
      fieldOptions: {
        required: true,
        tooltip:
          "Base URL of the service. For REST API services, this is the URL to which all endpoints should be relative.",
      },
    },
    {
      key: "description",
      label: "Description",
      type: "text",
      fieldOptions: {
        required: true,
        tooltip:
          "Description of the service. Should be human readable and provide information about the service.",
      },
    },
    {
      key: "environment",
      label: "Environment",
      type: "select",
      selectOptions: [
        { label: "Production", value: "prod" },
        { label: "Development", value: "dev" },
        { label: "Testing", value: "test" },
        { label: "Staging", value: "staging" },
      ],
      fieldOptions: {
        required: true,
        tooltip:
          "Environment the service is running in. Use this to distinguish between production, development and testing/staging deployments.",
      },
    },
    {
      key: "contactUrl",
      label: "Contact URL",
      type: "url",
      fieldOptions: {
        required: true,
        tooltip:
          "URL of the contact for the provider of this service, e.g. a link to a contact form or an email.",
      },
    },
    {
      key: "documentationUrl",
      label: "Documentation URL",
      type: "url",
      fieldOptions: {
        required: true,
        tooltip:
          "URL of the documentation of this service. This should help someone learn how to use your service.",
      },
    },
  ];

  private async handleSubmit(e: CustomEvent) {
    try {
      this.loading = true;
      this.error = null;
      const formData = e.detail;

      // Keep the nested structure instead of flattening it
      const serviceData = {
        ...formData.form.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Keep type and organization as objects
      } as CreateServiceForm;

      const service = await createService(
        this.baseURL,
        serviceData,
        this.authToken
      );

      this.dispatchEvent(
        new CustomEvent("service-created", {
          detail: service,
          bubbles: true,
          composed: true,
        }) as ServiceCreatedEvent
      );
    } catch (err) {
      this.error =
        err instanceof Error ? err.message : "Unknown error occurred";
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <ecc-utils-design-form
        .fields=${this.formFields}
        .loading=${this.loading}
        .error=${this.error}
        @ecc-utils-submit=${this.handleSubmit}
      >
      </ecc-utils-design-form>
    `;
  }
}
