import { html, LitElement, render } from "lit";
import { property, state } from "lit/decorators.js";
import "@elixir-cloud/design/dist/components/collection/index.js";
import EccUtilsDesignCollection, {
  FilterProp,
  ItemProp,
} from "@elixir-cloud/design/dist/components/collection";
import "@elixir-cloud/design/dist/components/details/index.js";
import EccUtilsDesignDetails, {
  Field,
  Action,
} from "@elixir-cloud/design/dist/components/details";
import styles from "./services.styles.js";
import { fetchServices } from "../../API/Service/serviceGet.js";

export interface Service {
  id: string;
  name: string;
  description?: string;
  type: {
    group: string;
    artifact: string;
    version: string;
  };
  organization: {
    name: string;
    url: string;
  };
  version: string;
  url?: string;
  contactUrl?: string;
  documentationUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  environment?: string;
}

export default class ECCClientGa4ghServiceRegistryServices extends LitElement {
  static styles = styles;

  @property({ type: String })
  baseURL = "https://ga4gh-service-registry.rahtiapp.fi/ga4gh/registry/v1";

  @property({ type: String })
  authToken?: string;

  @state()
  private services: Service[] = [];

  @state()
  private loading = true;

  @state()
  private error: string | null = null;

  private cache = new Map<string, Service>();

  @property({ type: Number })
  pageSize = 5;

  @state()
  private currentPage = 1;

  private fields: Field[] = [
    {
      key: "name",
      path: "name",
      label: "Name",
    },
    {
      key: "type",
      path: "type",
      label: "Type",
    },
    {
      key: "organization",
      path: "organization",
      label: "Organization",
    },
    {
      key: "version",
      path: "version",
      label: "Version",
    },
    {
      key: "url",
      path: "url",
      label: "URL",
    },
  ];

  private filters: FilterProp[] = [
    {
      key: "type",
      type: "select",
      options: ["TES", "WES", "DRS"],
      placeholder: "Filter by type",
      selectConfig: {
        multiple: false,
      },
    },
    {
      key: "organization",
      type: "search",
      placeholder: "Search by organization",
    },
  ];

  private columns: ItemProp[] = [
    {
      index: 0,
      key: "name",
      name: "Name",
    },
    {
      index: 1,
      key: "type",
      name: "Type",
      tag: {
        name: "type",
        type: "primary",
      },
    },
    {
      index: 2,
      key: "organization",
      name: "Organization",
    },
    {
      index: 3,
      key: "version",
      name: "Version",
    },
  ];

  async connectedCallback() {
    super.connectedCallback();
    await this.fetchServices();
  }

  private async fetchServices() {
    try {
      const services = await fetchServices(this.baseURL, this.authToken);
      this.services = services;
    } catch (err) {
      // console.error("Error fetching services:", err);
      this.error =
        err instanceof Error ? err.message : "Unknown error occurred";
    } finally {
      this.loading = false;
    }
  }

  private async _handleExpandItem(event: CustomEvent) {
    const eccUtilsDesignCollection =
      this.shadowRoot?.querySelector<EccUtilsDesignCollection>(
        "ecc-utils-design-collection"
      );

    if (!eccUtilsDesignCollection) {
      // console.error({
      //   error: "ecc-utils-design-collection not found",
      //   breakPoint: "ECCClientGa4ghServiceRegistryServices.handleExpandItem",
      // });
      return;
    }

    const { target, detail } = event;

    if (!target || !(target instanceof HTMLElement)) {
      eccUtilsDesignCollection.error("Target is null or not an HTMLElement");
      return;
    }

    const { key } = detail;
    const children = target!.shadowRoot?.querySelectorAll(
      `slot[name='${key}']`
    );

    const serviceData = this.services.find((service) => service.id === key);
    if (!serviceData) {
      eccUtilsDesignCollection.error(`Service not found: ${key}`);
      return;
    }

    this.cache.set(key, serviceData);

    if (children?.length) {
      try {
        const child = document.createElement("div");
        child.setAttribute("slot", key);

        const button: Action[] = [
          {
            key,
            label: "Delete",
            type: "button",
            buttonOptions: {
              variant: "danger",
              icon: {
                url: "https://cdn.iconscout.com/icon/free/png-256/free-delete-2902143-2411575.png",
              },
            },
          },
        ];

        const detailsComponent = html`<ecc-utils-design-details
          class="details"
          id=${key}
          .data=${serviceData}
          .fields=${this.fields}
          .actions=${button}
        >
        </ecc-utils-design-details>`;

        render(detailsComponent, child);
        target.appendChild(child);

        const detailsElement = child.querySelector<EccUtilsDesignDetails>(
          "ecc-utils-design-details"
        );
        if (detailsElement) {
          detailsElement.addEventListener(
            "ecc-utils-button-click",
            async (buttonEvent: Event) => {
              const customEvent = buttonEvent as CustomEvent<{ key: string }>;
              const { key: buttonKey } = customEvent.detail;
              try {
                if (buttonKey === key) {
                  // TODO: Implement delete service functionality
                  // console.log("Delete service:", key);
                }
              } catch (error) {
                eccUtilsDesignCollection.error(
                  `Failed to delete service: ${key}`
                );
              }
            }
          );
        }
      } catch (error) {
        eccUtilsDesignCollection.error(
          `Failed to render details for service: ${key}`
        );
      }
    }
  }

  render() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const pageItems = this.services.slice(startIndex, endIndex);

    const items = pageItems.map((service, index) => ({
      index: startIndex + index + 1,
      key: service.id,
      name: service.name,
      lazy: true,
      tag: {
        name: service.type.artifact,
        type: "primary" as const,
      },
      data: service,
    }));

    return html`
      <ecc-utils-design-collection
        .items=${items}
        .filters=${this.filters}
        .columns=${this.columns}
        .loading=${this.loading}
        .error=${this.error}
        .pageSize=${this.pageSize}
        @ecc-utils-expand=${this._handleExpandItem}
        @ecc-utils-page-change=${(e: CustomEvent) => {
          this.currentPage = e.detail.page;
        }}
      >
      </ecc-utils-design-collection>
    `;
  }
}
