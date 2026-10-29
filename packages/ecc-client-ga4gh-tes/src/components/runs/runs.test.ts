/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "./index.js";
import type { ECCClientGa4ghTesRuns } from "./runs.js";
import type { TesProvider, Task, ServiceInfo } from "../../providers/tes-provider.js";

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
    expect(el.shadowRoot!.textContent).to.contain("base URL");
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
});
