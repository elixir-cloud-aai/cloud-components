// Checks the built `@elixir-cloud/design/utils` subpath (run after the
// build): it exports the utilities and loads neither Lit nor any component.
// Lit's Node build installs a `customElements` shim when it loads, so the
// global stays undefined only if nothing imported Lit.

const utils = await import("@elixir-cloud/design/utils");

const expected = [
  "mapFieldErrors",
  "normalizePointer",
  "parseProblemDetails",
  "readProblemDetails",
];
const missing = expected.filter((name) => typeof utils[name] !== "function");
if (missing.length > 0) {
  console.error(`@elixir-cloud/design/utils lacks: ${missing.join(", ")}`);
  process.exit(1);
}
if (globalThis.customElements !== undefined) {
  console.error("@elixir-cloud/design/utils loads Lit or components");
  process.exit(1);
}
console.log("@elixir-cloud/design/utils: ok");
