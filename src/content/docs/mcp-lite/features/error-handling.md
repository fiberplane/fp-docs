---
title: Error Handling
description: Handle errors gracefully with RpcError and custom error handlers
---

`mcp-lite` provides structured error handling through `RpcError` and customizable error handlers.

## Using RpcError

Throw `RpcError` to return structured JSON-RPC failures:

```typescript
import { RpcError, JSON_RPC_ERROR_CODES } from "mcp-lite";

server.tool("divide", {
  inputSchema: z.object({ a: z.number(), b: z.number() }),
  handler: (args) => {
    if (args.b === 0) {
      throw new RpcError(
        JSON_RPC_ERROR_CODES.INVALID_PARAMS,
        "Division by zero"
      );
    }
    return {
      content: [{ type: "text", text: String(args.a / args.b) }]
    };
  }
});
```

## Standard Error Codes

`mcp-lite` exports standard JSON-RPC error codes:

```typescript
JSON_RPC_ERROR_CODES.PARSE_ERROR          // -32700
JSON_RPC_ERROR_CODES.INVALID_REQUEST      // -32600
JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND     // -32601
JSON_RPC_ERROR_CODES.INVALID_PARAMS       // -32602
JSON_RPC_ERROR_CODES.INTERNAL_ERROR       // -32603
```

## Custom Error Handler

Customize `onError` for fallback logic:

```typescript
server.onError((error, ctx) => {
  if (error instanceof MyCustomError) {
    return {
      code: -32001,
      message: "Custom error",
      data: { requestId: ctx.requestId }
    };
  }

  // Log for monitoring
  console.error("Unhandled error:", error);

  // Return undefined for default handling
  return undefined;
});
```

## Validation Errors

Schema validation errors are automatically caught and returned as `INVALID_PARAMS` errors:

```typescript
server.tool("create", {
  inputSchema: z.object({
    email: z.string().email(),
    age: z.number().min(18)
  }),
  handler: (args) => {
    // If validation fails, an RpcError is thrown automatically
    // with details about which fields failed
    return { content: [{ type: "text", text: "Created" }] };
  }
});
```

## Middleware Error Handling

Catch errors in middleware before they reach handlers:

```typescript
server.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw new RpcError(
        JSON_RPC_ERROR_CODES.INVALID_REQUEST,
        "Authentication failed"
      );
    }
    throw error; // Re-throw other errors
  }
});
```

## Next Steps

- [**Middleware**](/mcp-lite/features/middleware) - Add request processing
- [**Type Safety**](/mcp-lite/core-concepts/type-safety) - Prevent errors with validation
