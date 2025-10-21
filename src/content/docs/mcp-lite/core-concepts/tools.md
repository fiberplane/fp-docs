---
title: Tools
description: Define callable functions in your MCP server
---

Tools expose callable functionality to MCP clients. Each tool can have input validation, output validation, and custom metadata.

## Basic Tool with JSON Schema

Define a tool using plain JSON Schema input and output definitions.

```typescript
server.tool("add", {
  description: "Adds two numbers",
  inputSchema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
    },
    required: ["a", "b"],
  },
  outputSchema: {
    type: "object",
    properties: {
      result: { type: "number" },
    },
    required: ["result"],
  },
  handler: (args: { a: number; b: number }) => ({
    content: [{ type: "text", text: String(args.a + args.b) }],
    structuredContent: { result: args.a + args.b },
  }),
});
```

## Tool with Standard Schema (Zod)

Use a Standard Schema validator (Zod here) to infer handler types automatically.

```typescript
import { z } from "zod";

const AddInputSchema = z.object({
  a: z.number(),
  b: z.number(),
});

const AddOutputSchema = z.object({
  result: z.number(),
});

server.tool("add", {
  description: "Adds two numbers with structured output",
  inputSchema: AddInputSchema,
  outputSchema: AddOutputSchema,
  handler: (args) => ({
    // args is automatically typed as { a: number; b: number }
    content: [{ type: "text", text: String(args.a + args.b) }],
    structuredContent: { result: args.a + args.b },
  }),
});
```

## Tool without Schema

Skip validation entirely for endpoints that return static information.

```typescript
server.tool("status", {
  description: "Returns server status",
  handler: () => ({
    content: [{ type: "text", text: "Server is running" }],
  }),
});
```

## Structured Outputs

Tools can return both human-readable content and machine-readable structured data. Use `outputSchema` to define the shape of `structuredContent`:

See the [MCP structured content spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#structured-content) for protocol details.

```typescript
const WeatherOutputSchema = z.object({
  temperature: z.number(),
  conditions: z.string(),
});

server.tool("getWeather", {
  inputSchema: z.object({ location: z.string() }),
  outputSchema: WeatherOutputSchema,
  handler: (args) => ({
    content: [{
      type: "text",
      text: `Weather in ${args.location}: 22°C, sunny`
    }],
    // structuredContent is typed and validated at runtime
    structuredContent: {
      temperature: 22,
      conditions: "sunny",
    }
  })
})
```

The `outputSchema` provides runtime validation and type inference for `structuredContent`.

## Tool with Metadata

Add `title` and `_meta` fields to pass arbitrary metadata through `tools/list` and `tools/call` responses.

```typescript
server.tool("experimental-feature", {
  description: "An experimental feature",
  title: "Experimental Feature",
  _meta: {
    version: "0.1.0",
    stability: "experimental",
    tags: ["beta", "preview"],
  },
  inputSchema: z.object({ input: z.string() }),
  handler: (args) => ({
    content: [{ type: "text", text: `Processing: ${args.input}` }],
    _meta: {
      executionTime: 123,
      cached: false,
    },
  }),
});
```

The `_meta` and `title` from the definition appear in `tools/list` responses. Tool handlers can also return `_meta` in the result for per-call metadata like execution time or cache status.

## Context API

The handler context provides typed access to session data, authentication, and client capabilities:

```typescript
handler: (args, ctx) => {
  // Report progress
  ctx.progress?.({ progress: 50, total: 100 })

  // Access session
  ctx.session?.id

  // Access auth info
  ctx.authInfo?.userId

  // Store custom state
  ctx.state.myCustomData = "..."

  // Validate data
  const validated = ctx.validate(MySchema, data)

  // Check client capabilities and use elicitation
  if (ctx.client.supports("elicitation")) {
    const result = await ctx.elicit({
      message: "Confirm action?",
      schema: z.object({ confirmed: z.boolean() })
    })
  }
}
```

## Next Steps

- [**Type Safety**](/mcp-lite/core-concepts/type-safety) - Learn about automatic type inference
- [**Resources**](/mcp-lite/core-concepts/resources) - Expose data through resources
- [**Error Handling**](/mcp-lite/features/error-handling) - Handle errors gracefully
