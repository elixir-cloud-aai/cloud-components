// Endpoints and sample IDs that the live previews of this documentation use.
// The previews send their requests straight from the browser, without
// logging in, so an endpoint must allow anonymous reads and cross-origin
// requests from the site that serves the documentation. Each value can be
// overridden at build time with the variable named next to it (see
// "Live previews" on the page "Contributing"). An empty endpoint means that
// there is no public demo instance: the preview then shows a notice instead.
//
// Next.js inlines `process.env.NEXT_PUBLIC_*` only where it is written out
// in full, so each variable is read on its own.

export const endpoints = {
  // GA4GH Service Registry (read-only previews)
  serviceRegistry:
    process.env.NEXT_PUBLIC_SERVICE_REGISTRY_URL || 'https://elixir-on.cloud/ga4gh/registry/v1',
  // Cloud Registry (form; creating a service needs a login)
  cloudRegistry:
    process.env.NEXT_PUBLIC_CLOUD_REGISTRY_URL || 'https://elixir-on.cloud/ga4gh/registry/v1',
  // GA4GH TRS (read-only previews)
  trs: process.env.NEXT_PUBLIC_TRS_URL || 'https://workflowhub.eu/ga4gh/trs/v2',
  // TRS-Filer (creates tools): no public demo instance
  trsFiler: process.env.NEXT_PUBLIC_TRS_FILER_URL || '',
  // GA4GH WES: no public demo instance
  wes: process.env.NEXT_PUBLIC_WES_URL || '',
};

// IDs of existing objects at the endpoints above, for the previews that show
// a single object
export const sampleIds = {
  service: process.env.NEXT_PUBLIC_SERVICE_ID || 'placeholder-service-id',
  trsTool: process.env.NEXT_PUBLIC_TRS_TOOL_ID || '2',
  wesRun: process.env.NEXT_PUBLIC_WES_RUN_ID || 'placeholder-run-id',
};
