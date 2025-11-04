---
title: Type Safety
description: Automatic type inference and runtime validation with Standard Schema
---

`mcp-lite` provides automatic type inference when you use Standard Schema validators like Zod, Valibot, Effect Schema, or ArkType.

## Automatic Type Inference

Standard Schema validators provide automatic type inference for tool handlers:

```typescript
import { z } from "zod";

const SearchSchema = z.object({
  query: z.string(),
  limit: z.number().optional(),
  filters: z.array(z.string()).optional()
});

server.tool("search", {
  inputSchema: SearchSchema,
  handler: (args) => {
    // args is automatically typed as:
    // { query: string, limit?: number, filters?: string[] }

    args.query.toLowerCase()
    args.limit ?? 10
    args.filters?.map(f => f.trim())

    return { content: [{ type: "text", text: "..." }] }
  }
})
```

## Structured Outputs with Validation

Tools can return both human-readable content and machine-readable structured data. Use `outputSchema` to define the shape and get runtime validation:

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

See the [MCP structured content spec](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#structured-content) for protocol details.

## Supported Validators

`mcp-lite` works with any Standard Schema validator:

### Zod

```typescript
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number().optional()
});
```

### Valibot

```typescript
import * as v from "valibot";

const schema = v.object({
  name: v.string(),
  age: v.optional(v.number())
});
```

### Effect Schema

```typescript
import * as S from "@effect/schema/Schema";

const schema = S.struct({
  name: S.string,
  age: S.optional(S.number)
});
```

### ArkType

```typescript
import { type } from "arktype";

const schema = type({
  name: "string",
  "age?": "number"
});
```

## Context Validation

The handler context provides a `validate()` helper for validating data at runtime:

```typescript
handler: (args, ctx) => {
  const validated = ctx.validate(MySchema, someData);
  // validated is now typed according to MySchema
}
```

## Examples

Check out the examples directory for complete implementations:

- `examples/validation-zod` - Validation with Zod
- `examples/validation-valibot` - Validation using Valibot
- `examples/validation-effectschema` - Validation with Effect Schema
- `examples/validation-arktype` - Standard Schema via ArkType

## Next Steps

- [**Tools**](/mcp-lite/core-concepts/tools) - Learn about tool patterns
- [**Error Handling**](/mcp-lite/features/error-handling) - Handle validation errors
