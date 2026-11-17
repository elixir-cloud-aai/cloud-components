---
"@elixir-cloud/service-registry": minor
---

Add `ecc-client-ga4gh-service-registry-service-info`, which shows the service info of a registry itself (`GET /service-info`) with loading and error states. Optional fields (`environment`, `description`, `contactUrl`, `documentationUrl`, `createdAt`, `updatedAt`) show only if they are set, links only for web (and, for the contact, `mailto:`) URLs, and timestamps only if they are valid. It fires `ecc-service-info-changed` with the loaded service info, or with `null` when a load fails or the provider is removed.
