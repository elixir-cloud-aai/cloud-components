---
"@elixir-cloud/design": minor
---

Add request deadlines for the REST providers of the client packages to `@elixir-cloud/design/utils`: `fetchWithTimeout()` sends a request with `fetch` and aborts it with a `RequestTimeoutError` once its deadline expires (default `DEFAULT_REQUEST_TIMEOUT`, 30 s; `0` for none), and `resolveRequestTimeout()` reads the deadline of provider options (`RestProviderOptions`, `{ timeout?: number }`).
