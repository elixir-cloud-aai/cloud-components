---
"@elixir-cloud/service-registry": patch
"@elixir-cloud/trs": patch
"@elixir-cloud/trs-filer": patch
"@elixir-cloud/drs": patch
---

Load data from a `provider` that is set or replaced after the first update (e.g. by React on a server-rendered element) in `ecc-client-ga4gh-service-registry-services`, `ecc-client-ga4gh-service-registry-service`, `ecc-client-ga4gh-trs-tools`, `ecc-client-elixir-trs-tool-create` and `ecc-client-ga4gh-drs-objects`. A custom provider takes precedence over `baseUrl`, loads from a replaced provider are dropped, and lists start on their first page after a switch. When a load fails, the components clear their data and fire their `ecc-*-changed` event with empty data. The tool form offers no tool classes of a replaced provider and keeps submit disabled until the selected tool class is among those of the new provider.
