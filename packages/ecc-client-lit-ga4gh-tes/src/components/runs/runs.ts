/* eslint-disable lit/no-classfield-shadowing */
import { html, css, LitElement, render } from "lit";
import { property, state } from "lit/decorators.js";
import "@elixir-cloud/design";
import EccUtilsDesignCollection, {
  FilterProp,
  ItemProp,
} from "@elixir-cloud/design/dist/components/collection/index.js";
import EccUtilsDesignDetails, {
  Field,
  Action,
} from "@elixir-cloud/design/dist/components/details/index.js";
import { deleteTask, fetchTask, fetchTasks } from "../../API/Task/tesGet.js";

export default class ECCClientGa4ghTesRuns extends LitElement {
  static styles = css``;
  @property({ type: Number }) private pageSize = 5;
  @property({ type: String }) private baseURL =
    "https://protes.rahtiapp.fi/ga4gh/tes/v1";

  @property({ type: Boolean }) private filter = true;
  @property({ type: Boolean }) private search = true;
  @property({ type: Array }) private fields: Array<Field> = [
    {
      key: "name",
      path: "name",
      tab: "Overview",
      label: "Name",
      copy: true,
    },
    {
      key: "description",
      path: "description",
      tab: "Overview",
      label: "Description",
    },
    {
      key: "resources",
      path: "resources",
      tab: "Overview",
      label: "Resources",
    },
    {
      key: "tags",
      path: "tags",
      tab: "Overview",
      label: "Tags",
    },
    {
      key: "executors",
      path: "executors",
      tab: "Overview",
      label: "Executor",
    },
    {
      key: "executors*",
      path: "executors[*]",
      arrayOptions: {
        labelOptions: {
          path: "image",
        },
      },
    },
    {
      key: "executors*command",
      path: "executors[*].command",
      arrayOptions: {
        type: "tag",
      },
    },
    {
      key: "volumes",
      path: "volumes",
      tab: "Overview",
      label: "Volumes",
    },
    {
      key: "creation_time",
      path: "creation_time",
      tab: "Overview",
      label: "Creation time",
    },
    {
      key: "logs",
      path: "logs",
      tab: "Logs",
      label: "Logs",
      copy: true,
    },
    {
      key: "logs[*].logs[*].stderr",
      path: "logs[*].logs[*].stderr",
      label: "STDERR",
      copy: true,
    },
    {
      key: "logs[*].logs[*].stdout",
      path: "logs[*].logs[*].stdout",
      label: "STDOUT",
      copy: true,
    },
    {
      key: "logs[*]",
      path: "logs[*]",
      arrayOptions: {
        labelOptions: {
          path: "start_time",
          prefix: "Start time: ",
        },
      },
      copy: true,
    },
    {
      key: "logs[*].logs[*]",
      path: "logs[*].logs[*]",
      arrayOptions: {
        labelOptions: {
          path: "start_time",
          prefix: "Start time: ",
        },
      },
      copy: true,
    },
    {
      key: "outputs",
      path: "outputs",
      tab: "Output",
      label: "Output",
      copy: true,
    },
    {
      key: "inputs",
      path: "inputs",
      tab: "Inputs",
      label: "Input",
      copy: true,
    },
    {
      key: "inputs",
      path: "inputs[*]",
      arrayOptions: {
        labelOptions: {
          path: "path",
        },
      },
      copy: true,
    },
  ];

  @state() private filters: FilterProp[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search by prefix",
    },
    {
      key: "tag",
      type: "select",
      options: [
        "UNKNOWN",
        "QUEUED",
        "INITIALIZING",
        "RUNNING",
        "PAUSED",
        "COMPLETE",
        "EXECUTOR_ERROR",
        "SYSTEM_ERROR",
        "CANCELED",
        "PREEMPTED",
        "CANCELING",
      ],
      placeholder: "Filter by status",
      selectConfig: {
        multiple: false,
      },
    },
  ];

  @state() private items: ItemProp[] = [];
  @state() private nextPageToken: string[] = [""];
  @state() private view: "MINIMAL" | "BASIC" | "FULL" = "MINIMAL";
  @state() private namePrefix = "";
  @state() private cache = new Map();

  private tagType: Record<string, string> = {
    UNKNOWN: "neutral",
    QUEUED: "warning",
    INITIALIZING: "primary",
    RUNNING: "primary",
    PAUSED: "warning",
    COMPLETE: "success",
    EXECUTOR_ERROR: "danger",
    SYSTEM_ERROR: "danger",
    CANCELED: "danger",
    PREEMPTED: "danger",
    CANCELING: "danger",
  };

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    const eccUtilsDesignCollection =
      this.shadowRoot?.querySelector<EccUtilsDesignCollection>(
        "ecc-utils-design-collection"
      );

    if (!eccUtilsDesignCollection) {
      console.error({
        error: "ecc-utils-design-collection not found",
        breakPoint: "ECCClientGa4ghTesRuns.fetchData",
      });
      return;
    }

    eccUtilsDesignCollection.pageSize = this.pageSize;
    if (changedProperties.has("pageSize")) {
      this._fetchData(1);
    }

    // Handle filter render
    if (changedProperties.has("filter") || changedProperties.has("search")) {
      this.filters = this.getUpdatedFilters();
    }
  }

  private getUpdatedFilters(): FilterProp[] {
    let updatedFilters = [...this.filters];

    // Modify the array based on the conditions
    if (!this.filter) {
      updatedFilters = updatedFilters.filter(
        (filter) => filter.type !== "select"
      );
    }
    if (!this.search) {
      updatedFilters = updatedFilters.filter(
        (filter) => filter.type !== "search"
      );
    }

    return updatedFilters;
  }

  private async _fetchData(page = 1) {
    try {
      const data = await fetchTasks(
        this.baseURL,
        this.pageSize,
        this.nextPageToken[page - 1],
        this.view,
        this.namePrefix
      );

      const convertedData: ItemProp[] = data.tasks?.map(
        (task: { id: string; state: string }, index: number) => ({
          index: (page - 1) * this.pageSize + (index + 1),
          name: task.id,
          key: `${task.id}`,
          lazy: true,
          tag: {
            name: task.state,
            type: this.tagType[task.state] as
              | "primary"
              | "success"
              | "neutral"
              | "warning"
              | "danger",
          },
        })
      );

      // remove old items with the same index as the new items to be added
      this.items = this.items.filter(
        (item) => !convertedData.some((newItem) => newItem.index === item.index)
      );

      this.items = [...this.items, ...convertedData];

      if (data.next_page_token === "" || data.tasks.length < this.pageSize) {
        const eccUtilsDesignCollection =
          this.shadowRoot?.querySelector<EccUtilsDesignCollection>(
            "ecc-utils-design-collection"
          );

        if (!eccUtilsDesignCollection) {
          console.error({
            error: "ecc-utils-design-collection not found",
            breakPoint: "ECCClientGa4ghTesRuns.fetchData",
          });
          return;
        }

        eccUtilsDesignCollection.totalItems = this.items.length;
      } else this.nextPageToken[page] = data.next_page_token;
    } catch (error) {
      console.error({
        error,
        breakPoint: "ECCClientGa4ghTesRuns.fetchData",
      });
    }
  }

  private async _handleExpandItem(event: CustomEvent) {
    const eccUtilsDesignCollection =
      this.shadowRoot?.querySelector<EccUtilsDesignCollection>(
        "ecc-utils-design-collection"
      );

    if (!eccUtilsDesignCollection) {
      console.error({
        error: "ecc-utils-design-collection not found",
        breakPoint: "ECCClientGa4ghTesRuns.handleExpandItem",
      });
      return;
    }

    const { target, detail } = event;

    if (!target || !(target instanceof HTMLElement)) {
      eccUtilsDesignCollection.error("Target is null or not an HTMLElement");
      return;
    }

    const { key } = detail;
    const children = target.querySelectorAll(`[slot="${key}"]`);
    const runData = await fetchTask(this.baseURL, detail.key);

    if (this.cache.has(key)) return;
    // Cache the run data if not present
    this.cache.set(key, runData);

    if (children) {
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
          .data=${runData}
          .fields=${this.fields}
          .actions=${button}
        >
        </ecc-utils-design-details>`;

        // Render the details component using Lit's render function
        // Append the child to the target
        render(detailsComponent, child);
        target.appendChild(child);

        // Add button event
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
                  // 0 is the index of the button as there is only one button
                  const resp = (await deleteTask(this.baseURL, key)) as any;

                  // If the response doesn't have run ID that means the run wasn't canceled.
                  if (!resp.id) throw new Error();
                }
              } catch (error) {
                eccUtilsDesignCollection.error(`Failed to cancel run: ${key}`);
              }
            }
          );
        } else {
          eccUtilsDesignCollection.error(
            `Failed to find ecc-utils-design-details element for run: ${key}`
          );
        }
      } catch (error) {
        eccUtilsDesignCollection.error(`Failed to fetch data for run: ${key}`);
      }
    }
  }

  /* TODO: Add @ecc-utils-filter when backend implements filtering */
  render() {
    return html`
      <ecc-utils-design-collection
        id="collection"
        .items=${this.items}
        @ecc-utils-page-change=${(event: CustomEvent) => {
          this._fetchData(event.detail.page);
        }}
        @ecc-utils-expand=${(event: CustomEvent) =>
          this._handleExpandItem(event)}
      >
      </ecc-utils-design-collection>
    `;
  }
}
