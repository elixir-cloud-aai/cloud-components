import { html, css, LitElement, render } from "lit";
import { property, state } from "lit/decorators.js";
import "@elixir-cloud/design/dist/components/collection/index.js";
import "@elixir-cloud/design/dist/components/details/index.js";
import EccUtilsDesignCollection, {
  FilterProp,
  ItemProp,
} from "@elixir-cloud/design/dist/components/collection";
import EccUtilsDesignDetails, {
  Field,
  Action,
} from "@elixir-cloud/design/dist/components/details";
import {
  cancelWorkflow,
  fetchWorkflow,
  fetchWorkflows,
} from "../../API/Workflow/wesGet.js";

/**
 * @summary This component facilitates browsing workflow runs via WES API.
 * @since 1.0.0
 *
 * @property {string} baseURL - Base URL of the WES instance/gateway
 * @property {number} pageSize - Number of runs per page
 * @property {array} fields - Configuration for what fields to display
 * @property {boolean} filter - Determines if the runs filter field should be rendered
 * @property {boolean} extendFields - Extend default fields instead of overriding
 *
 */

export default class ECCClientGa4ghWesRuns extends LitElement {
  static styles = css``;
  static defaultFields: Field[] = [
    {
      label: "Tags",
      tab: "Overview",
      key: "request.tags",
      path: "request.tags",
    },
    {
      label: "Engine parameters",
      tab: "Parameter",
      key: "request.workflow_engine_parameters",
      path: "request.workflow_engine_parameters",
      copy: true,
    },
    {
      label: "Parameters",
      tab: "Parameter",
      key: "request.workflow_params",
      path: "request.workflow_params",
      copy: true,
    },
    {
      label: "Type",
      tab: "Parameter",
      key: "request.workflow_type",
      path: "request.workflow_type",
    },
    {
      label: "Version",
      tab: "Parameter",
      key: "request.workflow_type_version",
      path: "request.workflow_type_version",
    },
    {
      label: "Url",
      tab: "Overview",
      key: "request.workflow_url",
      path: "request.workflow_url",
      copy: true,
    },
    {
      label: "Run Logs",
      key: "run_log",
      path: "run_log",
      tab: "Run logs",
      copy: true,
    },
    {
      key: "run_log.max_retries",
      path: "run_log.max_retries",
      label: "Max retries",
    },
    {
      key: "run_log.max_retries",
      path: "run_log.max_retries",
      label: "Max retries",
    },
    {
      key: "run_log.stderr",
      path: "run_log.stderr",
      label: "STDERR",
    },
    {
      key: "run_log.stdout",
      path: "run_log.stdout",
      label: "STDOUT",
    },
    {
      key: "run_log.task_finished",
      path: "run_log.task_finished",
      label: "Finished at",
    },
    {
      key: "run_log.task_received",
      path: "run_log.task_received",
      label: "Received at",
    },
    {
      key: "run_log.task_received",
      path: "run_log.task_received",
      label: "Received at",
    },
    {
      key: "run_log.time_execution",
      path: "run_log.time_execution",
      label: "Execution time",
    },
    {
      key: "run_log.time_queue",
      path: "run_log.time_queue",
      label: "Queue time",
    },
    {
      key: "run_log.time_total",
      path: "run_log.time_total",
      label: "Total time",
    },
    {
      key: "run_log.utc_offset",
      path: "run_log.utc_offset",
      label: "UTC offset",
    },
    {
      label: "Task Logs",
      key: "task_logs",
      path: "task_logs",
      tab: "Task logs",
      copy: true,
    },
    {
      key: "task_logs[*]",
      path: "task_logs[*]",
      arrayOptions: {
        labelOptions: {
          prefix: "Creation time: ",
          path: "creation_time",
        },
      },
      copy: true,
    },
    {
      key: "output",
      tab: "Output",
      label: "Output",
      path: "outputs",
      copy: true,
    },
  ];

  @property({ type: Number, reflect: true }) pageSize = 5;
  @property({ type: String, reflect: true }) baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @property({ type: Array, reflect: true }) fields: Field[] = [];
  @property({ type: Boolean, reflect: true }) extendFields = false;

  @state() private filters: FilterProp[] = [
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
        multiple: true,
      },
    },
  ];

  @state() private filter = true;
  @state() private items: ItemProp[] = [];
  @state() private nextPageToken: string[] = [""];
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
        error: "Failed to find ecc-utils-design-collection element",
        breakPoint: "ECCClientGa4ghWesRuns.updated",
      });
      return;
    }

    eccUtilsDesignCollection.pageSize = this.pageSize;
    if (changedProperties.has("pageSize")) {
      this._fetchData(1);
    }
    if (changedProperties.has("filter") && this.filter === false) {
      this.filters = [];
    }

    if (changedProperties.has("extendFields")) {
      if (this.extendFields) {
        const fields = ECCClientGa4ghWesRuns.defaultFields;
        this.fields = [...this.fields, ...fields];
      } else if (this.fields.length === 0 && this.extendFields === false) {
        this.fields = ECCClientGa4ghWesRuns.defaultFields;
      }
    }
  }

  private async _fetchData(page = 1) {
    try {
      const data = await fetchWorkflows(
        this.baseURL,
        this.pageSize,
        this.nextPageToken[page - 1]
      );

      const convertedData: ItemProp[] = data.runs.map(
        (run: { run_id: string; state: string }, index: number) => ({
          index: (page - 1) * this.pageSize + (index + 1),
          name: run.run_id,
          key: `${run.run_id}`,
          lazy: true,
          tag: {
            name: run.state,
            type: this.tagType[run.state] as
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

      if (data.next_page_token === "" || data.runs.length < this.pageSize) {
        const eccUtilsDesignCollection =
          this.shadowRoot?.querySelector<EccUtilsDesignCollection>(
            "ecc-utils-design-collection"
          );

        if (!eccUtilsDesignCollection) {
          console.error({
            error: "ecc-utils-design-collection not found",
            breakPoint: "ECCClientGa4ghWesRuns.fetchData",
          });
          return;
        }

        eccUtilsDesignCollection.totalItems = this.items.length;
      } else this.nextPageToken[page] = data.next_page_token;
    } catch (error) {
      console.error({
        error,
        breakPoint: "ECCClientGa4ghWesRuns.fetchData",
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
        breakPoint: "ECCClientGa4ghWesRuns.handleExpandItem",
      });
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
    const runData = await fetchWorkflow(this.baseURL, detail.key);
    this.cache.set(key, runData);

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
                url: "/assets/delete.svg",
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
                  const resp = (await cancelWorkflow(this.baseURL, key)) as any;

                  // If the response doesn't have run ID that means the run wasn't canceled.
                  if (!resp.run_id) throw new Error();
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

  render() {
    return html`
      <ecc-utils-design-collection
        id="collection"
        .filters=${this.filters}
        .items=${this.items}
        @ecc-utils-page-change=${(event: CustomEvent) => {
          this._fetchData(event.detail.page);
        }}
        @ecc-utils-expand=${(event: CustomEvent) => {
          if (!this.cache.has(event.detail.key)) {
            this._handleExpandItem(event);
          }
        }}
      >
      </ecc-utils-design-collection>
    `;
  }
}
