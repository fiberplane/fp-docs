import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://docs.fiberplane.com",
  adapter: cloudflare(),
  integrations: [
    starlight({
      title: "Fiberplane",
      logo: {
        src: "./public/logo.svg",
      },
      components: {
        ThemeSelect: "./src/components/ThemeSelect.astro",
        Head: "./src/components/Head.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/fiberplane",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.com/invite/cqdY6SpfVR",
        },
        {
          icon: "x.com",
          label: "X",
          href: "https://x.com/fiberplane",
        },
      ],
      customCss: ["./src/styles/custom.css"],
      favicon: "/favicon.svg",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon-light.svg",
            media: "(prefers-color-scheme: light)",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon-dark.svg",
            media: "(prefers-color-scheme: dark)",
          },
        },
        // Google Analytics
        {
          tag: "script",
          attrs: {
            src: "https://www.googletagmanager.com/gtag/js?id=G-GEKL1TDFL6",
            async: true,
          },
        },
        {
          tag: "script",
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GEKL1TDFL6');
          `,
        },
      ],
      sidebar: [
        {
          label: "Console",
          collapsed: false,
          items: [
            { label: "Overview", link: "/console" },
            { label: "Getting Started", link: "/console/getting-started" },
            {
              label: "Core Functionality",
              collapsed: false,
              items: [
                {
                  label: "MCP server review",
                  link: "/console/core-functionality/review",
                },
                {
                  label: "MCP server evaluation",
                  link: "console/core-functionality/evals",
                },
              ],
            },
          ],
        },
        {
          label: "MCP Lite",
          collapsed: true,
          items: [
            { label: "Overview", link: "/mcp-lite" },
            { label: "Getting Started", link: "/mcp-lite/getting-started" },
            {
              label: "Core Concepts",
              collapsed: false,
              items: [
                { label: "Tools", link: "/mcp-lite/core-concepts/tools" },
                {
                  label: "Resources",
                  link: "/mcp-lite/core-concepts/resources",
                },
                { label: "Prompts", link: "/mcp-lite/core-concepts/prompts" },
                {
                  label: "Type Safety",
                  link: "/mcp-lite/core-concepts/type-safety",
                },
              ],
            },
            {
              label: "Features",
              collapsed: false,
              items: [
                { label: "Middleware", link: "/mcp-lite/features/middleware" },
                { label: "Sessions", link: "/mcp-lite/features/sessions" },
                { label: "Adapters", link: "/mcp-lite/features/adapters" },
                {
                  label: "Error Handling",
                  link: "/mcp-lite/features/error-handling",
                },
              ],
            },
            {
              label: "Advanced",
              collapsed: true,
              items: [
                {
                  label: "Elicitation",
                  link: "/mcp-lite/advanced/elicitation",
                },
                { label: "Sampling", link: "/mcp-lite/advanced/sampling" },
                {
                  label: "Protocol Versions",
                  link: "/mcp-lite/advanced/protocol-versions",
                },
              ],
            },
            {
              label: "Deployment",
              collapsed: true,
              items: [
                {
                  label: "Runtime Environments",
                  link: "/mcp-lite/deployment/environments",
                },
                {
                  label: "Deployment Patterns",
                  link: "/mcp-lite/deployment/patterns",
                },
              ],
            },
            { label: "Examples", link: "/mcp-lite/examples" },
          ],
        },
        {
          label: "MCP Gateway",
          collapsed: true,
          items: [
            { label: "Overview", link: "/mcp-gateway" },
            { label: "Getting Started", link: "/mcp-gateway/getting-started" },
            {
              label: "Reference",
              collapsed: false,
              items: [
                { label: "CLI", link: "/mcp-gateway/reference#cli" },
                { label: "Storage", link: "/mcp-gateway/reference#storage" },
                {
                  label: "Authentication",
                  link: "/mcp-gateway/reference#authentication",
                },
                { label: "Proxy", link: "/mcp-gateway/reference#proxy" },
                { label: "Storage", link: "/mcp-gateway/reference#storage" },

                { label: "Web UI", link: "/mcp-gateway/reference#web-ui" },
                { label: "REST API", link: "/mcp-gateway/reference#rest-api" },
                {
                  label: "Gateway MCP Server",
                  link: "/mcp-gateway/reference#gateway-mcp-server",
                },
                { label: "Web UI", link: "/mcp-gateway/reference#web-ui" },
              ],
            },
          ],
        },
        {
          label: "Support",
          collapsed: true,
          items: [{ label: "Discord", link: "/support" }],
        },
      ],
    }),
  ],
  vite: {
    ssr: {
      external: ["canvaskit-wasm"],
    },
  },
});
