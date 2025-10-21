---
title: Adapters
description: Scale from prototypes to production with pluggable adapters
---

You can begin with a single file server and add state only when you need it. Adapters let you swap in storage or queueing code without touching tools or handlers.

## Scaling Playbook

Start simple and add complexity as needed:

1. **Local prototyping**: Run the transport with no adapters. Every request is stateless and there is nothing to clean up.
2. **Single server**: Add `InMemorySessionAdapter` (and optionally `InMemoryClientRequestAdapter`) so progress notifications and elicitations can span multiple requests from the same client.
3. **Distributed or serverless**: Implement the adapters against shared infrastructure (Redis, SQL, message queues, Durable Objects, etc.).

## Deployment Patterns

| Environment | Session Storage | State Storage | Transport Configuration |
|-------------|----------------|---------------|------------------------|
| Development | None | N/A | `StreamableHttpTransport()` |
| Single server | In-memory | In-memory | `InMemorySessionAdapter` |
| Distributed | Redis/KV | Redis/KV | Custom adapters |

## Adapter Configuration

### Development: Stateless

```typescript
const transport = new StreamableHttpTransport()
```

### Production: With Sessions and Client Requests

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

## Built-in Adapters

### InMemorySessionAdapter

Session storage in memory for single-server deployments.

```typescript
import { InMemorySessionAdapter } from "mcp-lite";

const sessionAdapter = new InMemorySessionAdapter({
  maxEventBufferSize: 1024  // Max events to buffer per session
});
```

### InMemoryClientRequestAdapter

Client request tracking in memory for elicitation and sampling.

```typescript
import { InMemoryClientRequestAdapter } from "mcp-lite";

const clientRequestAdapter = new InMemoryClientRequestAdapter({
  defaultTimeoutMs: 30000  // Default timeout for client requests
});
```

## Client Requests and Elicitation

The server can send JSON-RPC requests back to the MCP client (for example when you call `ctx.elicit`). Those requests are routed through the `ClientRequestAdapter`.

Provide one when you need:
- Timeouts or retries for client prompts
- To make sure an elicitation response is delivered even when the original POST is finished
- To back the pending requests with shared storage in a multi-instance deployment

The in-memory adapter covers local runs. For production you can implement `ClientRequestAdapter` using Redis, a SQL store, Durable Objects, or any queue that can look up pending requests by session and request id.

## Custom Adapters

Implement these interfaces for custom storage:

### SessionAdapter Interface

```typescript
interface SessionAdapter {
  generateSessionId(): string
  create(id: string, meta: SessionMeta): Promise<SessionData>
  has(id: string): Promise<boolean>
  get(id: string): Promise<SessionData | undefined>
  appendEvent(id: string, streamId: string, message: unknown): Promise<EventId>
  replay(id: string, lastEventId: EventId, write: WriteFunction): Promise<void>
  delete(id: string): Promise<void>
}
```

### ClientRequestAdapter Interface

```typescript
interface ClientRequestAdapter {
  createPending(sessionId: string, requestId: string, options): { promise: Promise<Response> }
  resolvePending(sessionId: string, requestId: string, response: Response): boolean
  rejectPending(sessionId: string, requestId: string, error: Error): boolean
}
```

## Production Example

See `examples/cloudflare-worker-kv` for a production implementation using Cloudflare KV for both session and client request storage.

## Next Steps

- [**Deployment Patterns**](/mcp-lite/deployment/patterns) - Learn deployment strategies
- [**Elicitation**](/mcp-lite/advanced/elicitation) - Implement client requests
