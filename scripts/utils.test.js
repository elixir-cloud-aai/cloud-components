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

// A source directory with the given (empty) files, paths relative to it
function makeSourceDir(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "build-entries-"));
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

test("build entries: root, components, providers, react and utils", () => {
  const dir = makeSourceDir([
    "index.ts",
    "components/input/index.ts",
    "components/input/input.ts",
    "components/input/input.test.ts",
    "components/input/tests/helper.ts",
    "providers/api.ts",
    "providers/tests/mock.ts",
    "react/input.ts",
    "utils/index.ts",
    "utils/problem-details.ts",
    "utils/problem-details.test.ts",
  ]);
  try {
    assert.deepStrictEqual(relativeEntries(dir), [
      "components/input/index.ts",
      "components/input/input.ts",
      "index.ts",
      "providers/api.ts",
      "react/input.ts",
      "utils/index.ts",
    ]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("build entries: no utils entry without utils/index.ts", () => {
  const dir = makeSourceDir(["index.ts", "components/a/index.ts"]);
  try {
    assert.deepStrictEqual(relativeEntries(dir), [
      "components/a/index.ts",
      "index.ts",
    ]);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Apps import the utilities from `@elixir-cloud/design/utils` without
// registering the components
test("design package exports ./utils", () => {
  const packageJson = path.join(
    __dirname,
    "..",
    "packages",
    "ecc-utils-design",
    "package.json"
  );
  const { exports } = JSON.parse(fs.readFileSync(packageJson, "utf-8"));
  assert.deepStrictEqual(exports["./utils"], {
    types: "./dist/utils/index.d.ts",
    import: "./dist/utils/index.js",
  });
});
