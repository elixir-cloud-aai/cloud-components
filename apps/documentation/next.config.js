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
const rtdUrl = process.env.READTHEDOCS_CANONICAL_URL;
const basePath = rtdUrl ? new URL(rtdUrl).pathname.replace(/\/$/, '') : '';
const rtdConfig = rtdUrl ? { basePath, trailingSlash: true } : {};

/** @type {import('next').NextConfig} */
module.exports = withLitSSR({
  ...withNextra(),
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Always set, so that a stray NEXT_PUBLIC_BASE_PATH in the environment
  // can't prefix assets without a matching basePath.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...rtdConfig,
});
