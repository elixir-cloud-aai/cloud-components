import "ace-builds/src-noconflict/ace.js";

/**
 * Ace editor theme driven by ECC design tokens.
 *
 * Colors and fonts use the internal variables (`--background`, `--muted`,
 * ...) that GlobalStyles derives from `--ecc-*` tokens, so the editor follows custom
 * themes and light/dark mode like every other component, without having to
 * detect the mode in JavaScript.
 */
export const ACE_THEME = "ace/theme/ecc";

// Share of the token color when blending syntax colors toward the text
// color; keeps chart colors legible on both light and dark backgrounds.
const SYNTAX_COLOR_SHARE = 75;

const mixWithForeground = (color: string) =>
  `color-mix(in oklch, var(${color}) ${SYNTAX_COLOR_SHARE}%, var(--foreground))`;

// Neutral highlight that works on any background color.
const tintForeground = (amount: number) =>
  `color-mix(in oklch, var(--foreground) ${amount}%, transparent)`;

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
  background-color: ${tintForeground(10)};
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
  color: ${mixWithForeground("--chart-2")};
}
.ace-ecc .ace_constant,
.ace-ecc .ace_support {
  color: ${mixWithForeground("--chart-1")};
}
.ace-ecc .ace_invalid,
.ace-ecc .ace_string.ace_regex {
  color: var(--destructive);
}
.ace-ecc .ace_marker-layer .ace_selection {
  background: color-mix(in oklch, var(--ring) 35%, transparent);
}
.ace-ecc .ace_marker-layer .ace_active-line {
  background: ${tintForeground(5)};
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
    // Static flag; the theme is light or dark depending on tokens. It only
    // adds Ace's ace_dark class, used by widgets (search box, autocomplete)
    // that ECC does not enable.
    exports.isDark = false;
    exports.cssClass = "ace-ecc";
    exports.cssText = cssText;
    /* eslint-enable no-param-reassign */
    require("ace/lib/dom").importCssString(cssText, "ace-ecc");
  }
);
