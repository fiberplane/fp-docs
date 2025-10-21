---
title: Resources
description: Expose URI-identified content through your MCP server
---

Resources are URI-identified content that clients can request. They can be static or templated with variable substitution.

## Static Resource

Serve fixed content for a specific URI.

```typescript
server.resource(
  "file://config.json",
  {
    name: "App Configuration",
    description: "Application configuration file",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      type: "text",
      text: JSON.stringify({ name: "my-app" }),
      mimeType: "application/json",
    }],
  })
);
```

## Templated Resource

Bind template variables from the URI before returning content.

```typescript
server.resource(
  "github://repos/{owner}/{repo}",
  { description: "GitHub repository" },
  async (uri, { owner, repo }) => ({
    contents: [{
      uri: uri.href,
      type: "text",
      text: `Repository: ${owner}/${repo}`,
    }],
  })
);
```

## Resource with Metadata

Include `_meta` in the resource metadata to pass custom information through `resources/list`, `resources/templates/list`, and `resources/read` responses.

```typescript
server.resource(
  "db://records/{id}",
  {
    name: "Database Record",
    description: "Fetch a record from the database",
    mimeType: "application/json",
    _meta: {
      cacheTtl: 300,
      accessLevel: "read-only",
      region: "us-west-2",
    },
  },
  async (uri, { id }) => ({
    contents: [{
      uri: uri.href,
      type: "text",
      text: JSON.stringify({ id, data: "..." }),
      _meta: {
        contentVersion: "2.0",
        lastModified: "2025-01-01",
      },
    }],
    _meta: {
      totalSize: 1024,
      cached: true,
    },
  })
);
```

The `_meta` from the resource definition appears in list responses. Handlers can also return `_meta` on the result and individual contents for per-read metadata.

## Next Steps

- [**Prompts**](/mcp-lite/core-concepts/prompts) - Generate LLM conversation prompts
- [**Tools**](/mcp-lite/core-concepts/tools) - Define callable functions
