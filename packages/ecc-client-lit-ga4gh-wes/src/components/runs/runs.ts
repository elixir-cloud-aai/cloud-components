import { html, LitElement, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@elixir-cloud/design";
import _ from "lodash-es";
import { fetchWorkflow, fetchWorkflows } from "../../API/Workflow/wesGet.js";

interface Children {
  key: string;
  label: string;
  value: string | number | Array<string> | Record<string, string>;
  type: "text" | "long-text" | "url" | "array" | "object";
  arrayOptions?: {
    vertical?: boolean;
    pill?: boolean;
  };
}

interface Field {
  tabGroup: string;
  children: Array<Children>;
}
interface Child {
  childName: string;
  childPath: string;
  type: "text" | "long-text" | "url" | "array" | "object";
  arrayOptions?: {
    vertical?: boolean;
    pill?: boolean;
  };
}

interface DataField {
  tabGroupName: string;
  // Group path is not needed
  tabGroupPath: string;
  children: Array<Child>;
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

@customElement("ecc-client-lit-ga4gh-wes-runs")
export class WESRuns extends LitElement {
  @property({ type: Number }) private pageSize = 5;
  @property({ type: String }) private baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @state() private filters: FilterProp[] = [
    {
      key: "title",
      type: "search",
      placeholder: "Search",
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
        multiple: true,
      },
    },
  ];

  @state() private dataType: Array<DataField> = [
    {
      tabGroupName: "Request",
      tabGroupPath: "request",
      children: [
        {
          childName: "Tag",
          childPath: "request.tags",
          type: "text",
        },
        {
          childName: "Workflow Engine Parameters",
          type: "text",
          childPath: "request.workflow_engine_parameters",
        },
        {
          childName: "Workflow Params",
          type: "text",
          childPath: "request.workflow_params",
        },
        {
          childName: "Workflow Type",
          type: "text",
          childPath: "request.workflow_type",
        },
        {
          childName: "Workflow Type Version",
          type: "text",
          childPath: "request.workflow_type_version",
        },
        {
          childName: "Workflow URL",
          type: "url",
          childPath: "request.workflow_url",
        },
      ],
    },
    {
      tabGroupName: "Run Log",
      tabGroupPath: "run_log",
      children: [
        {
          childName: "Command",
          type: "text",
          childPath: "run_log.command",
        },
        {
          childName: "Expires",
          type: "text",
          childPath: "run_log.expires",
        },
        {
          childName: "Max Retries",
          type: "text",
          childPath: "run_log.max_retries",
        },
        {
          childName: "Task Received",
          type: "text",
          childPath: "run_log.task_received",
        },
        {
          childName: "Task Started",
          type: "text",
          childPath: "run_log.task_started",
        },
        {
          childName: "Time Queue",
          type: "text",
          childPath: "run_log.time_queue",
        },
        {
          childName: "UTC Offset",
          type: "text",
          childPath: "run_log.utc_offset",
        },
        {
          childName: "Std Out",
          type: "long-text",
          childPath: "run_log.stdout",
        },
        {
          childName: "Std Err",
          type: "long-text",
          childPath: "run_log.stderr",
        },
      ],
    },
  ];

  @state() private items: ItemProp[] = [];
  @state() private nextPageToken: string | null = "";

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

  protected firstUpdated(): void {
    this.fetchData();
  }

  protected updated(): void {
    const eccUtilsDesignCollection = this.shadowRoot?.querySelector(
      "ecc-utils-design-collection"
      // Todo: Get the typeof Collections and use it instead of `any`
    ) as any;
    eccUtilsDesignCollection.pageSize = this.pageSize;
  }

  private async fetchData() {
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
      const covertedData: ItemProp[] = [];
      data.runs.forEach((run: { run_id: string; state: string }) => {
        covertedData.push({
          index: this.items.length + covertedData.length + 1,
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

      this.items = [...this.items, ...covertedData];
    } catch (error) {
      console.error({
        error,
        breakPoint: "WESRuns.fetchData",
      });
    }
  }

  private _transformData(
    dataType: Array<DataField>,
    runData: any
  ): Array<Field> {
    this.requestUpdate();
    const transformedData: Array<Field> = [];

    // TODO: When proWES implements runLogs and taskLogs, remove this and
    // define a better default dataType in the state itself
    const typesHere = dataType;

    console.log(runData);

    for (let i = 0; i < runData.task_logs.length; i += 1) {
      const taskType: DataField = {
        tabGroupName: `Task Log ${i + 1}`,
        tabGroupPath: `task_logs[${i + 1}]`,
        children: [
          {
            childName: "Name",
            type: "text",
            childPath: `task_logs[${i + 1}].name`,
          },
          {
            childName: "Task Id",
            type: "text",
            childPath: `task_logs[${i + 1}].id`,
          },
          {
            childName: "Description",
            type: "text",
            childPath: `task_logs[${i + 1}].description`,
          },
          {
            childName: "Creation Time",
            type: "text",
            childPath: `task_logs[${i + 1}].creation_time`,
          },
          {
            childName: "Resources",
            type: "object",
            childPath: `task_logs[${i + 1}].resources`,
          },
          {
            childName: "State",
            type: "text",
            childPath: `task_logs[${i + 1}].state`,
          },
          {
            childName: "Tags",
            type: "object",
            childPath: `task_logs[${i + 1}].tags`,
          },
        ],
      };

      typesHere.push(taskType);
    }
    console.log(typesHere);
    typesHere.forEach((tabGroup) => {
      const { tabGroupName } = tabGroup;
      const { tabGroupPath } = tabGroup;
      const field: Field = {
        tabGroup: tabGroupName,
        children: [],
      };

      const group = _.get(runData, tabGroupPath);

      if (
        group !== undefined ||
        (Array.isArray(group) && group.length > 0) ||
        (typeof group === "object" && Object.entries(group).length > 0)
      ) {
        tabGroup.children.forEach((child) => {
          const childName =
            child.childName || child.childPath.split(".").pop() || "undefined";
          const { childPath } = child;
          const { type } = child;

          const value = _.get(runData, childPath);
          if (value !== undefined) {
            const children: Children = {
              key: childPath,
              label: childName,
              value,
              type,
              // arrayOptions: child.arrayOptions,
            };
            field.children.push(children);
          }
        });

        transformedData.push(field);
      }
    });

    return transformedData;
  }

  private async handleExpandItem(e: CustomEvent) {
    const eccUtilsDesignCollection = this.shadowRoot?.querySelector(
      "ecc-utils-design-collection"
    ) as any;
    const { target, detail } = e;
    if (!target || !(target instanceof HTMLElement)) {
      eccUtilsDesignCollection.error("Target is null or not an HTMLElement");
      return;
    }

    const { key } = detail;
    const children = target.querySelectorAll(`[slot="${key}"]`);
    const runData = await fetchWorkflow(this.baseURL, detail.key);
    if (children.length === 0) {
      try {
        const nice = this._transformData(this.dataType, runData);
        const child = document.createElement("div");
        child.setAttribute("slot", key);

        // Use LitElement's html template to create the details component
        const detailsComponent = html`<ecc-utils-design-details
          .fields=${nice}
        ></ecc-utils-design-details>`;

        // Render the details component using Lit's render function
        // Append the child to the target
        render(detailsComponent, child);
        target.appendChild(child);
      } catch (error) {
        eccUtilsDesignCollection.error(`Failed to fetch data for run: ${key}`);
      }
    }
  }

  render() {
    return html`
      <ecc-utils-design-collection
        .filters=${this.filters}
        .items=${this.items}
        @page-change=${this.fetchData}
        @expand-item=${(e: any) => this.handleExpandItem(e)}
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
