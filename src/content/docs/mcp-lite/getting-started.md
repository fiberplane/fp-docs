---
title: Getting Started
description: Install mcp-lite and create your first MCP server
---

## Installation

Install `mcp-lite` using your preferred package manager:

```bash
npm install mcp-lite
```

## Your First MCP Server

Let's create a minimal MCP server that exposes a simple tool. This example uses Hono for the HTTP server and Zod for schema validation.

### Step 1: Install Dependencies

```bash
npm install mcp-lite hono zod
```

### Step 2: Create the Server

Create a new file `server.ts`:

```typescript
import { Hono } from "hono";
import { McpServer, StreamableHttpTransport } from "mcp-lite";
import { z } from "zod";

// Create the MCP server instance
const mcp = new McpServer({
  name: "my-first-server",
  version: "1.0.0",
  schemaAdapter: (schema) => z.toJSONSchema(schema as z.ZodType),
});

// Define a simple tool
mcp.tool("echo", {
  description: "Echoes back the message you send",
  inputSchema: z.object({
    message: z.string(),
  }),
  handler: (args) => ({
    content: [{
      type: "text",
      text: `You said: ${args.message}`
    }],
  }),
});

// Create the transport and bind it to the server
const transport = new StreamableHttpTransport();
const httpHandler = transport.bind(mcp);

// Set up the HTTP server
const app = new Hono();
app.all("/mcp", async (c) => {
  const response = await httpHandler(c.req.raw);
  return response;
});

// Export for your runtime
export default app;
```

### Step 3: Run the Server

For Bun:
```bash
bun run server.ts
```

For Node with a bundler:
```bash
npx tsx server.ts
```

Your MCP server is now running and ready to accept requests!

## Understanding the Code

Let's break down what's happening:

1. **McpServer Creation**: The `McpServer` instance manages your tools, resources, and prompts.

2. **Schema Adapter**: The `schemaAdapter` converts your validation library's schema (Zod in this case) to JSON Schema for the MCP protocol.

3. **Tool Definition**: The `.tool()` method registers a callable function with input validation and a handler.

4. **Transport**: `StreamableHttpTransport` handles HTTP + SSE communication using the Fetch API.

5. **HTTP Handler**: Binding the transport to the server creates a request handler compatible with any framework.

## Next Steps

Now that you have a basic server running, explore:

- [**Tools**](/mcp-lite/core-concepts/tools) - Learn about different tool patterns
- [**Type Safety**](/mcp-lite/core-concepts/type-safety) - Understand automatic type inference
- [**Resources**](/mcp-lite/core-concepts/resources) - Expose data through resources
- [**Middleware**](/mcp-lite/features/middleware) - Add authentication and logging
