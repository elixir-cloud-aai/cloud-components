---
"@elixir-cloud/service-registry": minor
---

Add `ecc-client-ga4gh-service-registry-service-types`, which lists the service types of a registry (`GET /services/types`) with their group, artifact and version, and shows loading, empty and error states (also for a response that is not a list). It fires `ecc-service-types-changed` with the loaded types, or with none when a load fails or the provider is removed.
