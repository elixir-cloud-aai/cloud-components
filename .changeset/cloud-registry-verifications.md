---
"@elixir-cloud/cloud-registry": minor
---

Add Cloud Registry verifications: the provider methods `getVerifications()`, `getServiceVerification()`, `verifyService()` and `deleteServiceVerification()`, the helpers `matchesVerification()` and `verifiedServices()` (which compare URL and API type exactly, as the registry stores them), `CloudRegistryError.code`, and two components: `ecc-client-elixir-cloud-registry-service-verification-badge` shows a "Verified" badge for a verification that the app passes, without requests of its own, and `ecc-client-elixir-cloud-registry-service-verification` offers admins "Verify" and "Remove verification", so that lists can place the badge and the actions apart.
