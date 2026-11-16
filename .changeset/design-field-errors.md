---
"@elixir-cloud/design": minor
---

Show field errors returned by APIs.

- Input, textarea, select and multi-select get the properties `invalid` and `error`: `error` shows a message under the control (`aria-invalid`, `aria-describedby`, announced with `aria-live`), `invalid` marks the control as invalid without a message.
- The checkbox gets `invalid` only; show its message elsewhere.
- New utilities read RFC 9457 problem details (`readProblemDetails()`, `parseProblemDetails()`) and map their field errors to a component's fields (`mapFieldErrors()`). Import them from the new subpath `@elixir-cloud/design/utils`, which registers no components; the package root exports them too.
