/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "./index.js";
import type { ECCClientGa4ghTesRuns } from "./runs.js";
import type {
  TesProvider,
  Task,
  ServiceInfo,
} from "../../providers/tes-provider.js";

const tasks: Task[] = [
  { id: "task-1", name: "first", state: "RUNNING" },
  { id: "task-2", name: "second", state: "COMPLETE" },
];

const mockProvider = (overrides: Partial<TesProvider> = {}): TesProvider => ({
  getServiceInfo: async () => ({} as ServiceInfo),
  listTasks: async () => ({ tasks }),
  getTask: async (id) => ({ id, state: "RUNNING" }),
  createTask: async () => ({ id: "new" }),
  cancelTask: async () => undefined,
  ...overrides,
});

describe("ecc-client-ga4gh-tes-runs", () => {
  it("shows an error without baseUrl or provider", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs></ecc-client-ga4gh-tes-runs>`
    );

    expect(el.shadowRoot!.textContent).to.contain(
      "Please provide either a base URL for the TES API or a custom provider."
    );
  });

  it("renders tasks from a custom provider", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider()}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    expect(el.shadowRoot!.textContent).to.contain("second");
  });

  it("emits ecc-runs-selected with the task id", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider()}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));

    let selected: string | undefined;
    el.addEventListener("ecc-runs-selected", (e) => {
      selected = (e as CustomEvent).detail.runId;
    });
    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-button[variant=outline]"
    )!.click();
    expect(selected).to.equal("task-1");
  });

  it("cancels a task through the provider", async () => {
    const cancelled: string[] = [];
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider({
          cancelTask: async (id) => {
            cancelled.push(id);
          },
        })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-button[variant=destructive]"
    )!.click();
    expect(cancelled).to.deep.equal(["task-1"]);
  });

  it("fetches and renders tasks from baseUrl", async () => {
    const originalFetch = window.fetch;
    const urls: string[] = [];
    window.fetch = (async (input: RequestInfo | URL) => {
      urls.push(String(input));
      return new Response(JSON.stringify({ tasks }), { status: 200 });
    }) as typeof fetch;

    try {
      const el = await fixture<ECCClientGa4ghTesRuns>(
        html`<ecc-client-ga4gh-tes-runs
          baseUrl="http://tes.test/ga4gh/tes/v1/"
        ></ecc-client-ga4gh-tes-runs>`
      );
      await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));

      expect(urls[0]).to.equal(
        "http://tes.test/ga4gh/tes/v1/tasks?page_size=10&view=BASIC"
      );
      expect(el.shadowRoot!.textContent).to.contain("second");
    } finally {
      window.fetch = originalFetch;
    }
  });

  it("emits ecc-runs-changed with the loaded tasks", async () => {
    let loaded: Task[] | undefined;
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider()}
        @ecc-runs-changed=${(e: CustomEvent) => {
          loaded = e.detail.runs;
        }}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    expect(loaded).to.deep.equal(tasks);
  });

  it("passes pageSize to the provider", async () => {
    let requested: number | undefined;
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        pageSize="5"
        .provider=${mockProvider({
          listTasks: async (params) => {
            requested = params?.pageSize;
            return { tasks };
          },
        })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    expect(requested).to.equal(5);
  });

  it("shows an empty state when there are no tasks", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider({ listTasks: async () => ({ tasks: [] }) })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() =>
      el.shadowRoot!.textContent!.includes("No tasks found")
    );
  });

  it("shows the error when loading fails", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider({
          listTasks: async () => {
            throw new Error("failed to load tasks");
          },
        })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() =>
      el.shadowRoot!.textContent!.includes("failed to load tasks")
    );
  });

  it("only renders cancel for tasks that can be cancelled", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider()}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    expect(
      el.shadowRoot!.querySelectorAll(
        "ecc-utils-design-button[variant=destructive]"
      ).length
    ).to.equal(1);
  });

  it("reloads the list after cancelling a task", async () => {
    let remaining = [...tasks];
    const cancelled: string[] = [];
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider({
          listTasks: async () => ({ tasks: remaining }),
          cancelTask: async (id) => {
            cancelled.push(id);
            remaining = remaining.filter((t) => t.id !== id);
          },
        })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));

    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-button[variant=destructive]"
    )!.click();

    await waitUntil(() => !el.shadowRoot!.textContent!.includes("first"));
    const rows = el.shadowRoot!.querySelectorAll(
      "ecc-utils-design-table-body ecc-utils-design-table-row"
    );
    expect(rows.length).to.equal(1);
    expect(cancelled).to.deep.equal(["task-1"]);
    expect(el.shadowRoot!.textContent).to.contain("second");
  });

  it("shows an error when cancelling fails", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider({
          cancelTask: async () => {
            throw new Error("denied");
          },
        })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-button[variant=destructive]"
    )!.click();
    await waitUntil(() =>
      el.shadowRoot!.textContent!.includes("Failed to cancel task task-1")
    );
    expect(el.shadowRoot!.textContent).to.contain("denied");
  });

  it("requests the next page with the returned token", async () => {
    const requests: Array<string | undefined> = [];
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${mockProvider({
          listTasks: async (params) => {
            requests.push(params?.pageToken);
            return params?.pageToken
              ? { tasks: [{ id: "task-3", name: "third", state: "QUEUED" }] }
              : { tasks, next_page_token: "token-2" };
          },
        })}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));

    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-pagination-next"
    )!.dispatchEvent(new CustomEvent("ecc-button-clicked"));
    await waitUntil(() => el.shadowRoot!.textContent!.includes("third"));
    expect(requests).to.deep.equal([undefined, "token-2"]);
  });

  it("hides the toolbar when search and filter are off", async () => {
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .search=${false}
        .filter=${false}
        .provider=${mockProvider()}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    expect(el.shadowRoot!.querySelector("ecc-utils-design-input")).to.equal(
      null
    );
    expect(el.shadowRoot!.querySelector("ecc-utils-design-select")).to.equal(
      null
    );
  });

  it("resets to the first page when the provider changes", async () => {
    const oldProvider = mockProvider({
      listTasks: async (params) =>
        params?.pageToken
          ? { tasks: [{ id: "task-3", name: "third", state: "QUEUED" }] }
          : { tasks, next_page_token: "token-2" },
    });
    const el = await fixture<ECCClientGa4ghTesRuns>(
      html`<ecc-client-ga4gh-tes-runs
        .provider=${oldProvider}
      ></ecc-client-ga4gh-tes-runs>`
    );
    await waitUntil(() => el.shadowRoot!.textContent!.includes("first"));
    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-pagination-next"
    )!.dispatchEvent(new CustomEvent("ecc-button-clicked"));
    await waitUntil(() => el.shadowRoot!.textContent!.includes("third"));

    const requests: Array<string | undefined> = [];
    el.provider = mockProvider({
      listTasks: async (params) => {
        requests.push(params?.pageToken);
        return {
          tasks: [{ id: "task-9", name: "replaced", state: "COMPLETE" }],
        };
      },
    });
    await waitUntil(() => el.shadowRoot!.textContent!.includes("replaced"));

    expect(requests).to.deep.equal([undefined]);
    expect(el.shadowRoot!.textContent).to.not.contain("third");
  });
});
