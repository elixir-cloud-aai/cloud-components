// Tests for scripts/release.js; run with `node --test scripts/release.test.js`

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { test } = require("node:test");

const {
  citationErrors,
  distTag,
  parseVersion,
  pinInternalDependencies,
  releaseDate,
  releasedPackages,
  setRelease,
  versionMismatches,
} = require("./release.js");

const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
};

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

// A repository with a root, two public packages, a private one and a
// directory without `package.json`
// (removed when the test `t` ends)
const fixture = (t, version = "2.0.0-alpha.49") => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "release-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  writeJson(path.join(base, "package.json"), { name: "root", version });
  writeJson(path.join(base, "packages", "b-design", "package.json"), {
    name: "@elixir-cloud/design",
    version,
    devDependencies: { "@elixir-cloud/eslint-config": "*" },
  });
  writeJson(path.join(base, "packages", "a-wes", "package.json"), {
    name: "@elixir-cloud/wes",
    version,
    dependencies: {
      "@elixir-cloud/design": "*",
      "@elixir-cloud/ro-crate": "*",
      lit: "^2.8.0",
    },
    peerDependencies: { "@elixir-cloud/design": "*" },
  });
  writeJson(path.join(base, "packages", "c-ro-crate", "package.json"), {
    name: "@elixir-cloud/ro-crate",
    version: "0.1.0",
    private: true,
  });
  fs.mkdirSync(path.join(base, "packages", "d-empty"));
  return base;
};

test("parseVersion accepts versions and rejects other strings", () => {
  assert.deepStrictEqual(parseVersion("2.0.0").prerelease, []);
  assert.deepStrictEqual(parseVersion("2.0.0-alpha.49").prerelease, [
    "alpha",
    "49",
  ]);
  [
    "",
    "v2.0.0",
    "2.0",
    "2.0.0-",
    "02.0.0",
    "2.0.0+build",
    "2.0.0-alpha..1",
    undefined,
  ].forEach((version) =>
    assert.throws(() => parseVersion(version), /Not a version/)
  );
});

test("distTag uses latest for releases", () => {
  const tags = ["v1.0.0", "v1.0.1", "v2.0.0-alpha.48"];
  assert.strictEqual(distTag("2.0.0", tags), "latest");
  assert.strictEqual(distTag("2.1.0", [...tags, "v2.0.0"]), "latest");
  assert.strictEqual(distTag("3.0.0", [...tags, "v2.0.0"]), "latest");
});

test("distTag uses latest for prereleases of 2.x until 2.0.0", () => {
  const tags = ["v1.0.1", "v2.0.0-alpha.48", "v2.0.0-rc.1", "v2.0.0+build"];
  assert.strictEqual(distTag("2.0.0-alpha.49", tags), "latest");
  assert.strictEqual(distTag("2.0.0-rc.2", tags), "latest");
  // Only prereleases of 2.x went to `latest`
  assert.strictEqual(distTag("1.1.0-rc.1", tags), "next");
  assert.strictEqual(distTag("3.0.0-alpha.1", tags), "next");
});

test("distTag uses next for prereleases from 2.0.0 on", () => {
  const tags = ["v1.0.1", "v2.0.0-alpha.49", "v2.0.0"];
  assert.strictEqual(distTag("2.1.0-rc.1", tags), "next");
  assert.strictEqual(distTag("2.0.1-1", tags), "next");
  assert.strictEqual(distTag("3.0.0-alpha.1", tags), "next");
  assert.strictEqual(distTag("1.1.0-rc.1", tags), "next");
  // A release of a later major ends the exception, too
  assert.strictEqual(distTag("2.0.0-alpha.50", ["v1.0.1", "v3.0.0"]), "next");
});

test("distTag fails without release tags", () => {
  assert.throws(() => distTag("2.0.0-alpha.49", []), /No release tags/);
  assert.throws(
    () => distTag("2.0.0-alpha.49", ["v2.0.0-alpha.48", "v2.0.0+build"]),
    /No release tags/
  );
});

test("releasedPackages lists public packages, sorted by directory", (t) => {
  const base = fixture(t);
  assert.deepStrictEqual(
    releasedPackages(base).map(({ dir }) => dir),
    [path.join("packages", "a-wes"), path.join("packages", "b-design")]
  );
});

test("versionMismatches is empty when all versions match", (t) => {
  assert.deepStrictEqual(versionMismatches("2.0.0-alpha.49", fixture(t)), []);
});

test("versionMismatches names the root and packages with other versions", (t) => {
  const base = fixture(t);
  const design = path.join(base, "packages", "b-design", "package.json");
  writeJson(design, { ...readJson(design), version: "2.0.0-alpha.48" });
  assert.deepStrictEqual(versionMismatches("2.0.0-alpha.49", base), [
    `@elixir-cloud/design (${path.join(
      "packages",
      "b-design"
    )}) has version 2.0.0-alpha.48, not 2.0.0-alpha.49`,
  ]);
  assert.deepStrictEqual(
    versionMismatches("2.0.0-alpha.50", base).map((message) =>
      message.slice(0, message.indexOf(" "))
    ),
    ["root", "@elixir-cloud/wes", "@elixir-cloud/design"]
  );
  assert.throws(
    () => versionMismatches("v2.0.0-alpha.49", base),
    /Not a version/
  );
});

test("pinInternalDependencies pins dependencies on released packages only", (t) => {
  const base = fixture(t);
  const changes = pinInternalDependencies("2.0.0-alpha.49", base);
  assert.strictEqual(changes.length, 2);
  const wes = readJson(path.join(base, "packages", "a-wes", "package.json"));
  assert.deepStrictEqual(wes.dependencies, {
    "@elixir-cloud/design": "2.0.0-alpha.49",
    "@elixir-cloud/ro-crate": "*",
    lit: "^2.8.0",
  });
  assert.deepStrictEqual(wes.peerDependencies, {
    "@elixir-cloud/design": "2.0.0-alpha.49",
  });
  const design = readJson(
    path.join(base, "packages", "b-design", "package.json")
  );
  assert.deepStrictEqual(design.devDependencies, {
    "@elixir-cloud/eslint-config": "*",
  });
  assert.deepStrictEqual(pinInternalDependencies("2.0.0-alpha.49", base), []);
});

// A citation file with the release's keys after others, as in the repository
const citation = (version = "2.0.0-alpha.49", date = "2026-10-27") =>
  [
    "cff-version: 1.2.0",
    "title: Cloud Components",
    "abstract: >-",
    "  Web components; version: 1.0.0 in a folded value is no key",
    "authors:",
    "  - given-names: Ada",
    `    version: "0.0.1"`,
    `version: "${version}"`,
    `date-released: "${date}"`,
    "",
  ].join("\n");

const citationFixture = (t, text = citation()) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "release-test-"));
  t.after(() => fs.rmSync(base, { recursive: true, force: true }));
  fs.writeFileSync(path.join(base, "CITATION.cff"), text);
  return base;
};

const today = new Date("2026-10-30T12:00:00Z");

// `set` without the version bump of the packages
const setCitation = (version, date, base) =>
  setRelease(version, ["--date", date], {
    base,
    now: today,
    bumpVersions: () => undefined,
  });

test("citationErrors is empty for the release version and a past date", (t) => {
  assert.deepStrictEqual(
    citationErrors("2.0.0-alpha.49", today, citationFixture(t)),
    []
  );
  // Plain, single-quoted and with a comment; on the day of the release
  const plain = citation()
    .replace(`version: "2.0.0-alpha.49"`, "version: 2.0.0-alpha.49 # release")
    .replace(`date-released: "2026-10-27"`, "date-released: '2026-10-30'");
  assert.deepStrictEqual(
    citationErrors("2.0.0-alpha.49", today, citationFixture(t, plain)),
    []
  );
});

test("citationErrors names a wrong version and a future or bad date", (t) => {
  assert.deepStrictEqual(
    citationErrors("2.0.0-alpha.50", today, citationFixture(t)),
    [
      "CITATION.cff has version 2.0.0-alpha.49, not 2.0.0-alpha.50" +
        " (run `node scripts/release.js set 2.0.0-alpha.50`)",
    ]
  );
  const future = citationFixture(t, citation("2.0.0-alpha.49", "2026-10-31"));
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, future), [
    "CITATION.cff has date-released 2026-10-31, which is in the future (UTC)",
  ]);
  const invalid = citationFixture(t, citation("2.0.0-alpha.49", "2026-02-30"));
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, invalid), [
    "CITATION.cff has date-released 2026-02-30, which is not a date (YYYY-MM-DD)",
  ]);
  assert.throws(
    () => citationErrors("v2.0.0", today, citationFixture(t)),
    /Not a version/
  );
});

test("citationErrors names missing, repeated and unsupported keys", (t) => {
  const missing = citationFixture(t, "cff-version: 1.2.0\n");
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, missing), [
    "CITATION.cff has no version",
    "CITATION.cff has no date-released",
  ]);
  const repeated = citationFixture(t, `${citation()}version: "2.0.0"\n`);
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, repeated), [
    "CITATION.cff has version more than once",
  ]);
  const multiline = citationFixture(
    t,
    citation().replace(`version: "2.0.0-alpha.49"`, "version: >-\n  2.0.0")
  );
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, multiline), [
    'CITATION.cff has an unsupported version: use `version: "<value>"`',
  ]);
  const noFile = fs.mkdtempSync(path.join(os.tmpdir(), "release-test-"));
  t.after(() => fs.rmSync(noFile, { recursive: true, force: true }));
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, noFile), [
    "CITATION.cff is missing",
  ]);
});

test("citationErrors rejects values continued on later lines", (t) => {
  // YAML reads `2.0.0 -alpha.1`, after a blank line too, also with CRLF
  ["\n  -alpha.1\n", "\n\n  -alpha.1\n", "\r\n  -alpha.1\r\n"].forEach(
    (continuation) => {
      const text = citation("2.0.0").replace(
        `version: "2.0.0"\n`,
        `version: 2.0.0${continuation}`
      );
      assert.deepStrictEqual(
        citationErrors("2.0.0", today, citationFixture(t, text)),
        ['CITATION.cff has an unsupported version: use `version: "<value>"`']
      );
    }
  );
});

test("citationErrors and setCitation handle CRLF line endings", (t) => {
  const base = citationFixture(t, citation().replace(/\n/g, "\r\n"));
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.49", today, base), []);
  setCitation("2.0.0-alpha.50", "2026-10-30", base);
  assert.strictEqual(
    fs.readFileSync(path.join(base, "CITATION.cff"), "utf8"),
    citation("2.0.0-alpha.50", "2026-10-30").replace(/\n/g, "\r\n")
  );
});

test("setCitation appends missing keys with CRLF in CRLF files", (t) => {
  const base = citationFixture(t, "cff-version: 1.2.0\r\ntitle: X\r\n");
  setCitation("2.0.0", "2026-10-30", base);
  assert.strictEqual(
    fs.readFileSync(path.join(base, "CITATION.cff"), "utf8"),
    'cff-version: 1.2.0\r\ntitle: X\r\nversion: "2.0.0"\r\ndate-released: "2026-10-30"\r\n'
  );
});

test("setCitation keeps comments; a key without a space is unsupported", (t) => {
  const commented = citationFixture(
    t,
    citation().replace(`version: "2.0.0-alpha.49"`, "version: 2.0.0 # release")
  );
  setCitation("2.0.0-alpha.50", "2026-10-30", commented);
  assert.match(
    fs.readFileSync(path.join(commented, "CITATION.cff"), "utf8"),
    /^version: "2\.0\.0-alpha\.50" # release$/m
  );
  const noSpace = citationFixture(
    t,
    citation().replace(`version: "2.0.0-alpha.49"`, "version:2.0.0")
  );
  assert.deepStrictEqual(citationErrors("2.0.0", today, noSpace), [
    'CITATION.cff has an unsupported version: use `version: "<value>"`',
  ]);
});

test("setCitation sets the version and date, keeping the rest", (t) => {
  const base = citationFixture(t);
  setCitation("2.0.0-alpha.50", "2026-10-30", base);
  assert.strictEqual(
    fs.readFileSync(path.join(base, "CITATION.cff"), "utf8"),
    citation("2.0.0-alpha.50", "2026-10-30")
  );
  assert.deepStrictEqual(citationErrors("2.0.0-alpha.50", today, base), []);
});

test("setCitation appends missing keys and rejects bad input", (t) => {
  const base = citationFixture(t, "cff-version: 1.2.0");
  setCitation("2.0.0", "2026-10-30", base);
  assert.strictEqual(
    fs.readFileSync(path.join(base, "CITATION.cff"), "utf8"),
    'cff-version: 1.2.0\nversion: "2.0.0"\ndate-released: "2026-10-30"\n'
  );
  assert.throws(
    () => setCitation("v2.0.0", "2026-10-30", base),
    /Not a version/
  );
  assert.throws(
    () => setCitation("2.0.0", "30.10.2026", base),
    /not a date \(YYYY-MM-DD\)/
  );
  const repeated = citationFixture(t, `${citation()}version: "2.0.0"\n`);
  assert.throws(
    () => setCitation("2.0.0", "2026-10-30", repeated),
    /version more than once/
  );
});

test("releaseDate is today (UTC) or an earlier --date", () => {
  assert.strictEqual(releaseDate([], today), "2026-10-30");
  // 23:30 in UTC-10 is the next day in UTC
  assert.strictEqual(
    releaseDate([], new Date("2026-10-30T23:30:00-10:00")),
    "2026-10-31"
  );
  assert.strictEqual(
    releaseDate(["--date", "2026-10-27"], today),
    "2026-10-27"
  );
  assert.strictEqual(
    releaseDate(["--date", "2026-10-30"], today),
    "2026-10-30"
  );
  assert.throws(
    () => releaseDate(["--date", "2026-10-31"], today),
    /'2026-10-31' is in the future \(UTC\)/
  );
  assert.throws(
    () => releaseDate(["--date", "2026-02-30"], today),
    /not a date \(YYYY-MM-DD\)/
  );
  assert.throws(() => releaseDate(["--date"], today), /Usage/);
  assert.throws(() => releaseDate(["--dat", "2026-10-27"], today), /Usage/);
  assert.throws(
    () => releaseDate(["--date", "2026-10-27", "x"], today),
    /Usage/
  );
});

test("setRelease checks everything before it changes anything", (t) => {
  const bumped = [];
  const bumpVersions = (version) => bumped.push(version);
  const repeated = `${citation()}version: "2.0.0"\n`;
  const base = citationFixture(t, repeated);
  [
    ["2.0.0", [], /version more than once/],
    ["v2.0.0", [], /Not a version/],
    ["2.0.0", ["--date", "2026-10-31"], /in the future/],
  ].forEach(([version, options, error]) => {
    assert.throws(
      () => setRelease(version, options, { base, now: today, bumpVersions }),
      error
    );
  });
  const noFile = fs.mkdtempSync(path.join(os.tmpdir(), "release-test-"));
  t.after(() => fs.rmSync(noFile, { recursive: true, force: true }));
  assert.throws(
    () => setRelease("2.0.0", [], { base: noFile, now: today, bumpVersions }),
    /ENOENT/
  );
  assert.deepStrictEqual(bumped, []);
  assert.strictEqual(
    fs.readFileSync(path.join(base, "CITATION.cff"), "utf8"),
    repeated
  );
});

test("setRelease bumps the versions and sets the citation", (t) => {
  const bumped = [];
  const base = citationFixture(t);
  const date = setRelease("2.0.0-alpha.50", [], {
    base,
    now: today,
    bumpVersions: (version) => bumped.push(version),
  });
  assert.strictEqual(date, "2026-10-30");
  assert.deepStrictEqual(bumped, ["2.0.0-alpha.50"]);
  assert.strictEqual(
    fs.readFileSync(path.join(base, "CITATION.cff"), "utf8"),
    citation("2.0.0-alpha.50", "2026-10-30")
  );
});

// The command line, run on this repository
const run = (...args) =>
  spawnSync(process.execPath, [path.join(__dirname, "release.js"), ...args], {
    encoding: "utf8",
  });

test("the command line prints the released packages", () => {
  const packagesRun = run("packages");
  assert.strictEqual(packagesRun.status, 0);
  const dirs = packagesRun.stdout.trim().split("\n");
  assert.ok(dirs.includes(path.join("packages", "ecc-utils-design")));
  assert.ok(!dirs.includes(path.join("packages", "ecc-client-ga4gh-tes")));
});

// The citation metadata of the repository has the version of the packages
test("the command line checks the versions of this repository", () => {
  const { version } = readJson(path.join(__dirname, "..", "package.json"));
  const checkRun = run("check", version);
  assert.strictEqual(checkRun.status, 0, checkRun.stderr);
  const otherRun = run("check", "999.0.0");
  assert.strictEqual(otherRun.status, 1);
  assert.match(otherRun.stderr, /CITATION\.cff has version .*, not 999\.0\.0/);
});

test("the command line fails on bad versions and commands", () => {
  const badVersion = run("check", "v2.0.0-alpha.49");
  assert.strictEqual(badVersion.status, 1);
  assert.match(badVersion.stderr, /Not a version/);
  const missingVersion = run("pin");
  assert.strictEqual(missingVersion.status, 1);
  assert.match(missingVersion.stderr, /Not a version/);
  const badCommand = run("publish");
  assert.strictEqual(badCommand.status, 2);
  assert.match(badCommand.stderr, /Usage/);
});
