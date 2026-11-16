---
"@elixir-cloud/cloud-registry": minor
---

Add Cloud Registry verifications: the provider methods `getVerifications()`, `getServiceVerification()`, `verifyService()` and `deleteServiceVerification()`, the helpers `matchesVerification()` and `verifiedServices()` (which compare URL and API type exactly, as the registry stores them), `CloudRegistryError.code`, and the component `ecc-client-elixir-cloud-registry-service-verification`. Its `display` property shows the badge and admin actions together (`all`), only the badge (`badge`) or only the actions (`actions`), so that lists can place them apart.
