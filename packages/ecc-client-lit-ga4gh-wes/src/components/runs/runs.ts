import { html, css, LitElement, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@elixir-cloud/design";
import {
  cancelWorkflow,
  fetchWorkflow,
  fetchWorkflows,
} from "../../API/Workflow/wesGet.js";

// TODO: Remove the interfaces once design package
//       can export them, as they are copied from
//       from there.

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
interface ItemProp {
  index: number;
  name: string;
  key: string;
  lazy?: boolean;
  tag?: {
    name: string;
    type?: "primary" | "success" | "neutral" | "warning" | "danger";
  };
}

interface FilterProp {
  key: string;
  type: "search" | "select";
  options?: string[];
  selectConfig?: {
    multiple?: boolean;
  };
  placeholder?: string;
}

interface FooterButton {
  key: string;
  name: string;
  variant?: "primary" | "success" | "neutral" | "warning" | "danger";
}

@customElement("ecc-client-lit-ga4gh-wes-runs")
export class WESRuns extends LitElement {
  static styles = css``;
  @property({ type: Number }) private pageSize = 5;
  @property({ type: String }) private baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @property({ type: Array }) private fields: Array<Field> = [
    {
      tabGroup: "Overview",
      children: [
        {
          label: "Tags",
          path: "request.tags",
        },
        {
          label: "Engine parameters",
          path: "request.workflow_engine_parameters",
          copy: true,
        },
        {
          label: "Parameters",
          path: "request.workflow_params",
          copy: true,
        },
        {
          label: "Type",
          path: "request.workflow_type",
        },
        {
          label: "Version",
          path: "request.workflow_type_version",
        },
        {
          label: "Url",
          path: "request.workflow_url",
          copy: true,
        },
      ],
    },
    {
      tabGroup: "Logs",
      children: [
        {
          label: "Run Logs",
          path: "run_log",
          copy: true,
        },
        {
          label: "Task Logs",
          path: "task_logs",
          copy: true,
        },
      ],
    },
    {
      tabGroup: "Output",
      children: [
        {
          label: "Output",
          path: "output",
        },
      ],
    },
  ];

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

  @state() private filterTag: string[] = [];
  @state() private filter = true;
  @state() private items: ItemProp[] = [];
  @state() private nextPageToken: string | null = "";
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
    const eccUtilsDesignCollection = this.shadowRoot?.querySelector(
      "ecc-utils-design-collection"
      // Todo: Get the typeof Collections and use it instead of `any`
    ) as any;
    eccUtilsDesignCollection.pageSize = this.pageSize;
    if (changedProperties.has("pageSize")) {
      this._fetchData();
    }
    if (changedProperties.has("filter") && this.filter === false) {
      this.filters = [];
    }
  }

  private async _fetchData() {
    try {
      // If all the items have been cached, don't invoke API call
      if (this.nextPageToken === null) return;
      const data = await fetchWorkflows(
        this.baseURL,
        this.pageSize,
        this.nextPageToken
      );

      // Set nextPageToken to null if at the last page
      if (data.next_page_token === "") {
        this.nextPageToken = null;

        const eccUtilsDesignCollection = this.shadowRoot?.querySelector(
          "ecc-utils-design-collection"
          // Todo: Get the typeof Collections and use it instead of `any`
        ) as any;

        eccUtilsDesignCollection.totalItems = this.items.length;
      } else this.nextPageToken = data.next_page_token;
      const convertedData: ItemProp[] = [];
      data.runs.forEach((run: { run_id: string; state: string }) => {
        convertedData.push({
          index: this.items.length + convertedData.length + 1,
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
        });
      });
      const filteredData = convertedData.filter((run) => this._filterData(run));
      const modifiedData = filteredData.map((item, index) => ({
        ...item,
        index: this.items.length + index + 1,
      }));

      this.items = [...this.items, ...modifiedData];
      // If enough tasks are not fetched, fetch more based on filter
      if (
        this.items.length % this.pageSize !== 0 ||
        (modifiedData.length === 0 && this.filterTag.length !== 0)
      )
        this._fetchData();
    } catch (error) {
      console.error({
        error,
        breakPoint: "WESRuns.fetchData",
      });
    }
  }

  private async _handleExpandItem(event: CustomEvent) {
    const eccUtilsDesignCollection = this.shadowRoot?.querySelector(
      "ecc-utils-design-collection"
    ) as any;

    const { target, detail } = event;

    if (!target || !(target instanceof HTMLElement)) {
      eccUtilsDesignCollection.error("Target is null or not an HTMLElement");
      return;
    }

    const { key } = detail;
    const children = target.querySelectorAll(`[slot="${key}"]`);
    const runData = await fetchWorkflow(this.baseURL, detail.key);

    if (this.cache.has(key)) return;
    // Cache the run data if not present
    this.cache.set(key, runData);

    if (children) {
      try {
        const child = document.createElement("div");
        child.setAttribute("slot", key);

        const button: FooterButton[] = [
          {
            key,
            name: "Delete",
            variant: "danger",
          },
        ];

        const detailsComponent = html`<ecc-utils-design-details
          class="details"
          id=${key}
          .data=${runData}
          .fields=${this.fields}
          .buttons=${button}
        >
          <svg
            slot="icon-${key}"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash3"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
            />
          </svg>
        </ecc-utils-design-details>`;

        // Render the details component using Lit's render function
        // Append the child to the target
        render(detailsComponent, child);
        target.appendChild(child);

        // Add button event
        const detailsElement = child.querySelector(
          "ecc-utils-design-details"
        ) as any;
        if (detailsElement) {
          detailsElement.addEventListener(
            `ecc-utils-button-click`,
            async (buttonEvent: CustomEvent) => {
              const { key: buttonKey } = buttonEvent.detail;
              try {
                if (buttonKey === key) {
                  // 0 is the index of the button as there is only one button
                  detailsElement.setButtonLoading(0, true);
                  const resp = (await cancelWorkflow(this.baseURL, key)) as any;
                  detailsElement.setButtonLoading(0, false);

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

  private _filterData(item: ItemProp) {
    if (
      (item.tag && this.filterTag.includes(item.tag.name)) ||
      this.filterTag.length === 0
    ) {
      return true;
    }
    return false;
  }

  private _handleFilter(event: CustomEvent) {
    this.items = [];
    this.nextPageToken = "";
    const filterValue = event.detail.value;
    if (Array.isArray(filterValue)) {
      this.filterTag = filterValue;
      console.log(this.filterTag);
      this._fetchData();
    }
  }

  render() {
    return html`
      <ecc-utils-design-collection
        id="collection"
        .filters=${this.filters}
        .items=${this.items}
        @ecc-utils-page-change=${this._fetchData}
        @ecc-utils-expand=${(event: CustomEvent) =>
          this._handleExpandItem(event)}
        @ecc-utils-filter=${(event: CustomEvent) => {
          this._handleFilter(event);
        }}
      >
      </ecc-utils-design-collection>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "ecc-client-lit-ga4gh-wes-runs": WESRuns;
  }
}
