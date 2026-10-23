import "ace-builds/src-noconflict/ace.js";

/**
 * Ace editor theme driven by ECC design tokens.
 *
 * Colors and fonts resolve from the component's `--ecc-*` tokens (via the
 * internal variables set in GlobalStyles), so the editor follows custom
 * themes and light/dark mode like every other component, without having to
 * detect the mode in JavaScript.
 */
export const ACE_THEME = "ace/theme/ecc";

const mix = (color: string, amount: number) =>
  `color-mix(in oklch, var(${color}) ${amount}%, var(--foreground))`;

const cssText = `
.ace_editor.ace-ecc {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-family-mono);
}
.ace-ecc .ace_gutter {
  background: var(--muted);
  color: var(--muted-foreground);
}
.ace-ecc .ace_gutter-active-line {
  background-color: var(--accent);
}
.ace-ecc .ace_print-margin {
  width: 1px;
  background: var(--border);
}
.ace-ecc .ace_cursor {
  color: var(--foreground);
}
.ace-ecc .ace_invisible,
.ace-ecc .ace_comment {
  color: var(--muted-foreground);
}
.ace-ecc .ace_comment {
  font-style: italic;
}
.ace-ecc .ace_fold {
  background-color: var(--primary);
}
.ace-ecc .ace_keyword,
.ace-ecc .ace_storage,
.ace-ecc .ace_variable,
.ace-ecc .ace_meta.ace_tag,
.ace-ecc .ace_entity.ace_name.ace_function,
.ace-ecc .ace_heading {
  color: var(--primary);
}
.ace-ecc .ace_keyword.ace_operator,
.ace-ecc .ace_punctuation,
.ace-ecc .ace_paren {
  color: var(--muted-foreground);
}
.ace-ecc .ace_string {
  color: ${mix("--chart-2", 75)};
}
.ace-ecc .ace_constant,
.ace-ecc .ace_support {
  color: ${mix("--chart-1", 75)};
}
.ace-ecc .ace_invalid,
.ace-ecc .ace_string.ace_regex {
  color: var(--destructive);
}
.ace-ecc .ace_marker-layer .ace_selection {
  background: color-mix(in oklch, var(--ring) 35%, transparent);
}
.ace-ecc .ace_marker-layer .ace_active-line {
  background: color-mix(in oklch, var(--accent) 60%, transparent);
}
.ace-ecc .ace_marker-layer .ace_selected-word,
.ace-ecc .ace_marker-layer .ace_bracket {
  border: 1px solid var(--ring);
}
.ace-ecc .ace_indent-guide {
  box-shadow: inset -1px 0 0 var(--border);
}
`;

// globalThis rather than window: this module is also evaluated during SSR
const { ace } = globalThis as any;

ace.define(
  ACE_THEME,
  ["require", "exports", "module", "ace/lib/dom"],
  (require: (id: string) => any, exports: Record<string, unknown>) => {
    /* eslint-disable no-param-reassign */
    exports.isDark = false;
    exports.cssClass = "ace-ecc";
    exports.cssText = cssText;
    /* eslint-enable no-param-reassign */
    require("ace/lib/dom").importCssString(cssText, "ace-ecc");
  }
);
