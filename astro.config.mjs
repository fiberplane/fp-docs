// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Fiberplane",
      logo: {
        src: './public/logo.svg',
      },
      customCss: ['./src/styles/custom.css'],
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon-light.svg',
            media: '(prefers-color-scheme: light)',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon-dark.svg',
            media: '(prefers-color-scheme: dark)',
          },
        },
      ],
      sidebar: [
        {
          label: 'MCP Lite',
          collapsed: false,
          items: [
            { label: 'Overview', link: '/mcp-lite/' },
            { label: 'Getting Started', link: '/mcp-lite/getting-started' },
            {
              label: 'Core Concepts',
              collapsed: false,
              items: [
                { label: 'Tools', link: '/mcp-lite/core-concepts/tools' },
                { label: 'Resources', link: '/mcp-lite/core-concepts/resources' },
                { label: 'Prompts', link: '/mcp-lite/core-concepts/prompts' },
                { label: 'Type Safety', link: '/mcp-lite/core-concepts/type-safety' },
              ]
            },
            {
              label: 'Features',
              collapsed: false,
              items: [
                { label: 'Middleware', link: '/mcp-lite/features/middleware' },
                { label: 'Sessions', link: '/mcp-lite/features/sessions' },
                { label: 'Adapters', link: '/mcp-lite/features/adapters' },
                { label: 'Error Handling', link: '/mcp-lite/features/error-handling' },
              ]
            },
            {
              label: 'Advanced',
              collapsed: true,
              items: [
                { label: 'Elicitation', link: '/mcp-lite/advanced/elicitation' },
                { label: 'Sampling', link: '/mcp-lite/advanced/sampling' },
                { label: 'Protocol Versions', link: '/mcp-lite/advanced/protocol-versions' },
              ]
            },
            {
              label: 'Deployment',
              collapsed: true,
              items: [
                { label: 'Runtime Environments', link: '/mcp-lite/deployment/environments' },
                { label: 'Deployment Patterns', link: '/mcp-lite/deployment/patterns' },
              ]
            },
            { label: 'Examples', link: '/mcp-lite/examples' }
          ]
        },
        {
          label: 'MCP Gateway',
          collapsed: true,
          items: [
            { label: 'Overview', link: '/mcp-gateway/' },
            { label: 'Getting Started', link: '/mcp-gateway/getting-started' },
            {
              label: 'Core Concepts',
              collapsed: false,
              items: [
                { label: 'Server Management', link: '/mcp-gateway/core-concepts/server-management' },
                { label: 'Activity Logging', link: '/mcp-gateway/core-concepts/activity-logging' },
                { label: 'Interfaces', link: '/mcp-gateway/core-concepts/interfaces' },
              ]
            },
            {
              label: 'Features',
              collapsed: false,
              items: [
                { label: 'CLI Options', link: '/mcp-gateway/features/cli-options' },
                { label: 'Terminal UI', link: '/mcp-gateway/features/terminal-ui' },
                { label: 'Web Interface', link: '/mcp-gateway/features/web-interface' },
                { label: 'Storage & Registry', link: '/mcp-gateway/features/storage' },
              ]
            },
            { label: 'Troubleshooting', link: '/mcp-gateway/troubleshooting' }
          ]
        }
      ],
    }),
  ],
});
