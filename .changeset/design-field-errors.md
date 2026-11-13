---
"@elixir-cloud/design": minor
---

Show field errors returned by APIs: the form controls (input, textarea, checkbox, select, multi-select) get the properties `invalid` and `error` (message under the control, `aria-invalid`, `aria-describedby`, announced with `aria-live`), and new utilities read RFC 9457 problem details (`readProblemDetails()`, `parseProblemDetails()`) and map their field errors to a component's fields (`mapFieldErrors()`).
