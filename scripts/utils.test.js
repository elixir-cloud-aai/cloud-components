// Tests for scripts/utils.js; run with `node --test scripts/utils.test.js`

const assert = require("assert");
const { test } = require("node:test");

const { escapeTemplateLiteral } = require("./utils.js");

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
