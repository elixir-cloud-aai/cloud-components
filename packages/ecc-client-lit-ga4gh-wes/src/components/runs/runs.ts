import { html, LitElement, render } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@elixir-cloud/design";
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
      console.log(data);
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

  private _createFields(data: any): Array<Field> {
    this.requestUpdate();
    const groups = ["request", "runs logs", "task logs"];

    const fields: Array<Field> = [];

    for (const group of groups) {
      const groupFields = [];

      const groupData = data[group.replace(/\s/g, "_")];

      if (groupData && typeof groupData === "object") {
        for (const [key, value] of Object.entries(groupData)) {
          const child = {
            key,
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "), // Convert underscores to spaces and capitalize
            value,
            type: typeof value === "object" ? "object" : "text", // Assume object type for nested objects
          };

          groupFields.push(child);
        }

        const field = {
          tabGroup: group,
          children: groupFields,
        };

        fields.push(field as Field);
      }
    }

    return fields;
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
        const data = this._createFields(runData);
        console.log(data);
        // Create a child div and set its slot attribute
        const child = document.createElement("div");
        child.setAttribute("slot", key);

        // Use LitElement's html template to create the details component
        const detailsComponent = html`<ecc-utils-design-details
          .fields=${data}
        ></ecc-utils-design-details>`;

        // Render the details component using Lit's render function
        render(detailsComponent, child);

        // Append the child to the target
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
