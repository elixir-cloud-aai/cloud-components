---
"@elixir-cloud/design": patch
---

Fix the ESLint warnings of the design package. Type the code editor with Ace's own types (`editor` is now `Ace.Editor | undefined`) and the `ecc-button-clicked` event detail as `{ variant: string }`, as documented. Replace non-null assertions in the select and multi-select components with explicit checks (a detached component no longer re-creates its shared state entry) and drop them in the collapsible component. Drop a `console.error` from the code editor's language fallback. Linting the package now fails on new warnings.
