/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-script-url -- tests that script URLs are refused */
import { expect } from "@open-wc/testing";
import {
  checkOutputUri,
  delimiterFor,
  htmlSrcdoc,
  isHttpUrl,
  outputEntries,
  parseDelimited,
  readLimitedText,
  viewerOf,
} from "../utils.js";

const fileRef = (extra: Record<string, unknown> = {}) => ({
  type: "string",
  "x-ga4gh-file": { kind: "file" },
  ...extra,
});

describe("checkOutputUri", () => {
  const allowed = ["drs", "https", "s3"];

  it("accepts URIs with an allowed scheme, in any case", () => {
    expect(checkOutputUri("https://example.org/a.tsv", allowed)).to.equal(null);
    expect(checkOutputUri("S3://bucket/a.tsv", allowed)).to.equal(null);
    expect(checkOutputUri("drs://dg.4503:6ca5c2a8", allowed)).to.equal(null);
  });

  it("rejects schemes that aren't on the allow-list", () => {
    expect(checkOutputUri("http://example.org/a", allowed)).to.be.a("string");
    expect(checkOutputUri("gs://bucket/a", allowed)).to.be.a("string");
  });

  it("rejects schemes that run code or refer to local data, even if allowed", () => {
    const all = [
      "javascript",
      "vbscript",
      "livescript",
      "data",
      "blob",
      "filesystem",
      "file",
      "jar",
      "view-source",
      "about",
    ];
    expect(checkOutputUri("javascript:alert(1)", all)).to.be.a("string");
    expect(checkOutputUri("JavaScript:alert(1)", all)).to.be.a("string");
    expect(checkOutputUri("data:text/html,<b>x</b>", all)).to.be.a("string");
    expect(checkOutputUri("file:///etc/passwd", all)).to.be.a("string");
    expect(checkOutputUri("blob:https://a/b", all)).to.be.a("string");
  });

  it("rejects paths, whitespace, control characters and non-strings", () => {
    expect(checkOutputUri("out/a.tsv", allowed)).to.be.a("string");
    expect(checkOutputUri("/data/a.tsv", allowed)).to.be.a("string");
    expect(checkOutputUri(" https://example.org/a", allowed)).to.be.a("string");
    expect(checkOutputUri("https://example.org/a\n", allowed)).to.be.a(
      "string"
    );
    expect(checkOutputUri("https://exa\u0000mple.org/a", allowed)).to.be.a(
      "string"
    );
    expect(checkOutputUri("https://exa\u007Fmple.org/a", allowed)).to.be.a(
      "string"
    );
    expect(checkOutputUri(42, allowed)).to.be.a("string");
  });

  it("narrows the allow-list by the schemes of the file reference", () => {
    expect(checkOutputUri("s3://bucket/a", allowed, ["drs"])).to.be.a("string");
    expect(checkOutputUri("drs://x/1", allowed, ["DRS"])).to.equal(null);
    // The file reference never extends the allow-list
    expect(checkOutputUri("gs://bucket/a", allowed, ["gs"])).to.be.a("string");
  });
});

describe("isHttpUrl", () => {
  it("accepts http and https URLs, also relative ones", () => {
    expect(isHttpUrl("https://example.org/a")).to.equal(true);
    expect(isHttpUrl("http://localhost:8080/a")).to.equal(true);
    expect(isHttpUrl("/downloads/a.tsv")).to.equal(true);
  });

  it("rejects other schemes and non-strings", () => {
    expect(isHttpUrl("javascript:alert(1)")).to.equal(false);
    expect(isHttpUrl("data:text/plain,a")).to.equal(false);
    expect(isHttpUrl("blob:https://example.org/1")).to.equal(false);
    expect(isHttpUrl(undefined)).to.equal(false);
  });
});

describe("viewerOf", () => {
  it("returns the viewers of the vocabulary for files", () => {
    expect(viewerOf(fileRef({ "x-ga4gh-ui-widget": "table-viewer" }))).to.equal(
      "table-viewer"
    );
    expect(viewerOf(fileRef({ "x-ga4gh-ui-widget": "html-viewer" }))).to.equal(
      "html-viewer"
    );
  });

  it("returns null for other, unknown and custom viewers", () => {
    expect(viewerOf(fileRef())).to.equal(null);
    expect(viewerOf(fileRef({ "x-ga4gh-ui-widget": "pdf-viewer" }))).to.equal(
      null
    );
    expect(viewerOf(fileRef({ "x-ga4gh-ui-widget": "custom:igv" }))).to.equal(
      null
    );
  });

  it("returns null for directories", () => {
    expect(
      viewerOf({
        type: "string",
        "x-ga4gh-file": { kind: "directory" },
        "x-ga4gh-ui-widget": "html-viewer",
      })
    ).to.equal(null);
  });
});

describe("outputEntries", () => {
  it("returns one entry for a file", () => {
    const schema = fileRef();
    expect(outputEntries(schema, "s3://b/a.html")).to.deep.equal([
      { type: "file", uri: "s3://b/a.html", schema },
    ]);
  });

  it("returns one entry per file of a list, labelled by file name", () => {
    const items = fileRef();
    const entries = outputEntries({ type: "array", items }, [
      "s3://b/x/s1.bam",
      "s3://b/x/s%202.bam",
    ]);
    expect(entries).to.deep.equal([
      { type: "file", label: "s1.bam", uri: "s3://b/x/s1.bam", schema: items },
      {
        type: "file",
        label: "s 2.bam",
        uri: "s3://b/x/s%202.bam",
        schema: items,
      },
    ]);
  });

  it("returns one entry per file keyed by name, labelled by key", () => {
    const additionalProperties = fileRef();
    const entries = outputEntries(
      { type: "object", additionalProperties },
      {
        s1: "s3://b/s1.tsv",
        s2: "s3://b/s2.tsv",
      }
    );
    expect(entries.map((e) => e.type === "file" && e.label)).to.deep.equal([
      "s1",
      "s2",
    ]);
  });

  it("returns values that aren't files as values", () => {
    expect(outputEntries({ type: "integer" }, 2)).to.deep.equal([
      { type: "value", value: 2 },
    ]);
    // A file reference whose value isn't a string
    expect(outputEntries(fileRef(), 3)).to.deep.equal([
      { type: "value", value: 3 },
    ]);
    expect(outputEntries(undefined, "s3://b/a")).to.deep.equal([
      { type: "value", value: "s3://b/a" },
    ]);
  });
});

describe("delimiterFor", () => {
  it("uses the media type first", () => {
    expect(
      delimiterFor("text/tab-separated-values", "s3://b/a.csv", "")
    ).to.equal("\t");
    expect(delimiterFor("text/csv", "s3://b/a.tsv", "")).to.equal(",");
  });

  it("then the extension, then the first line", () => {
    expect(delimiterFor(undefined, "s3://b/a.tsv", "a,b")).to.equal("\t");
    expect(delimiterFor(undefined, "s3://b/a.csv?x=1", "a\tb")).to.equal(",");
    expect(delimiterFor(undefined, "s3://b/a", "a\tb\n")).to.equal("\t");
    expect(delimiterFor(undefined, "s3://b/a", "a,b\n")).to.equal(",");
  });
});

describe("parseDelimited", () => {
  it("splits TSV into a header and rows", () => {
    expect(parseDelimited("a\tb\r\n1\t2\n3\t4\n", "\t", 10, 10)).to.deep.equal({
      header: ["a", "b"],
      rows: [
        ["1", "2"],
        ["3", "4"],
      ],
      more: false,
      moreColumns: false,
    });
  });

  it("parses quoted CSV fields", () => {
    const text = 'name,note\n"Smith, J.","said ""hi""\nthen left"\n';
    expect(parseDelimited(text, ",", 10, 10).rows).to.deep.equal([
      ["Smith, J.", 'said "hi"\nthen left'],
    ]);
  });

  it("stops at the row limit and says that there are more", () => {
    const text = "h\n1\n2\n3\n4\n";
    expect(parseDelimited(text, ",", 2, 10)).to.deep.equal({
      header: ["h"],
      rows: [["1"], ["2"]],
      more: true,
      moreColumns: false,
    });
  });

  ["\t", ","].forEach((delimiter) => {
    it(`cuts rows at the column limit (${JSON.stringify(delimiter)})`, () => {
      const line = (n: number) =>
        Array.from({ length: n }, (_, i) => `c${i}`).join(delimiter);
      const text = `${line(5)}\n${line(3)}\n${line(100000)}\n`;
      expect(
        parseDelimited(text, delimiter as "\t" | ",", 10, 3)
      ).to.deep.equal({
        header: ["c0", "c1", "c2"],
        rows: [
          ["c0", "c1", "c2"],
          ["c0", "c1", "c2"],
        ],
        more: false,
        moreColumns: true,
      });
    });
  });

  it("returns an empty table for empty text", () => {
    expect(parseDelimited("", ",", 10, 10)).to.deep.equal({
      header: [],
      rows: [],
      more: false,
      moreColumns: false,
    });
  });
});

describe("readLimitedText", () => {
  it("reads the whole text below the limit", async () => {
    const result = await readLimitedText(new Response("héllo"), 100);
    expect(result).to.deep.equal({ text: "héllo", truncated: false });
  });

  it("stops at the limit and says so", async () => {
    const result = await readLimitedText(new Response("abcdefghij"), 4);
    expect(result).to.deep.equal({ text: "abcd", truncated: true });
  });
});

describe("htmlSrcdoc", () => {
  it("puts a Content Security Policy before the markup", () => {
    const doc = htmlSrcdoc("<!DOCTYPE html><html><head></head><p>x</p>");
    const csp = doc.indexOf('http-equiv="Content-Security-Policy"');
    expect(csp).to.be.greaterThan(-1);
    expect(csp).to.be.lessThan(doc.indexOf("<html>"));
    expect(doc).to.contain("default-src 'none'");
  });

  it("applies the policy in a parsed document", () => {
    const parsed = new DOMParser().parseFromString(
      htmlSrcdoc("<html><head><title>t</title></head><body>b</body></html>"),
      "text/html"
    );
    const meta = parsed.head.firstElementChild;
    expect(meta?.getAttribute("http-equiv")).to.equal(
      "Content-Security-Policy"
    );
  });

  it("keeps links from loading other pages into the frame", () => {
    const parsed = new DOMParser().parseFromString(
      htmlSrcdoc('<base target="_self"><a href="https://a.example/">a</a>'),
      "text/html"
    );
    // The first base element wins
    expect(parsed.querySelector("base")?.getAttribute("target")).to.equal(
      "_blank"
    );
    expect(
      parsed.querySelector('meta[name="referrer"]')?.getAttribute("content")
    ).to.equal("no-referrer");
  });

  it("removes what would override that from the markup", () => {
    const parsed = new DOMParser().parseFromString(
      htmlSrcdoc(
        '<meta name="referrer" content="unsafe-url">' +
          '<meta http-equiv="refresh" content="0;url=https://a.example/">' +
          '<a href="https://a.example/" target="_self">a</a>' +
          '<a href="https://a.example/" referrerpolicy="unsafe-url">b</a>' +
          '<svg><a href="https://a.example/" target="_self"><text>c</text></a></svg>'
      ),
      "text/html"
    );
    expect(parsed.querySelectorAll("base").length).to.equal(1);
    expect(parsed.querySelectorAll("meta[name]").length).to.equal(1);
    expect(parsed.querySelectorAll("meta[http-equiv]").length).to.equal(1);
    expect(parsed.querySelectorAll("[target]").length).to.equal(1);
    expect(parsed.querySelectorAll("[referrerpolicy]").length).to.equal(0);
    expect(parsed.querySelectorAll("a").length).to.equal(3);
  });
});
