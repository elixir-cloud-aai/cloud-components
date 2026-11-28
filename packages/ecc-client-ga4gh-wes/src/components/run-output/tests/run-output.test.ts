/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-script-url -- tests that script URLs are refused */
import { expect, fixture, html, waitUntil } from "@open-wc/testing";
import sinon from "sinon";
import "../index.js";
import { ECCClientGa4ghWesRunOutput } from "../run-output.js";
import type { WesOutputProvider } from "../../../providers/index.js";

const REPORT = "s3://bucket/run/report.html";
const COUNTS = "s3://bucket/run/read_counts.tsv";
const BAM = "s3://bucket/run/filtered.bam";
const SCHEMES = ["drs", "https", "s3"];

/** A response that never arrives. */
const NEVER = new Promise<Response>(() => {
  // Never settles
});

const fileRef = (extra: Record<string, unknown> = {}) => ({
  type: "string",
  "x-ga4gh-file": { kind: "file" },
  ...extra,
});

const tableSchema = fileRef({
  title: "Read counts",
  "x-ga4gh-file": { kind: "file", mediaType: "text/tab-separated-values" },
  "x-ga4gh-ui-widget": "table-viewer",
});

const htmlSchema = fileRef({
  title: "Report",
  "x-ga4gh-file": { kind: "file", mediaType: "text/html" },
  "x-ga4gh-ui-widget": "html-viewer",
});

/** A provider that serves the given files and downloads by `/dl?`. */
const stubProvider = (files: Record<string, string> = {}) =>
  ({
    fetchOutput: sinon.stub().callsFake(async (uri: string) => {
      if (!(uri in files)) throw new Error(`not found: ${uri}`);
      return new Response(files[uri]);
    }),
    getDownloadUrl: sinon
      .stub()
      .callsFake(
        async (uri: string) =>
          `https://proxy.example.org/dl?u=${encodeURIComponent(uri)}`
      ),
  } satisfies WesOutputProvider);

const render = async (
  schema: unknown,
  value: unknown,
  provider?: WesOutputProvider,
  options: {
    maxRows?: number;
    maxColumns?: number;
    maxFiles?: number;
    maxBytes?: number;
    schemes?: string[];
  } = {}
) =>
  fixture<ECCClientGa4ghWesRunOutput>(html`<ecc-client-ga4gh-wes-run-output
    name="out"
    .schema=${schema}
    .value=${value}
    .provider=${provider}
    .allowedSchemes=${options.schemes ?? SCHEMES}
    .maxRows=${options.maxRows ?? 1000}
    .maxColumns=${options.maxColumns ?? 100}
    .maxFiles=${options.maxFiles ?? 50}
    .maxBytes=${options.maxBytes ?? 1024 * 1024}
  ></ecc-client-ga4gh-wes-run-output>`);

const root = (el: ECCClientGa4ghWesRunOutput) => el.shadowRoot as ShadowRoot;

/** Waits until no entry of the element is loading. */
const settled = async (el: ECCClientGa4ghWesRunOutput) => {
  await waitUntil(() => !root(el).querySelector("[data-loading]"));
  await el.updateComplete;
};

const downloadButtons = (el: ECCClientGa4ghWesRunOutput) =>
  root(el).querySelectorAll("[data-download]");

describe("ecc-client-ga4gh-wes-run-output", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("shows the title and description as text", async () => {
    const el = await render(
      {
        type: "integer",
        title: "<b>Samples</b>",
        description: "<img src=x onerror=alert(1)> passing *QC*",
      },
      2
    );
    expect(root(el).querySelector("b, img")).to.equal(null);
    expect(root(el).textContent).to.contain("<b>Samples</b>");
    expect(root(el).textContent).to.contain("<img src=x onerror=alert(1)>");
    expect(root(el).textContent).to.contain("2");
  });

  it("falls back to the name of the output as its title", async () => {
    const el = await render({ type: "integer" }, 2);
    expect(root(el).querySelector("[data-title]")?.textContent).to.contain(
      "out"
    );
  });

  describe("table-viewer", () => {
    it("shows TSV as a table with escaped cells", async () => {
      const provider = stubProvider({
        [COUNTS]: "reference\tmapped\nchr1\t<img src=x onerror=alert(1)>\n",
      });
      const el = await render(tableSchema, COUNTS, provider);
      await settled(el);

      expect(provider.fetchOutput.firstCall.args[0]).to.equal(COUNTS);
      const heads = root(el).querySelectorAll("ecc-utils-design-table-head");
      expect(Array.from(heads, (h) => h.textContent?.trim())).to.deep.equal([
        "reference",
        "mapped",
      ]);
      const cells = root(el).querySelectorAll("ecc-utils-design-table-cell");
      expect(cells[1].textContent?.trim()).to.equal(
        "<img src=x onerror=alert(1)>"
      );
      expect(root(el).querySelector("img")).to.equal(null);
    });

    it("shows at most maxRows rows and offers the rest for download", async () => {
      const provider = stubProvider({ [COUNTS]: "h\n1\n2\n3\n4\n" });
      const el = await render(tableSchema, COUNTS, provider, { maxRows: 2 });
      await settled(el);

      const rows = root(el).querySelectorAll(
        "ecc-utils-design-table-body ecc-utils-design-table-row"
      );
      expect(rows.length).to.equal(2);
      expect(root(el).textContent).to.contain("first 2 rows");
      expect(downloadButtons(el).length).to.equal(1);
    });

    it("shows a table cut at the byte limit as incomplete", async () => {
      const provider = stubProvider({ [COUNTS]: "h\nfirst\nsecond\n" });
      // "h\nfirst\nsec": the partial last line is dropped
      const el = await render(tableSchema, COUNTS, provider, { maxBytes: 11 });
      await settled(el);

      const rows = root(el).querySelectorAll(
        "ecc-utils-design-table-body ecc-utils-design-table-row"
      );
      expect(rows.length).to.equal(1);
      expect(root(el).textContent).to.contain("first row only");
    });
  });

  describe("html-viewer", () => {
    it("shows HTML in a frame with an empty sandbox and a CSP", async () => {
      const markup = "<html><body><script>alert(1)</script>Hi</body></html>";
      const provider = stubProvider({ [REPORT]: markup });
      const el = await render(htmlSchema, REPORT, provider);
      await settled(el);

      const frame = root(el).querySelector("iframe") as HTMLIFrameElement;
      expect(frame).to.be.instanceOf(HTMLIFrameElement);
      expect(frame.hasAttribute("sandbox")).to.equal(true);
      expect(frame.getAttribute("sandbox")).to.equal("");
      expect(frame.sandbox.length).to.equal(0);
      expect(frame.hasAttribute("src")).to.equal(false);
      const srcdoc = frame.getAttribute("srcdoc") as string;
      expect(srcdoc.indexOf("Content-Security-Policy")).to.be.lessThan(
        srcdoc.indexOf("<script>alert(1)</script>Hi")
      );
      expect(srcdoc).to.contain("default-src 'none'");
      expect(frame.title).to.equal("Report");
    });

    it("runs no scripts of the HTML", async () => {
      const messages: unknown[] = [];
      const listener = (event: MessageEvent) => messages.push(event.data);
      window.addEventListener("message", listener);
      try {
        const provider = stubProvider({
          [REPORT]:
            '<script>parent.postMessage("ran", "*")</script>' +
            "<img src=\"x\" onerror=\"parent.postMessage('ran', '*')\">",
        });
        const el = await render(htmlSchema, REPORT, provider);
        await settled(el);
        const frame = root(el).querySelector("iframe") as HTMLIFrameElement;
        await new Promise((resolve) => {
          frame.addEventListener("load", resolve, { once: true });
          setTimeout(resolve, 1000);
        });
        await new Promise((resolve) => {
          setTimeout(resolve, 200);
        });

        expect(messages).to.deep.equal([]);
        // An opaque origin: the page can't reach into the frame either
        expect(frame.contentDocument).to.equal(null);
      } finally {
        window.removeEventListener("message", listener);
      }
    });

    it("offers HTML cut at the byte limit for download only", async () => {
      const provider = stubProvider({ [REPORT]: "<p>a long report</p>" });
      const el = await render(htmlSchema, REPORT, provider, { maxBytes: 4 });
      await settled(el);

      expect(root(el).querySelector("iframe")).to.equal(null);
      expect(root(el).textContent).to.contain("too large");
      expect(downloadButtons(el).length).to.equal(1);
    });

    it("offers directories for download only", async () => {
      const provider = stubProvider();
      const el = await render(
        {
          type: "string",
          "x-ga4gh-file": { kind: "directory" },
          "x-ga4gh-ui-widget": "html-viewer",
        },
        "s3://bucket/run/dir/",
        provider
      );
      await settled(el);

      expect(provider.fetchOutput.callCount).to.equal(0);
      expect(root(el).querySelector("iframe")).to.equal(null);
      expect(downloadButtons(el).length).to.equal(1);
    });
  });

  describe("other outputs", () => {
    [undefined, "pdf-viewer", "custom:igv", 42].forEach((widget) => {
      it(`offers files with viewer ${widget} for download only`, async () => {
        const provider = stubProvider();
        const el = await render(
          fileRef(widget === undefined ? {} : { "x-ga4gh-ui-widget": widget }),
          BAM,
          provider
        );
        await settled(el);

        expect(provider.fetchOutput.callCount).to.equal(0);
        expect(root(el).querySelector("iframe, table")).to.equal(null);
        expect(downloadButtons(el).length).to.equal(1);
        // Never a direct link to the stored file
        expect(root(el).querySelector("a[href]")).to.equal(null);
      });
    });

    it("shows one entry per file of a list", async () => {
      const el = await render(
        { type: "array", items: fileRef() },
        [BAM, "s3://bucket/run/other.bam"],
        stubProvider()
      );
      expect(downloadButtons(el).length).to.equal(2);
      expect(root(el).textContent).to.contain("other.bam");
    });

    it("shows one entry per file keyed by name, with its viewer", async () => {
      const provider = stubProvider({
        "s3://bucket/s1.tsv": "g\tn\nA\t1\n",
        "s3://bucket/s2.tsv": "g\tn\nB\t2\n",
      });
      const el = await render(
        { type: "object", additionalProperties: tableSchema },
        { s1: "s3://bucket/s1.tsv", s2: "s3://bucket/s2.tsv" },
        provider
      );
      await settled(el);

      expect(provider.fetchOutput.callCount).to.equal(2);
      const labels = root(el).querySelectorAll("[data-label]");
      expect(Array.from(labels, (l) => l.textContent?.trim())).to.deep.equal([
        "s1",
        "s2",
      ]);
      expect(
        root(el).querySelectorAll("ecc-utils-design-table").length
      ).to.equal(2);
    });

    it("shows records as JSON text", async () => {
      const el = await render(
        { type: "object", properties: { a: { type: "string" } } },
        { a: "<i>x</i>" }
      );
      expect(root(el).querySelector("i")).to.equal(null);
      expect(root(el).querySelector("pre")?.textContent).to.contain(
        '"a": "<i>x</i>"'
      );
    });
  });

  describe("fallbacks", () => {
    it("offers a file for download if fetching it fails", async () => {
      const provider = stubProvider();
      const el = await render(tableSchema, COUNTS, provider);
      await settled(el);

      expect(root(el).textContent).to.contain("not found");
      expect(root(el).querySelector("ecc-utils-design-table")).to.equal(null);
      expect(downloadButtons(el).length).to.equal(1);
    });

    it("offers a file for download if the response is an error", async () => {
      const provider = stubProvider();
      provider.fetchOutput.callsFake(
        async () => new Response("<p>denied</p>", { status: 403 })
      );
      const el = await render(htmlSchema, REPORT, provider);
      await settled(el);

      expect(root(el).querySelector("iframe")).to.equal(null);
      expect(root(el).textContent).to.contain("403");
      expect(downloadButtons(el).length).to.equal(1);
    });

    it("shows the URI as text without a provider", async () => {
      const el = await render(htmlSchema, REPORT);
      expect(root(el).querySelector("iframe, a[href]")).to.equal(null);
      expect(downloadButtons(el).length).to.equal(0);
      expect(root(el).textContent).to.contain(REPORT);
      expect(root(el).textContent).to.contain("Download isn't available");
    });
  });

  describe("allow-list", () => {
    [
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "http://example.org/report.html",
      "file:///etc/passwd",
      "report.html",
    ].forEach((uri) => {
      it(`fetches and links nothing for ${uri}`, async () => {
        const provider = stubProvider({ [uri]: "<p>x</p>" });
        const el = await render(htmlSchema, uri, provider, {
          schemes: [...SCHEMES, "javascript", "data", "file"],
        });
        await settled(el);

        expect(provider.fetchOutput.callCount).to.equal(0);
        expect(provider.getDownloadUrl.callCount).to.equal(0);
        expect(root(el).querySelector("iframe, a[href]")).to.equal(null);
        expect(downloadButtons(el).length).to.equal(0);
        expect(root(el).textContent).to.contain("not allowed");
      });
    });

    it("narrows the allow-list by the schemes of the file reference", async () => {
      const provider = stubProvider({ [REPORT]: "<p>x</p>" });
      const el = await render(
        { ...htmlSchema, "x-ga4gh-file": { kind: "file", schemes: ["drs"] } },
        REPORT,
        provider
      );
      await settled(el);

      expect(provider.fetchOutput.callCount).to.equal(0);
      expect(downloadButtons(el).length).to.equal(0);
    });

    it("reads the allow-list from the allowed-schemes attribute", async () => {
      const el = await fixture<ECCClientGa4ghWesRunOutput>(
        html`<ecc-client-ga4gh-wes-run-output
          allowed-schemes="drs, HTTPS s3"
        ></ecc-client-ga4gh-wes-run-output>`
      );
      expect(el.allowedSchemes).to.deep.equal(["drs", "https", "s3"]);
    });

    it("allows only drs and https by default", async () => {
      const el = await fixture<ECCClientGa4ghWesRunOutput>(
        html`<ecc-client-ga4gh-wes-run-output></ecc-client-ga4gh-wes-run-output>`
      );
      expect(el.allowedSchemes).to.deep.equal(["drs", "https"]);
    });
  });

  describe("download", () => {
    let clicked: string[];

    beforeEach(() => {
      clicked = [];
      sinon
        .stub(HTMLAnchorElement.prototype, "click")
        .callsFake(function record(this: HTMLAnchorElement) {
          clicked.push(this.href);
          expect(this.hasAttribute("download")).to.equal(true);
          expect(this.rel).to.contain("noopener");
        });
    });

    it("downloads by the URL that the provider returns", async () => {
      const provider = stubProvider();
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      await waitUntil(() => clicked.length === 1);

      expect(provider.getDownloadUrl.firstCall.args[0]).to.equal(BAM);
      expect(clicked[0]).to.equal(
        `https://proxy.example.org/dl?u=${encodeURIComponent(BAM)}`
      );
    });

    it("refuses download URLs that aren't http or https", async () => {
      const provider = stubProvider();
      provider.getDownloadUrl.callsFake(async () => "javascript:alert(1)");
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      await waitUntil(() => root(el).textContent?.includes("Download failed"));

      expect(clicked).to.deep.equal([]);
    });

    it("says why a download URL couldn't be got", async () => {
      const provider = stubProvider();
      provider.getDownloadUrl.rejects(new Error("expired token"));
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      await waitUntil(() => root(el).textContent?.includes("expired token"));

      expect(root(el).textContent).to.contain("Download failed");
      expect(clicked).to.deep.equal([]);
    });

    it("drops a download of an output that changed meanwhile", async () => {
      let release: (url: string) => void = () => undefined;
      const provider = stubProvider();
      provider.getDownloadUrl.callsFake(
        () =>
          new Promise<string>((resolve) => {
            release = resolve;
          })
      );
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      el.value = "s3://bucket/run/other.bam";
      await el.updateComplete;
      release("https://proxy.example.org/dl?old");
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });

      expect(clicked).to.deep.equal([]);
    });
  });

  describe("limits", () => {
    it("offers a table for download if its header exceeds the byte limit", async () => {
      const provider = stubProvider({ [COUNTS]: "a very long header\n1\n" });
      const el = await render(tableSchema, COUNTS, provider, { maxBytes: 5 });
      await settled(el);

      expect(root(el).querySelector("ecc-utils-design-table")).to.equal(null);
      expect(root(el).textContent).to.contain("too large");
      expect(downloadButtons(el).length).to.equal(1);
    });

    it("shows at most maxColumns columns", async () => {
      const provider = stubProvider({ [COUNTS]: "a\tb\tc\n1\t2\t3\n" });
      const el = await render(tableSchema, COUNTS, provider, {
        maxColumns: 2,
      });
      await settled(el);

      expect(
        root(el).querySelectorAll("ecc-utils-design-table-head").length
      ).to.equal(2);
      expect(
        root(el).querySelectorAll("ecc-utils-design-table-cell").length
      ).to.equal(2);
      expect(root(el).textContent).to.contain("first 2 columns");
    });

    it("shows at most maxFiles files of a list, loaded one at a time", async () => {
      let inFlight = 0;
      let maxInFlight = 0;
      const provider = stubProvider();
      provider.fetchOutput.callsFake(async () => {
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await new Promise((resolve) => {
          setTimeout(resolve, 5);
        });
        inFlight -= 1;
        return new Response("h\n1\n");
      });
      const uris = Array.from(
        { length: 5 },
        (_, i) => `s3://bucket/run/s${i}.tsv`
      );
      const el = await render(
        { type: "array", items: tableSchema },
        uris,
        provider,
        { maxFiles: 3 }
      );
      await settled(el);

      expect(root(el).querySelectorAll("[data-entry]").length).to.equal(3);
      expect(provider.fetchOutput.callCount).to.equal(3);
      expect(maxInFlight).to.equal(1);
      expect(root(el).textContent).to.contain("2 more not shown");
    });

    it("uses the default limits for invalid ones", async () => {
      const provider = stubProvider({ [COUNTS]: "h\n1\n2\n" });
      const el = await render(tableSchema, COUNTS, provider, {
        maxRows: Number.NaN,
        maxColumns: -1,
        maxBytes: Number.NaN,
      });
      await settled(el);

      expect(
        root(el).querySelectorAll("ecc-utils-design-table-cell").length
      ).to.equal(2);
      expect(root(el).querySelector("[data-notice]")).to.equal(null);
    });
  });

  describe("reloads", () => {
    afterEach(() => {
      ECCClientGa4ghWesRunOutput.loadTimeout = 30000;
      ECCClientGa4ghWesRunOutput.maxCells = 200000;
    });

    it("shows at most maxCells cells over all tables", async () => {
      ECCClientGa4ghWesRunOutput.maxCells = 6;
      const provider = stubProvider({
        "s3://bucket/a.tsv": "h\tg\n1\t2\n3\t4\n",
        "s3://bucket/b.tsv": "h\tg\n5\t6\n",
        "s3://bucket/c.tsv": "h\tg\n7\t8\n",
      });
      const el = await render(
        { type: "array", items: tableSchema },
        ["s3://bucket/a.tsv", "s3://bucket/b.tsv", "s3://bucket/c.tsv"],
        provider
      );
      await settled(el);

      // a: header and 2 rows (6 cells); b: none left; c: none left
      const cells = root(el).querySelectorAll("ecc-utils-design-table-cell");
      expect(Array.from(cells, (c) => c.textContent?.trim())).to.deep.equal([
        "1",
        "2",
        "3",
        "4",
      ]);
      expect(root(el).textContent).to.contain("too large to show together");
    });

    it("gives up on a download URL that doesn't arrive", async () => {
      ECCClientGa4ghWesRunOutput.loadTimeout = 50;
      const provider = stubProvider();
      provider.getDownloadUrl.returns(
        new Promise<string>(() => {
          // Never settles
        })
      );
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      await waitUntil(() => root(el).textContent?.includes("Download failed"));

      expect(root(el).textContent).to.contain("no response within");
    });

    it("drops a download if the same index now holds another file", async () => {
      let release: (url: string) => void = () => undefined;
      const provider = stubProvider();
      provider.getDownloadUrl.callsFake(
        () =>
          new Promise<string>((resolve) => {
            release = resolve;
          })
      );
      const click = sinon.stub(HTMLAnchorElement.prototype, "click");
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      // Set, but not yet updated
      el.value = "s3://bucket/run/other.bam";
      release("https://proxy.example.org/dl?old");
      await new Promise((resolve) => {
        setTimeout(resolve, 20);
      });

      expect(click.callCount).to.equal(0);
    });

    it("keeps the result of the latest download request", async () => {
      const releases: ((url: string) => void)[] = [];
      const provider = stubProvider();
      provider.getDownloadUrl.callsFake(
        () =>
          new Promise<string>((resolve) => {
            releases.push(resolve);
          })
      );
      const click = sinon.stub(HTMLAnchorElement.prototype, "click");
      const el = await render(fileRef(), BAM, provider);
      (downloadButtons(el)[0] as HTMLElement).click();
      (downloadButtons(el)[0] as HTMLElement).click();
      releases[1]("https://proxy.example.org/dl?new");
      releases[0]("javascript:alert(1)");
      await new Promise((resolve) => {
        setTimeout(resolve, 20);
      });
      await el.updateComplete;

      expect(click.callCount).to.equal(1);
      expect(root(el).textContent).not.to.contain("Download failed");
    });

    it("gives up on a file that doesn't arrive and loads the next", async () => {
      ECCClientGa4ghWesRunOutput.loadTimeout = 50;
      const provider = stubProvider({ "s3://bucket/b.tsv": "h\nb\n" });
      provider.fetchOutput.withArgs("s3://bucket/a.tsv").returns(NEVER);
      const el = await render(
        { type: "array", items: tableSchema },
        ["s3://bucket/a.tsv", "s3://bucket/b.tsv"],
        provider
      );
      await settled(el);

      expect(root(el).textContent).to.contain("no response within 0.05 s");
      const cells = root(el).querySelectorAll("ecc-utils-design-table-cell");
      expect(Array.from(cells, (c) => c.textContent?.trim())).to.deep.equal([
        "b",
      ]);
    });

    it("retries failed viewers on reload()", async () => {
      const provider = stubProvider();
      provider.fetchOutput
        .onFirstCall()
        .resolves(new Response("busy", { status: 503 }));
      provider.fetchOutput.onSecondCall().resolves(new Response("h\n1\n"));
      const el = await render(tableSchema, COUNTS, provider);
      await settled(el);
      expect(root(el).textContent).to.contain("503");

      el.reload();
      await el.updateComplete;
      await settled(el);

      expect(provider.fetchOutput.callCount).to.equal(2);
      expect(root(el).querySelector("ecc-utils-design-table")).not.to.equal(
        null
      );
    });

    it("counts files left out of a list that grows", async () => {
      const uris = (n: number) =>
        Array.from({ length: n }, (_, i) => `s3://bucket/run/s${i}.bam`);
      const el = await render(
        { type: "array", items: fileRef() },
        uris(3),
        stubProvider(),
        { maxFiles: 2 }
      );
      expect(root(el).textContent).to.contain("1 more not shown");

      el.value = uris(5);
      await el.updateComplete;
      expect(root(el).textContent).to.contain("3 more not shown");
    });

    it("doesn't refetch for equal but new properties", async () => {
      const provider = stubProvider({ [COUNTS]: "h\n1\n" });
      const el = await render(tableSchema, COUNTS, provider);
      await settled(el);

      el.schema = JSON.parse(JSON.stringify(tableSchema));
      el.allowedSchemes = [...SCHEMES];
      await el.updateComplete;

      expect(provider.fetchOutput.callCount).to.equal(1);
      expect(root(el).querySelector("ecc-utils-design-table")).not.to.equal(
        null
      );
    });

    it("refetches when the allow-list changes", async () => {
      const provider = stubProvider({ [COUNTS]: "h\n1\n" });
      const el = await render(tableSchema, COUNTS, provider);
      await settled(el);

      el.allowedSchemes = ["https"];
      await el.updateComplete;

      expect(root(el).textContent).to.contain("not allowed");
    });

    it("uses the default allow-list for one that isn't an array", async () => {
      const el = await render(
        fileRef(),
        "https://example.org/a.bam",
        stubProvider(),
        {
          schemes: undefined,
        }
      );
      el.allowedSchemes = undefined as unknown as string[];
      await el.updateComplete;

      expect(downloadButtons(el).length).to.equal(1);
      el.value = BAM;
      await el.updateComplete;
      expect(root(el).textContent).to.contain("not allowed");
    });

    it("uses the default allow-list when the attribute is removed", async () => {
      const el = await fixture<ECCClientGa4ghWesRunOutput>(
        html`<ecc-client-ga4gh-wes-run-output
          allowed-schemes="s3"
        ></ecc-client-ga4gh-wes-run-output>`
      );
      el.removeAttribute("allowed-schemes");
      expect(el.allowedSchemes).to.deep.equal(["drs", "https"]);
    });

    it("aborts loads when removed and loads again when added", async () => {
      const signals: AbortSignal[] = [];
      const provider = stubProvider();
      provider.fetchOutput.callsFake(
        (_uri: string, init?: { signal?: AbortSignal }) => {
          signals.push(init?.signal as AbortSignal);
          return new Promise<Response>(() => {
            // Never settles
          });
        }
      );
      const el = await render(tableSchema, COUNTS, provider);
      const parent = el.parentNode as Node;
      el.remove();
      expect(signals[0].aborted).to.equal(true);

      parent.appendChild(el);
      await el.updateComplete;
      expect(provider.fetchOutput.callCount).to.equal(2);
      expect(signals[1].aborted).to.equal(false);
    });
  });

  it("drops results of a value that was replaced while loading", async () => {
    let release: (r: Response) => void = () => undefined;
    const provider = stubProvider({ "s3://bucket/new.tsv": "h\nnew\n" });
    provider.fetchOutput.onFirstCall().callsFake(
      () =>
        new Promise<Response>((resolve) => {
          release = resolve;
        })
    );
    const el = await render(tableSchema, COUNTS, provider);
    el.value = "s3://bucket/new.tsv";
    await settled(el);
    release(new Response("h\nold\n"));
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    await el.updateComplete;

    const cells = root(el).querySelectorAll("ecc-utils-design-table-cell");
    expect(Array.from(cells, (c) => c.textContent?.trim())).to.deep.equal([
      "new",
    ]);
  });
});
