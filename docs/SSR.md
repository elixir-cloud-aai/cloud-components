# Server-Side Rendering (SSR) Compatibility Guide

This guide explains how to safely load ELIXIR Cloud Components in projects that use SSR frameworks (e.g. Next.js, Remix).

## Quick Start

All components are **safe to import during SSR** — importing them on the server will not crash. However, Web Components are a **client-side technology**: rendering and hydration occur in the browser via the Custom Elements API.

### Next.js (App Router)

Use dynamic imports with `ssr: false` to load components only on the client:

```tsx
// app/components/MyComponent.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamic import prevents SSR from trying to define custom elements
const EccComponents = dynamic(
  () => import("@elixir-cloud/design").then((mod) => mod),
  { ssr: false }
);

export default function MyComponent() {
  return (
    <div>
      <ecc-utils-design-button>Click me</ecc-utils-design-button>
    </div>
  );
}
```

Alternatively, mark the entire page as a Client Component:

```tsx
// app/page.tsx
"use client";

import "@elixir-cloud/design";

export default function Page() {
  return <ecc-utils-design-button>Click me</ecc-utils-design-button>;
}
```

### Remix

Use `ClientOnly` wrappers or lazy loading:

```tsx
import { ClientOnly } from "remix-utils/client-only";

export default function Page() {
  return (
    <ClientOnly fallback={<p>Loading...</p>}>
      {() => {
        import("@elixir-cloud/design");
        return <ecc-utils-design-button>Click me</ecc-utils-design-button>;
      }}
    </ClientOnly>
  );
}
```

---

## How SSR Safety Works

### Environment Guards

Every `customElements.define()` call is wrapped in an environment check:

```ts
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("tag-name")
) {
  window.customElements.define("tag-name", ComponentClass);
}
```

This prevents:
- **Server crashes** — `customElements` doesn't exist in Node.js
- **Duplicate registrations** — safe for HMR and multiple imports

### Deterministic IDs

Components that need unique IDs (e.g., `<ecc-utils-design-select>`) use a monotonic counter instead of `Math.random()`. This avoids mismatches if the same module is loaded on both server and client.

### Browser-Only Lifecycle

All DOM access (`document`, `MutationObserver`, `window.setInterval`) is deferred to client-only Lit lifecycle hooks:

| API | Used In | Lifecycle Hook |
|-----|---------|----------------|
| `document.addEventListener` | Select, MultiSelect | `connectedCallback()` |
| `MutationObserver` | Code editor | `firstUpdated()` |
| `document.documentElement` | Code editor | `isDarkMode()` (guarded) |
| `window.setInterval` | Select, Collapsible sub-components | `connectedCallback()` |
| `ace.edit()` | Code editor | `firstUpdated()` |

These hooks only execute in the browser, so importing during SSR never triggers them.

---

## SSR Utility API

The `@elixir-cloud/design` package exports SSR helpers:

```ts
import {
  isBrowser,
  isServer,
  ssrSafeDefine,
  generateDeterministicId,
  resetIdCounter,
} from "@elixir-cloud/design";
```

| Function | Description |
|----------|-------------|
| `isBrowser()` | Returns `true` in browser environments |
| `isServer()` | Returns `true` in Node.js / SSR |
| `ssrSafeDefine(tag, ctor)` | Safely registers a custom element |
| `generateDeterministicId(prefix)` | Counter-based ID generation |
| `resetIdCounter()` | Resets the ID counter (for testing) |

---

## Declarative Shadow DOM (DSD)

Lit has experimental support for Declarative Shadow DOM via `@lit-labs/ssr`. DSD allows a server response to include shadow roots as HTML so the browser can display styled content before JavaScript loads:

```html
<ecc-utils-design-button>
  <template shadowrootmode="open">
    <style>/* component styles */</style>
    <button><slot></slot></button>
  </template>
  Click me
</ecc-utils-design-button>
```

### Current Status

- **DSD-based server rendering is not yet implemented** in this library
- Components are safe to **import** on the server (no crashes)
- Rendering and hydration happen on the client via dynamic imports
- Future: integrate `@lit-labs/ssr` for server-side template rendering

> **Note:** DSD requires browser support (`template[shadowrootmode]`). Chrome, Edge, and Firefox 123+ support it natively. Safari 16.4+ supports the older `shadowroot` attribute.

---

## Constraints & Best Practices

1. **Always use `"use client"` or dynamic imports** — Web Components need the browser DOM to render
2. **Don't access `this.shadowRoot` in constructors** — defer to `connectedCallback()` or `firstUpdated()`
3. **Avoid `Math.random()` in component state** — use `generateDeterministicId()` instead
4. **Don't rely on `window` or `document` at module scope** — gate behind `isBrowser()`
5. **Test SSR compatibility** — run `node -e "import('@elixir-cloud/design')"` to verify no crashes

---

## Troubleshooting

### `ReferenceError: customElements is not defined`
You're importing a component at the module level on the server. Use dynamic imports or `"use client"`.

### Hydration mismatch warnings
Check for `Math.random()` or `Date.now()` in component state. Use deterministic values instead.

### Flash of Unstyled Content (FOUC)
Add CSS to hide undefined custom elements until they upgrade:

```css
:not(:defined) {
  visibility: hidden;
}
```

<!-- TODO: Integrate @lit-labs/ssr for full server-side shadow DOM rendering -->
<!-- TODO: Add Declarative Shadow DOM template generation -->
<!-- TODO: Add framework-specific wrapper packages (React, Vue, Angular) -->
