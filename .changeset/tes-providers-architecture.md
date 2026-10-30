---
"@elixir-cloud/tes": major
---

 Migrate to the providers architecture: `TesProvider`/`RestTesProvider`, typed events, Tailwind-based components built on design primitives, new `ecc-client-ga4gh-tes-run` component, and `baseUrl`/`provider` properties (replaces `baseURL`). Breaking change: rename `ecc-client-ga4gh-tes-create-run` to `ecc-client-ga4gh-tes-run-create` and replace imports from `@elixir-cloud/tes/dist/components/create-run/index.js` with `@elixir-cloud/tes/components/run-create/index.js`.