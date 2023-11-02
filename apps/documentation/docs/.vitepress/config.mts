import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Elixir Cloud Components",
  head: [["link", { rel: "icon", href: "/public/logo-elixir-cloud-aai.svg" }]],
  description: "",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/logo-elixir-cloud-aai.svg",
    siteTitle: "Elixir Cloud Components",
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/getting-started" },
    ],

    search: {
      provider: "local",
    },

    sidebar: [
      {
        text: "Introduction",
        collapsed: false,
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "Installation", link: "/installation" },
          { text: "Usage", link: "/usage" },
        ],
      },
      {
        text: "Customize",
        collapsed: true,
        items: [{ text: "Introduction", link: "/customize/introduction" }],
      },
      {
        text: "TES",
        collapsed: true,
        items: [
          { text: "Introduction", link: "/tes/introduction" },
          { text: "Installation", link: "/tes/installation" },
          { text: "Usage", link: "/tes/usage" },
          {
            text: "Components",
            items: [{ text: "Create Run", link: "/tes/components/create-run" }],
          },
        ],
      },
      {
        text: "WES",
        collapsed: true,
        items: [
          { text: "Introduction", link: "/wes/introduction" },
          { text: "Installation", link: "/wes/installation" },
          { text: "Usage", link: "/wes/usage" },
          {
            text: "Components",
            items: [],
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/elixir-cloud-aai/cloud-components",
      },
      {
        icon: "slack",
        link: "https://elixir-cloud.slack.com",
      },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present Elixir",
    },
  },
});
