---
"@elixir-cloud/design": patch
---

Fix the ESLint warnings of the design package: type the code editor with Ace's own types (`editor` is now `Ace.Editor | undefined`), type the `ecc-button-clicked` event detail as `{ variant: string }`, as documented, replace non-null assertions in the select, multi-select and collapsible components with explicit checks, and drop a `console.error` from the code editor's language fallback. Linting the package now fails on new warnings.
