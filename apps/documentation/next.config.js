// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withLitSSR = require('@lit-labs/nextjs')();

// Read the Docs serves each version under a subpath (e.g. /en/latest/ or
// /en/<pr-number>/), given by READTHEDOCS_CANONICAL_URL at build time.
// Outside Read the Docs, the variable is unset and nothing changes.
const rtdBasePath = process.env.READTHEDOCS_CANONICAL_URL
  ? new URL(process.env.READTHEDOCS_CANONICAL_URL).pathname.replace(/\/$/, '')
  : '';
const rtdConfig = process.env.READTHEDOCS_CANONICAL_URL
  ? {
      basePath: rtdBasePath,
      trailingSlash: true,
      env: { NEXT_PUBLIC_BASE_PATH: rtdBasePath },
    }
  : {};

/** @type {import('next').NextConfig} */
module.exports = withLitSSR({
  ...withNextra(),
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...rtdConfig,
});
