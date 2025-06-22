// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withLitSSR = require('@lit-labs/nextjs')();

/** @type {import('next').NextConfig} */
module.exports = withLitSSR({
  ...withNextra(),
  output: 'export',
  images: {
    unoptimized: true,
  },
});
