// Tests for scripts/release.js; run with `node --test scripts/release.test.js`

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
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
const fixture = (version = "2.0.0-alpha.49") => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "release-test-"));
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

test("distTag uses latest for releases and the prerelease identifier", () => {
  assert.strictEqual(distTag("2.0.0"), "latest");
  assert.strictEqual(distTag("2.0.0-alpha.49"), "alpha");
  assert.strictEqual(distTag("2.1.0-rc.1"), "rc");
  assert.strictEqual(distTag("2.1.0-1"), "next");
  assert.strictEqual(distTag("2.1.0-latest.1"), "next");
});

test("releasedPackages lists public packages, sorted by directory", () => {
  const base = fixture();
  assert.deepStrictEqual(
    releasedPackages(base).map(({ dir }) => dir),
    [path.join("packages", "a-wes"), path.join("packages", "b-design")]
  );
});

test("versionMismatches is empty when all versions match", () => {
  assert.deepStrictEqual(versionMismatches("2.0.0-alpha.49", fixture()), []);
});

test("versionMismatches names the root and packages with other versions", () => {
  const base = fixture();
  const design = path.join(base, "packages", "b-design", "package.json");
  writeJson(design, { ...readJson(design), version: "2.0.0-alpha.48" });
  assert.deepStrictEqual(versionMismatches("2.0.0-alpha.49", base), [
    `@elixir-cloud/design (${path.join(
      "packages",
      "b-design"
    )}) has version 2.0.0-alpha.48, not 2.0.0-alpha.49`,
  ]);
  assert.strictEqual(versionMismatches("2.0.0-alpha.50", base).length, 3);
  assert.throws(
    () => versionMismatches("v2.0.0-alpha.49", base),
    /Not a version/
  );
});

test("pinInternalDependencies pins dependencies on released packages only", () => {
  const base = fixture();
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
