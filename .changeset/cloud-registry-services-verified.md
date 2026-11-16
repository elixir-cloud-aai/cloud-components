---
"@elixir-cloud/cloud-registry": minor
---

Add `ecc-client-elixir-cloud-registry-services`: the services list of the service-registry package with a "Verified" badge for verified services next to their version (through the list's `rowBadges` hook). It loads all verifications with one request (`GET /verifications`), and admins can verify services or remove their verification in the actions of each row. The package's TypeScript configuration now resolves package `exports` (`moduleResolution: node16`), so that the types of the service-registry components are found without `paths`.
