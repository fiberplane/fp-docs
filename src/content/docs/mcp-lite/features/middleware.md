---
title: Middleware
description: Apply Hono-style middleware and compose servers
---

## Middleware

`mcp-lite` lets you apply Hono-style middleware to every request before it reaches a tool or prompt handler.

### Logging Example

```typescript
server.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`${ctx.request.method} took ${Date.now() - start}ms`);
});
```

### Authentication Example

```typescript
server.use(async (ctx, next) => {
  const token = ctx.request.headers?.get?.("Authorization");
  if (!token) throw new Error("Unauthorized");
  ctx.state.user = await validateToken(token);
  await next();
});
```

### Rate Limiting Example

```typescript
server.use(async (ctx, next) => {
  const userId = ctx.state.user?.id;
  if (await isRateLimited(userId)) {
    throw new Error("Rate limit exceeded");
  }
  await next();
});
```

## Server Composition

Group smaller servers together while preserving their tooling and middleware:

```typescript
const gitServer = new McpServer({ name: "git", version: "1.0.0" })
  .tool("clone", { /* ... */ })
  .tool("commit", { /* ... */ });

const dbServer = new McpServer({ name: "database", version: "1.0.0" })
  .tool("query", { /* ... */ })
  .tool("migrate", { /* ... */ });

// With namespacing
const app = new McpServer({ name: "app", version: "1.0.0" })
  .group("git", gitServer)      // Registers: git/clone, git/commit
  .group("db", dbServer);        // Registers: db/query, db/migrate

// Without namespacing
const app2 = new McpServer({ name: "app", version: "1.0.0" })
  .group(gitServer)              // Registers: clone, commit
  .group(dbServer);              // Registers: query, migrate
```

See `examples/composing-servers` for a complete implementation.

## Authentication Example

For a complete authentication example using Clerk:

```typescript
import { ClerkMiddleware } from "@clerk/hono";

server.use(ClerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

server.use(async (ctx, next) => {
  const auth = ctx.state.auth;
  if (!auth?.userId) {
    throw new Error("Unauthorized");
  }
  ctx.state.userId = auth.userId;
  await next();
});
```

See `examples/auth-clerk` for the full implementation.

## Next Steps

- [**Sessions**](/mcp-lite/features/sessions) - Enable session management
- [**Error Handling**](/mcp-lite/features/error-handling) - Handle errors in middleware
