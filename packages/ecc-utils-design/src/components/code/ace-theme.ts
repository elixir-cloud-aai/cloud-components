import "ace-builds/src-noconflict/ace.js";

/**
 * Ace editor theme driven by ECC design tokens.
 *
 * Colors and fonts use the internal variables (`--background`, `--muted`,
 * ...) that GlobalStyles derives from `--ecc-*` tokens, so the editor
 * follows custom themes and light/dark mode like every other component,
 * without having to detect the mode in JavaScript.
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

// Fold arrows as masks filled with a token color: Ace's own arrow images
// only switch for its ace_dark class, which a token-driven theme cannot set.
const chevron = (path: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="${path}" fill="none" stroke="black" stroke-width="1.5"/></svg>`
  )}")`;
const FOLD_OPEN = chevron("M2 3.5l3 3 3-3");
const FOLD_CLOSED = chevron("M3.5 2l3 3-3 3");

const cssText = `
.ace-ecc .ace_fold-widget {
  background-image: none;
  background-color: var(--muted-foreground);
  -webkit-mask: ${FOLD_OPEN} center / 10px no-repeat;
  mask: ${FOLD_OPEN} center / 10px no-repeat;
}
.ace-ecc .ace_fold-widget.ace_invalid {
  background-color: var(--destructive);
}
.ace-ecc .ace_fold-widget.ace_closed {
  -webkit-mask-image: ${FOLD_CLOSED};
  mask-image: ${FOLD_CLOSED};
}
.ace-ecc .ace_fold-widget:hover {
  background-color: var(--foreground);
  border-color: transparent;
  box-shadow: none;
}
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

// globalThis rather than window: this module is also evaluated during SSR,
// where Ace may not have registered itself; skip the theme there (in a
// browser, a missing Ace still fails in initializeAceEditor)
const { ace } = globalThis as any;

if (typeof ace?.define === "function") {
  ace.define(
    ACE_THEME,
    ["require", "exports", "module", "ace/lib/dom"],
    (require: (id: string) => any, exports: Record<string, unknown>) => {
      /* eslint-disable no-param-reassign */
      // Always false: colors come from tokens, so Ace's ace_dark artwork is
      // never needed (fold arrows are token-colored masks above).
      exports.isDark = false;
      exports.cssClass = "ace-ecc";
      exports.cssText = cssText;
      /* eslint-enable no-param-reassign */
      require("ace/lib/dom").importCssString(cssText, "ace-ecc");
    }
  );
}
