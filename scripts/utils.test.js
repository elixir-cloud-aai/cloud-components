// Tests for scripts/utils.js; run with `node --test scripts/utils.test.js`

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { test } = require("node:test");

const { escapeTemplateLiteral, getBuildEntries } = require("./utils.js");

// What a template literal with the escaped text in it evaluates to
const evaluate = (escaped) =>
  // eslint-disable-next-line no-new-func
  new Function(`return \`${escaped}\`;`)();

test("escaped text survives a template literal unchanged", () => {
  [
    "",
    ".a { color: red; }",
    '.a::before { content: "\\201C"; }',
    ".a { content: '`'; }",
    ".a { content: '\\`'; }",
    ".a { content: '${b}'; }",
    ".a { content: '\\${b}'; }",
    ".a { content: '$'; } .b { content: '{'; }",
    "\\\\",
    "`${`\\",
  ].forEach((text) =>
    assert.strictEqual(evaluate(escapeTemplateLiteral(text)), text)
  );
});

test("backslashes are escaped before backticks", () => {
  assert.strictEqual(escapeTemplateLiteral("`"), "\\`");
  assert.strictEqual(escapeTemplateLiteral("\\"), "\\\\");
  assert.strictEqual(escapeTemplateLiteral("\\`"), "\\\\\\`");
});

// A source directory with the given (empty) files, paths relative to it,
// removed after the test
function makeSourceDir(t, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-entries-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  files.forEach((file) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), "");
  });
  return dir;
}

// The build entries of a source directory, relative to it and sorted
function relativeEntries(dir) {
  return getBuildEntries(dir)
    .map((entry) => path.relative(dir, entry).split(path.sep).join("/"))
    .sort();
}

test("build entries: root, components, events, providers, react and utils", (t) => {
  const dir = makeSourceDir(t, [
    "index.ts",
    "components/input/index.ts",
    "components/input/input.ts",
    "components/input/input.test.ts",
    "components/input/tests/helper.ts",
    "events/index.ts",
    "events/created.ts",
    "events/tests/helper.ts",
    "providers/api.ts",
    "providers/tests/mock.ts",
    "react/input.ts",
    "utils/index.ts",
    "utils/problem-details.ts",
    "utils/problem-details.test.ts",
  ]);
  assert.deepStrictEqual(relativeEntries(dir), [
    "components/input/index.ts",
    "components/input/input.ts",
    "events/created.ts",
    "events/index.ts",
    "index.ts",
    "providers/api.ts",
    "react/input.ts",
    "utils/index.ts",
  ]);
});

test("build entries: no utils entry without utils/index.ts", (t) => {
  const dir = makeSourceDir(t, ["index.ts", "components/a/index.ts"]);
  assert.deepStrictEqual(relativeEntries(dir), [
    "components/a/index.ts",
    "index.ts",
  ]);
});

// Apps import the utilities from `@elixir-cloud/design/utils` without
// registering the components; CI checks the built subpath after the build
// (`scripts/check-design-utils.mjs`)
test("design package builds and exports ./utils", () => {
  const packageDir = path.join(__dirname, "..", "packages", "ecc-utils-design");
  assert.ok(
    relativeEntries(path.join(packageDir, "src")).includes("utils/index.ts")
  );
  const { exports, typesVersions } = JSON.parse(
    fs.readFileSync(path.join(packageDir, "package.json"), "utf-8")
  );
  assert.deepStrictEqual(exports["./utils"], {
    types: "./dist/utils/index.d.ts",
    import: "./dist/utils/index.js",
  });
  // For TypeScript's `node` module resolution, which ignores `exports`
  assert.deepStrictEqual(typesVersions["*"].utils, ["./dist/utils/index.d.ts"]);
});
