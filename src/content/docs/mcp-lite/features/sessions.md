---
title: Sessions
description: Manage state across multiple requests
---

By default, `mcp-lite` runs in stateless mode. You can opt into sessions to enable features like progress notifications, event replay, and elicitation.

## Stateless Mode (Default)

Default mode with no session management:

```typescript
const transport = new StreamableHttpTransport();
```

Every request is independent. Best for:
- Simple, stateless APIs
- Development and prototyping
- Single-request tools

## Stateful Mode

Enable sessions for SSE streaming and event replay:

```typescript
import { StreamableHttpTransport, InMemorySessionAdapter } from "mcp-lite";

const transport = new StreamableHttpTransport({
  sessionAdapter: new InMemorySessionAdapter({
    maxEventBufferSize: 1024
  })
});
```

This enables:
- **Session persistence** across requests
- **SSE streaming** via GET endpoint
- **Event replay** for reconnections
- **Progress notifications**

## Session Lifecycle

1. **Initialize**: Client sends an `initialize` request
2. **Session Created**: Server generates a session ID
3. **Subsequent Requests**: Client includes session ID in headers
4. **SSE Streaming**: Client can connect via GET for real-time events
5. **Cleanup**: Sessions expire after inactivity

## Accessing Session Data

Inside your handlers:

```typescript
server.tool("myTool", {
  handler: (args, ctx) => {
    // Access session ID
    const sessionId = ctx.session?.id;

    // Report progress (requires session)
    ctx.progress?.({ progress: 50, total: 100 });

    // Store custom state
    ctx.state.myData = "...";

    return { content: [{ type: "text", text: "Done" }] };
  }
});
```

## Next Steps

- [**Adapters**](/mcp-lite/features/adapters) - Scale beyond in-memory sessions
- [**Elicitation**](/mcp-lite/advanced/elicitation) - Request input mid-execution
