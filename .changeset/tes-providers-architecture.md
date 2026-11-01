---
"@elixir-cloud/tes": major
---

This release migrates the TES components to the providers architecture, using `TesProvider` and `RestTesProvider`. It also introduces typed events, Tailwind-based styling built on design primitives, and the new `<ecc-client-ga4gh-tes-run>` component.

### Breaking changes

- Rename `<ecc-client-ga4gh-tes-create-run>` to `<ecc-client-ga4gh-tes-run-create>`.
- Replace the `baseURL` property with `baseUrl`.
- Update imports from `@elixir-cloud/tes/dist/components/create-run/index.js` to `@elixir-cloud/tes/components/run-create/index.js`.

### New APIs

- Components accept a custom `provider` implementing `TesProvider`.
- When both are provided, `provider` takes precedence over `baseUrl`.
- Components emit typed events for submission, failure, reset, and task updates.