---
"@elixir-cloud/cloud-registry": minor
---

Show the registry's field errors at the fields of `ecc-client-elixir-cloud-registry-service-create`. When Cloud Registry (1.0.0rc2 and later) rejects a registration with field errors in its problem details (`errors` with `pointer` or `parameter`), the form shows each message under its field, using the field errors of `@elixir-cloud/design`; a field's error is cleared when the field changes, and all are cleared on reset and on the next submit. `ecc-service-create-failed` gets `fieldErrors` (a message per field, by the field's path in the request body, e.g. `organization.url`) and `generalError` (the message for the app to show: `error` if there are no field errors, else the errors that match no field, or `undefined`). `error` is unchanged.
