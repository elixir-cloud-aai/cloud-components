---
"@elixir-cloud/wes": minor
---

Add `ecc-client-ga4gh-wes-run-output`, which shows one output of a workflow run as the viewer hint (`x-ga4gh-ui-widget`) of the workflow's GA4GH IO Schema says (version 0.3.0 of the profile): `table-viewer` outputs as tables with escaped cells and row and column limits (`maxRows`, `maxColumns`), `html-viewer` outputs in an `iframe` with an empty `sandbox` and a Content Security Policy, and all other outputs for download only. Lists of files and files keyed by name get one entry per file, up to `maxFiles`, and viewers read at most `maxBytes` of a file. URIs are checked against an allow-list of schemes (`allowedSchemes`) before anything is fetched or downloaded. Files are fetched and downloaded through the new `WesOutputProvider`, which the app implements.
