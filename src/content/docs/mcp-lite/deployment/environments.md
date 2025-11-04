---
title: Runtime Environments
description: Deploy mcp-lite to various platforms and frameworks
---

`StreamableHttpTransport` runs anywhere the Fetch API is available.

## Hono + Bun

```typescript
import { Hono } from "hono"
import { McpServer, StreamableHttpTransport } from "mcp-lite"
import { z } from "zod"

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType)
}).tool("echo", {
  inputSchema: z.object({ message: z.string() }),
  handler: (args) => ({ content: [{ type: "text", text: args.message }] })
})

const transport = new StreamableHttpTransport()
const handler = transport.bind(server)
const app = new Hono()
app.all("/mcp", (c) => handler(c.req.raw))
export default app
```

Run with:
```bash
bun run server.ts
```

## Cloudflare Workers

Stateless starter (plug adapters into KV / Durable Objects for production):

```typescript
import { McpServer, StreamableHttpTransport } from "mcp-lite"
import { z } from "zod"

export default {
  async fetch(request: Request): Promise<Response> {
    const server = new McpServer({
      name: "worker-server",
      version: "1.0.0",
      schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType)
    }).tool("echo", {
      inputSchema: z.object({ message: z.string() }),
      handler: (args) => ({ content: [{ type: "text", text: args.message }] })
    })

    const transport = new StreamableHttpTransport()
    return transport.bind(server)(request)
  }
}
```

Deploy with:
```bash
wrangler deploy
```

## Next.js App Router

```typescript
import { McpServer, StreamableHttpTransport } from "mcp-lite"
import { z } from "zod"

const server = new McpServer({
  name: "nextjs-server",
  version: "1.0.0",
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType)
}).tool("echo", {
  inputSchema: z.object({ message: z.string() }),
  handler: (args) => ({ content: [{ type: "text", text: args.message }] })
})

const handler = new StreamableHttpTransport().bind(server)

export const POST = handler
export const GET = handler
```

Place in `app/api/mcp/route.ts`.

## Node.js with Express

```typescript
import express from "express"
import { McpServer, StreamableHttpTransport } from "mcp-lite"
import { z } from "zod"

const server = new McpServer({
  name: "express-server",
  version: "1.0.0",
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType)
}).tool("echo", {
  inputSchema: z.object({ message: z.string() }),
  handler: (args) => ({ content: [{ type: "text", text: args.message }] })
})

const transport = new StreamableHttpTransport()
const mcpHandler = transport.bind(server)

const app = express()

app.all("/mcp", async (req, res) => {
  const response = await mcpHandler(
    new Request(`http://localhost:${req.socket.localPort}${req.url}`, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
    })
  )

  res.status(response.status)
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  const body = await response.text()
  res.send(body)
})

app.listen(3000)
```

## Deno

```typescript
import { McpServer, StreamableHttpTransport } from "mcp-lite"
import { z } from "zod"

const server = new McpServer({
  name: "deno-server",
  version: "1.0.0",
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType)
}).tool("echo", {
  inputSchema: z.object({ message: z.string() }),
  handler: (args) => ({ content: [{ type: "text", text: args.message }] })
})

const transport = new StreamableHttpTransport()
const handler = transport.bind(server)

Deno.serve(handler)
```

Run with:
```bash
deno run --allow-net server.ts
```

## Next Steps

- [**Deployment Patterns**](/mcp-lite/deployment/patterns) - Learn scaling strategies
- [**Adapters**](/mcp-lite/features/adapters) - Add persistence
