import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "@elixir-cloud/design";
import { fetchWorkflow, fetchWorkflows } from "../../API/Workflow/wesGet.js";

@customElement("ecc-client-lit-ga4gh-wes-runs")
export class WESRuns extends LitElement {
  @property({ type: Number }) private pageSize = 5;
  @property({ type: String }) private baseURL =
    "https://prowes.rahtiapp.fi/ga4gh/wes/v1";

  @state() private filters: any[] = [
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

  @state() private items: any[] = [];
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
      const covertedData: any[] = [];
      data.runs.forEach((run: { run_id: string; state: string }) => {
        covertedData.push({
          index: this.items.length + covertedData.length + 1,
          name: run.run_id,
          key: run.run_id,
          lazy: true,
          tag: {
            name: run.state,
            type: this.tagType[run.state],
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

  async expand(e: any) {
    // Check if child already exists within the shadow root
    const children = this.shadowRoot?.querySelectorAll(
      `[slot="${e.detail.key}"]`
    );
    const runData = await fetchWorkflow(this.baseURL, e.detail.key);
    console.log(runData);
    if (!children || children.length === 0) {
      // Add child to ecc-utils-design-collection

      const child = document.createElement("div");
      child.setAttribute("slot", e.detail.key);
      child.innerHTML = `<p>Title: heh</p>`;
      this.shadowRoot?.appendChild(child); // Use this.shadowRoot to append the child to the shadow root
    }
  }

  render() {
    return html`
      <ecc-utils-design-collection
        .filters=${this.filters}
        .items=${this.items}
        @page-change=${this.fetchData}
        @expand-item=${(e: any) => this.expand(e)}
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
