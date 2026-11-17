---
"@elixir-cloud/trs": patch
---

Reset the tool class filter of `ecc-client-ga4gh-trs-tools` when its `provider` or `baseUrl` changes: the first request to the new provider has no tool class filter, the tool class select shows all classes, and it offers no tool classes of the previous provider while those of the new one load.
