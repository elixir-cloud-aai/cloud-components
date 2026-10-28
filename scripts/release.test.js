// Tests for scripts/release.js; run with `node --test scripts/release.test.js`

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { test } = require("node:test");

const {
  distTag,
  parseVersion,
  pinInternalDependencies,
  releasedPackages,
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
