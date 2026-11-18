---
"@elixir-cloud/drs-filer": minor
---

Time out the requests of `RestDrsFilerProvider`: each request rejects with a `RequestTimeoutError` (of `@elixir-cloud/design/utils`) once its deadline expires, 30 s by default, so that the components show an error instead of loading forever when a server never answers. Set the deadline with the new constructor option `timeout` (milliseconds, `0` for none): `new RestDrsFilerProvider(baseUrl, { timeout: 10_000 })`. Subclasses that override `fetch()` and call `super.fetch()` keep it.
