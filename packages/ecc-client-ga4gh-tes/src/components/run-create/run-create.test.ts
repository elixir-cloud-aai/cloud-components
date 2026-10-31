/* eslint-disable import/no-extraneous-dependencies, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import "./index.js";
import type { ECCClientGa4ghTesRunCreate } from "./run-create.js";
import type {
  TesProvider,
  TaskRequest,
  ServiceInfo,
} from "../../providers/tes-provider.js";

const mockProvider = (overrides: Partial<TesProvider> = {}): TesProvider => ({
  getServiceInfo: async () => ({} as ServiceInfo),
  listTasks: async () => ({ tasks: [] }),
  getTask: async (id) => ({ id, state: "QUEUED" }),
  createTask: async () => ({ id: "new-task" }),
  cancelTask: async () => undefined,
  ...overrides,
});

const executor = (overrides: Record<string, unknown> = {}) => ({
  image: "ubuntu",
  command: "echo",
  workdir: "",
  stdin: "",
  stdout: "",
  stderr: "",
  env: [],
  ignoreError: false,
  ...overrides,
});

const fill = (
  el: ECCClientGa4ghTesRunCreate,
  patch: Record<string, unknown>
) => {
  // eslint-disable-next-line no-param-reassign
  (el as any).form = { ...(el as any).form, ...patch };
};

const create = (provider?: TesProvider) =>
  fixture<ECCClientGa4ghTesRunCreate>(
    html`<ecc-client-ga4gh-tes-run-create
      .provider=${provider}
    ></ecc-client-ga4gh-tes-run-create>`
  );

const buttonByText = (el: ECCClientGa4ghTesRunCreate, text: string) =>
  Array.from(
    el.shadowRoot!.querySelectorAll<HTMLElement>("ecc-utils-design-button")
  ).find((button) => button.textContent!.trim() === text)!;

// JSON drops the undefined keys that are left out of the request body
const plain = (value: unknown) => JSON.parse(JSON.stringify(value));

const labelOf = (el: ECCClientGa4ghTesRunCreate, text: string) =>
  Array.from(
    el.shadowRoot!.querySelectorAll<HTMLElement>("ecc-utils-design-label")
  ).find((label) => label.textContent!.replace(/\s+/g, " ").trim() === text)!;

// The block that holds a label together with its Add button, rows and inputs
const sectionOf = (el: ECCClientGa4ghTesRunCreate, title: string) =>
  labelOf(el, title).closest<HTMLElement>("div.grid")!;

const inputsIn = (section: HTMLElement) =>
  Array.from(
    section.querySelectorAll<HTMLElement & { value: string }>(
      "ecc-utils-design-input"
    )
  );

// lit updates do not always happen immediately
// so we need to wait for updateComplete
const rerendered = (node: Element) =>
  ((node.getRootNode() as ShadowRoot).host as ECCClientGa4ghTesRunCreate)
    .updateComplete;

const addRow = async (section: HTMLElement) => {
  section
    .querySelector<HTMLElement>("ecc-utils-design-button[variant=outline]")!
    .click();
  await rerendered(section);
};

const removeRow = async (section: HTMLElement, index: number) => {
  section
    .querySelectorAll<HTMLElement>("ecc-utils-design-button[variant=ghost]")
    [index].click();
  await rerendered(section);
};

const typeInto = async (target: Element, value: string) => {
  target.dispatchEvent(
    new CustomEvent("ecc-input-changed", { detail: { value } })
  );
  await rerendered(target);
};

const setChecked = (
  el: ECCClientGa4ghTesRunCreate,
  title: string,
  checked: boolean
) =>
  labelOf(el, title)
    .parentElement!.querySelector("ecc-utils-design-checkbox")!
    .dispatchEvent(
      new CustomEvent("ecc-input-changed", { detail: { checked } })
    );

describe("ecc-client-ga4gh-tes-run-create", () => {
  it("shows an error without baseUrl or provider", async () => {
    const el = await fixture<ECCClientGa4ghTesRunCreate>(
      html`<ecc-client-ga4gh-tes-run-create></ecc-client-ga4gh-tes-run-create>`
    );
    fill(el, { executors: [executor()] });
    await (el as any).handleSubmit();
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.contain(
      "Please provide either a base URL for the TES API or a custom provider."
    );
  });

  it("builds a TaskRequest and emits ecc-run-submitted", async () => {
    let received: TaskRequest | undefined;
    const el = await create(
      mockProvider({
        createTask: async (request) => {
          received = request;
          return { id: "new-task" };
        },
      })
    );

    fill(el, {
      name: "demo",
      executors: [
        executor({
          command: "echo\nhello",
          env: [{ key: "A", value: "1" }],
        }),
      ],
      cpuCores: "2",
    });

    const submitted = new Promise<CustomEvent>((resolve) => {
      el.addEventListener("ecc-run-submitted", (e) =>
        resolve(e as CustomEvent)
      );
    });
    await (el as any).handleSubmit();
    const event = await submitted;

    expect(event.detail.runId).to.equal("new-task");
    expect(event.detail.request).to.deep.equal(received);
    expect(received).to.deep.equal({
      name: "demo",
      executors: [
        { image: "ubuntu", command: ["echo", "hello"], env: { A: "1" } },
      ],
      resources: { cpu_cores: 2 },
    });
  });

  it("does not submit an empty form without the required fields", async () => {
    let calls = 0;
    let submitted = false;
    const el = await create(
      mockProvider({
        createTask: async () => {
          calls += 1;
          return { id: "new-task" };
        },
      })
    );
    el.addEventListener("ecc-run-submitted", () => {
      submitted = true;
    });

    buttonByText(el, "Submit Task").click();
    await waitUntil(() =>
      el.shadowRoot!.textContent!.includes("Executor 1: image is required")
    );

    expect(calls).to.equal(0);
    expect(submitted).to.equal(false);
  });

  it("maps every form field into the TaskRequest", async () => {
    let received: TaskRequest | undefined;
    const el = await create(
      mockProvider({
        createTask: async (request) => {
          received = request;
          return { id: "new-task" };
        },
      })
    );
    fill(el, {
      name: " n ",
      description: "d",
      executors: [
        executor({
          image: " ubuntu ",
          command: "ls\n-l",
          workdir: "/w",
          stdin: "/in",
          stdout: "/out",
          stderr: "/err",
          env: [
            { key: "A", value: "1" },
            { key: "", value: "dropped" },
          ],
          ignoreError: true,
        }),
      ],
      inputs: [{ path: "/in", url: "s3://a", type: "FILE" }, {}],
      outputs: [
        { path: "/o", url: "s3://b", path_prefix: "", type: "DIRECTORY" },
      ],
      volumes: [{ value: "/vol" }, { value: " " }],
      tags: [{ key: "t", value: "v" }],
      cpuCores: "2",
      ramGb: "4.5",
      diskGb: "10",
      zones: "a, b,",
      preemptible: true,
      backendParameters: [{ key: "k", value: "v" }],
      backendParametersStrict: true,
    });
    await (el as any).handleSubmit();

    expect(plain(received)).to.deep.equal({
      name: "n",
      description: "d",
      executors: [
        {
          image: "ubuntu",
          workdir: "/w",
          stdin: "/in",
          stdout: "/out",
          stderr: "/err",
          command: ["ls", "-l"],
          env: { A: "1" },
          ignore_error: true,
        },
      ],
      inputs: [{ path: "/in", url: "s3://a", type: "FILE" }],
      outputs: [{ path: "/o", url: "s3://b", type: "DIRECTORY" }],
      volumes: ["/vol"],
      tags: { t: "v" },
      resources: {
        cpu_cores: 2,
        ram_gb: 4.5,
        disk_gb: 10,
        zones: ["a", "b"],
        preemptible: true,
        backend_parameters: { k: "v" },
        backend_parameters_strict: true,
      },
    });
  });

  it("posts the task to baseUrl", async () => {
    const originalFetch = window.fetch;
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      return new Response(JSON.stringify({ id: "rest-task" }), { status: 200 });
    }) as typeof fetch;

    try {
      const el = await fixture<ECCClientGa4ghTesRunCreate>(
        html`<ecc-client-ga4gh-tes-run-create
          baseUrl="http://tes.test/ga4gh/tes/v1"
        ></ecc-client-ga4gh-tes-run-create>`
      );
      fill(el, { executors: [executor()] });
      await (el as any).handleSubmit();

      expect(calls).to.have.length(1);
      expect(calls[0].url).to.equal("http://tes.test/ga4gh/tes/v1/tasks");
      expect(calls[0].init!.method).to.equal("POST");
      expect(JSON.parse(calls[0].init!.body as string)).to.deep.equal({
        executors: [{ image: "ubuntu", command: ["echo"] }],
      });
      expect((el as any).success).to.contain("rest-task");
    } finally {
      window.fetch = originalFetch;
    }
  });

  describe("validation", () => {
    const rejects = async (patch: Record<string, unknown>, message: string) => {
      let calls = 0;
      const el = await create(
        mockProvider({
          createTask: async () => {
            calls += 1;
            return { id: "x" };
          },
        })
      );
      fill(el, { executors: [executor()], ...patch });
      await (el as any).handleSubmit();
      await el.updateComplete;
      expect(el.shadowRoot!.textContent).to.contain(message);
      expect(calls).to.equal(0);
    };

    it("rejects executors without image", () =>
      rejects({ executors: [executor({ image: " " })] }, "image is required"));

    it("rejects executors without command", () =>
      rejects(
        { executors: [executor({ command: "" })] },
        "Executor 1: command is required"
      ));

    it("names the executor that is invalid", () =>
      rejects(
        { executors: [executor(), executor({ image: "" })] },
        "Executor 2: image is required"
      ));

    it("requires at least one executor", () =>
      rejects({ executors: [] }, "At least one executor is required"));

    it("rejects resource values that are not numbers", () =>
      rejects({ cpuCores: "two" }, "Resource values must be numbers"));

    it("rejects inputs without url", () =>
      rejects({ inputs: [{ path: "/in" }] }, "Input 1: url is required"));

    it("rejects outputs without path", () =>
      rejects({ outputs: [{ url: "s3://b" }] }, "Output 1: path is required"));

    it("rejects an input type other than FILE or DIRECTORY", () =>
      rejects(
        { inputs: [{ path: "/in", url: "s3://a", type: "LINK" }] },
        "Type must be FILE or DIRECTORY"
      ));
  });

  it("shows the success message and clears the form after submitting", async () => {
    const el = await create(mockProvider());
    fill(el, { name: "demo", executors: [executor()] });
    await (el as any).handleSubmit();
    await el.updateComplete;

    expect(el.shadowRoot!.textContent).to.contain(
      "Task submitted successfully! Task ID: new-task"
    );
    expect((el as any).form.name).to.equal("");
    expect((el as any).form.executors).to.have.length(1);
    expect((el as any).form.executors[0]).to.deep.equal(
      executor({ image: "", command: "" })
    );
  });

  it("emits ecc-run-create-failed and keeps the form when creating fails", async () => {
    const el = await create(
      mockProvider({
        createTask: async () => {
          throw new Error("rejected by server");
        },
      })
    );
    fill(el, { name: "demo", executors: [executor()] });

    let failure: string | undefined;
    let submitted = false;
    el.addEventListener("ecc-run-create-failed", (e) => {
      failure = (e as CustomEvent).detail.error;
    });
    el.addEventListener("ecc-run-submitted", () => {
      submitted = true;
    });
    const consoleError = console.error;
    console.error = () => undefined;
    try {
      await (el as any).handleSubmit();
    } finally {
      console.error = consoleError;
    }
    await el.updateComplete;

    expect(failure).to.equal("rejected by server");
    expect(submitted).to.equal(false);
    expect(el.shadowRoot!.textContent).to.contain("rejected by server");
    expect((el as any).form.name).to.equal("demo");
  });

  it("clears the form and emits ecc-run-create-reset on reset", async () => {
    const el = await create(mockProvider());
    fill(el, { name: "demo", executors: [executor({ image: "" })] });
    await (el as any).handleSubmit();
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).to.contain("image is required");

    let reset = false;
    el.addEventListener("ecc-run-create-reset", () => {
      reset = true;
    });
    buttonByText(el, "Reset").click();
    await el.updateComplete;

    expect(reset).to.equal(true);
    expect((el as any).form.name).to.equal("");
    expect(el.shadowRoot!.textContent).to.not.contain("image is required");
  });

  it("adds and removes executors correctly", async () => {
    const el = await create(mockProvider());
    expect(el.shadowRoot!.textContent).to.not.contain("Executor 2");

    buttonByText(el, "Add executor").click();
    await waitUntil(() => el.shadowRoot!.textContent!.includes("Executor 2"));
    expect((el as any).form.executors).to.have.length(2);

    el.shadowRoot!.querySelector<HTMLElement>(
      "ecc-utils-design-button[variant=ghost]"
    )!.click();
    await waitUntil(() => !el.shadowRoot!.textContent!.includes("Executor 2"));
    expect((el as any).form.executors).to.have.length(1);
  });

  [
    { title: "Environment", fields: 2 },
    { title: "Inputs", fields: 3 },
    { title: "Outputs", fields: 4 },
    { title: "Tags", fields: 2 },
    { title: "Volumes", fields: 1 },
    { title: "Backend parameters", fields: 2 },
  ].forEach(({ title, fields }) => {
    it(`adds and removes ${title} rows`, async () => {
      const el = await create(mockProvider());
      expect(inputsIn(sectionOf(el, title))).to.have.length(0);

      await addRow(sectionOf(el, title));
      await addRow(sectionOf(el, title));
      expect(inputsIn(sectionOf(el, title))).to.have.length(2 * fields);

      await typeInto(inputsIn(sectionOf(el, title))[0], "first");
      await typeInto(inputsIn(sectionOf(el, title))[fields], "second");

      await removeRow(sectionOf(el, title), 0);
      const remaining = inputsIn(sectionOf(el, title));
      expect(remaining).to.have.length(fields);
      expect(remaining[0].value).to.equal("second");
    });
  });

  it("submits the rows and options entered in the form", async () => {
    const requests: TaskRequest[] = [];
    const el = await create(
      mockProvider({
        createTask: async (request) => {
          requests.push(request);
          return { id: "ui-task" };
        },
      })
    );
    const root = el.shadowRoot!;
    const fillRow = async (title: string, values: string[], row = 0) => {
      await addRow(sectionOf(el, title));
      const fields = inputsIn(sectionOf(el, title));
      const size = fields.length / (row + 1);
      for (let i = 0; i < values.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await typeInto(fields[row * size + i], values[i]);
      }
    };

    await typeInto(inputsIn(sectionOf(el, "Image *"))[0], "ubuntu");
    await typeInto(
      root.querySelector("ecc-utils-design-textarea")!,
      "echo\nhi"
    );

    await fillRow("Environment", ["A", "1"]);
    await fillRow("Environment", ["B", "2"], 1);
    await removeRow(sectionOf(el, "Environment"), 1);
    await fillRow("Inputs", ["/in", "s3://a", "FILE"]);
    await fillRow("Outputs", ["/out", "s3://b", "", "DIRECTORY"]);
    await fillRow("Tags", ["team", "bio"]);
    await fillRow("Volumes", ["/vol"]);
    await fillRow("Backend parameters", ["k", "v"]);
    await typeInto(inputsIn(sectionOf(el, "CPU cores"))[0], "2");
    setChecked(el, "Preemptible", true);
    setChecked(
      el,
      "Backend parameters strict (fail if any are unsupported)",
      true
    );
    setChecked(el, "Ignore error (continue to next executor on failure)", true);
    await el.updateComplete;

    buttonByText(el, "Submit Task").click();
    await waitUntil(() => requests.length > 0);

    expect(plain(requests[0])).to.deep.equal({
      executors: [
        {
          image: "ubuntu",
          command: ["echo", "hi"],
          env: { A: "1" },
          ignore_error: true,
        },
      ],
      inputs: [{ path: "/in", url: "s3://a", type: "FILE" }],
      outputs: [{ path: "/out", url: "s3://b", type: "DIRECTORY" }],
      tags: { team: "bio" },
      volumes: ["/vol"],
      resources: {
        cpu_cores: 2,
        preemptible: true,
        backend_parameters: { k: "v" },
        backend_parameters_strict: true,
      },
    });
  });
});
