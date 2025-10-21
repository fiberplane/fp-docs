---
title: Elicitation
description: Request input from the client mid-execution
---

Elicitation lets a tool request input from the client mid-execution. This is useful for confirmations, additional information, or interactive flows.

## Requirements

Elicitation requires both adapters to be configured:

```typescript
const transport = new StreamableHttpTransport({
  sessionAdapter: new InMemorySessionAdapter({ maxEventBufferSize: 1024 }),
  clientRequestAdapter: new InMemoryClientRequestAdapter({ defaultTimeoutMs: 30000 })
});
```

## Basic Example

```typescript
import { z } from "zod";

server.tool("delete_record", {
  inputSchema: z.object({
    recordId: z.string(),
    tableName: z.string(),
  }),
  handler: async (args, ctx) => {
    // Check if client supports elicitation
    if (!ctx.client.supports("elicitation")) {
      throw new Error("Elicitation not supported");
    }

    // Request confirmation from client
    const response = await ctx.elicit({
      message: `Delete record "${args.recordId}" from "${args.tableName}"?`,
      schema: z.object({ confirmed: z.boolean() })
    });

    if (response.action === "accept" && response.content.confirmed) {
      await deleteFromDatabase(args.tableName, args.recordId);
      return { content: [{ type: "text", text: "Record deleted" }] };
    }

    return { content: [{ type: "text", text: "Deletion cancelled" }] };
  }
});
```

## How It Works

1. **Tool execution starts**: Handler begins processing
2. **Elicitation request**: Handler calls `ctx.elicit()`
3. **Server pauses**: Execution waits for client response
4. **Client responds**: Client sends confirmation/input
5. **Execution resumes**: Handler continues with the response
6. **Result returned**: Tool completes normally

## Distributed Deployments

For serverless or multi-instance deployments, implement a custom `ClientRequestAdapter` using persistent storage.

The Cloudflare KV adapter works by:
1. **Storing request metadata in KV** - Only serializable data
2. **Keeping local promise handlers** - In the instance that created the request
3. **Polling for responses** - Each instance polls KV to see if responses arrived
4. **Cross-instance coordination** - Any instance can resolve/reject requests by updating KV
5. **Automatic cleanup** - Handles timeouts and cleans up both local state and KV entries

See `examples/cloudflare-worker-kv/src/mcp/client-request-adapter.ts` for the full implementation.

## Next Steps

- [**Adapters**](/mcp-lite/features/adapters) - Understand adapter interfaces
- [**Sampling**](/mcp-lite/advanced/sampling) - Request LLM completions
