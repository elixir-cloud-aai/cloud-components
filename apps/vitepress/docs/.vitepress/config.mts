import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Elixir Cloud Components',
  head: [['link', { rel: 'icon', href: '/elixir-cloud/logo.svg' }]],
  description:
    'A suite of highly reusable Web Components for operationalising ELIXIR and GA4GH Cloud Services.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/elixir-cloud/logo.svg',
    siteTitle: 'Elixir Cloud Components',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/getting-started' },
    ],

    search: {
      provider: 'local',
    },

    outline: 'deep',

    sidebar: [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Installation', link: '/installation' },
          { text: 'Usage', link: '/usage' },
        ],
      },
      {
        text: 'Customize',
        collapsed: true,
        items: [{ text: 'Introduction', link: '/customize/introduction' }],
      },
      {
        text: 'TES',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/tes/introduction' },
          { text: 'Installation', link: '/tes/installation' },
          { text: 'Usage', link: '/tes/usage' },
          {
            text: 'Components',
            items: [
              { text: 'Runs', link: '/tes/components/runs' },
              { text: 'Create Run', link: '/tes/components/create-run' },
            ],
          },
        ],
      },
      {
        text: 'WES',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/wes/introduction' },
          { text: 'Installation', link: '/wes/installation' },
          { text: 'Usage', link: '/wes/usage' },
          {
            text: 'Components',
            items: [
              { text: 'Runs', link: '/wes/components/runs.md' },
              { text: 'Create Run', link: '/wes/components/create-run.md' },
            ],
          },
        ],
      },
      {
        text: 'Design',
        collapsed: true,
        items: [
          { text: 'Introduction', link: '/design/introduction' },
          { text: 'Installation', link: '/design/installation' },
          { text: 'Utilities', link: '/design/utilities' },
          {
            text: 'Components',
            items: [
              {
                text: 'Form',
                link: '/design/components/form',
              },
              {
                text: 'Collection',
                link: '/design/components/collection',
              },
              {
                text: 'Details',
                link: '/design/components/details',
              },
              {
                text: 'Code',
                link: '/design/components/code',
              },
            ],
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/elixir-cloud-aai/cloud-components',
      },
      {
        icon: 'slack',
        link: 'https://elixir-cloud.slack.com',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Elixir',
    },
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPFooter\.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/Footer.vue', import.meta.url)),
        },
      ],
    },
  },
});
