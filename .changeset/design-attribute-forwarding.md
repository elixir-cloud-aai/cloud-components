---
"@elixir-cloud/design": patch
---

Forward ARIA and allowlisted native attributes from input and textarea hosts to their inner controls. Combine consumer descriptions with built-in error references, and treat component and host invalid states additively. Resolve supported ARIA references across shadow roots, preserve component ARIA defaults when host overrides are removed, and clear removed references. Keep collapsible triggers' aria-expanded state synchronized and document attribute forwarding and browser fallback limitations.