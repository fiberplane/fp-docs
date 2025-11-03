---
title: Deployment Patterns
description: Strategies for scaling from development to production
---

`mcp-lite` is designed to grow with your needs. Start simple and add complexity only when required.

## Scaling Strategy

### 1. Local Prototyping

Run the transport with no adapters. Every request is stateless and there is nothing to clean up.

```typescript
const transport = new StreamableHttpTransport()
```

**Use when:**
- Building and testing locally
- Tools don't need state between requests
- Quick prototypes and experiments

### 2. Single Server

Add `InMemorySessionAdapter` (and optionally `InMemoryClientRequestAdapter`) so progress notifications and elicitations can span multiple requests from the same client.

```typescript
const transport = new StreamableHttpTransport({
  sessionAdapter: new InMemorySessionAdapter({
    maxEventBufferSize: 1024
  }),
  clientRequestAdapter: new InMemoryClientRequestAdapter({
    defaultTimeoutMs: 30000
  })
})
```

**Use when:**
- Running on a single server instance
- Need sessions but don't need distributed state
- Development or staging environments

### 3. Distributed / Serverless

Implement the adapters against shared infrastructure (Redis, SQL, message queues, Durable Objects, etc.).

```typescript
const transport = new StreamableHttpTransport({
  sessionAdapter: new RedisSessionAdapter(redisClient),
  clientRequestAdapter: new RedisClientRequestAdapter(redisClient)
})
```

**Use when:**
- Multiple server instances
- Serverless deployments (Cloudflare Workers, AWS Lambda)
- Need session persistence across instances

## Deployment Comparison

| Environment | Session Storage | State Storage | Transport Configuration |
|-------------|----------------|---------------|------------------------|
| Development | None | N/A | `StreamableHttpTransport()` |
| Single server | In-memory | In-memory | `InMemorySessionAdapter` |
| Distributed | Redis/KV | Redis/KV | Custom adapters |
| Serverless | Durable Objects/KV | Durable Objects/KV | Custom adapters |

## Example: Cloudflare Workers with KV

For serverless deployments, use persistent storage:

```typescript
import { McpServer, StreamableHttpTransport } from "mcp-lite"
import { KvSessionAdapter, KvClientRequestAdapter } from "./adapters"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const server = new McpServer({
      name: "worker-server",
      version: "1.0.0"
    })
    // ... define tools

    const transport = new StreamableHttpTransport({
      sessionAdapter: new KvSessionAdapter(env.KV),
      clientRequestAdapter: new KvClientRequestAdapter(env.KV)
    })

    return transport.bind(server)(request)
  }
}
```

See `examples/cloudflare-worker-kv` for the complete KV adapter implementation.

## Best Practices

### Start Stateless
Begin without adapters until you actually need sessions or elicitation.

### Add Sessions When Needed
Enable sessions when you need:
- Progress notifications
- SSE streaming
- Event replay for reconnections

### Go Distributed Last
Only implement custom adapters when:
- Running multiple instances
- Deploying to serverless platforms
- Need cross-instance session persistence

### Monitor and Scale
- Track session count and memory usage
- Set appropriate `maxEventBufferSize`
- Implement session cleanup/expiry
- Use timeouts for client requests

## Next Steps

- [**Adapters**](/mcp-lite/features/adapters) - Implement custom adapters
- [**Runtime Environments**](/mcp-lite/deployment/environments) - Deploy to specific platforms
- [**Examples**](/mcp-lite/examples) - See complete implementations
