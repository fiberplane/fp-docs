---
title: Examples
description: Complete example implementations and code samples
---

The `mcp-lite` repository includes runnable samples that demonstrate different adapters, runtimes, and features.

## Validation Examples

### Zod

Standard validation using Zod for schema validation and type inference.

**Location:** `examples/validation-zod`

**Features:**
- Type-safe input/output schemas
- Automatic JSON Schema conversion
- Runtime validation

### Valibot

Lightweight validation using Valibot.

**Location:** `examples/validation-valibot`

**Features:**
- Valibot schema support
- Standard Schema compatibility
- Smaller bundle size

### Effect Schema

Functional validation using Effect Schema.

**Location:** `examples/validation-effectschema`

**Features:**
- Effect ecosystem integration
- Composable schemas
- Advanced transformations

### ArkType

TypeScript-first validation with ArkType.

**Location:** `examples/validation-arktype`

**Features:**
- Native TypeScript types
- Minimal runtime overhead
- Developer experience focus

## Deployment Examples

### Cloudflare Workers with KV

Production-ready serverless deployment using Cloudflare KV for session and client request storage.

**Location:** `examples/cloudflare-worker-kv`

**Features:**
- KV-backed session adapter
- KV-backed client request adapter
- Distributed elicitation support
- Request polling patterns

**Key Files:**
- `src/mcp/session-adapter.ts` - KV session storage
- `src/mcp/client-request-adapter.ts` - KV client request tracking

## Feature Examples

### Server Composition

Multiple servers grouped behind one transport with namespacing.

**Location:** `examples/composing-servers`

**Features:**
- Modular server organization
- Namespace support
- Shared middleware
- Independent tool sets

### Authentication with Clerk

Complete authentication example using Clerk middleware.

**Location:** `examples/auth-clerk`

**Features:**
- Clerk integration
- Protected routes
- User context in handlers
- Auth state management

## Quick Start

Each example includes:
- Complete source code
- `README.md` with setup instructions
- Package configuration
- Environment variable templates (when applicable)

To run an example:

```bash
cd examples/<example-name>
npm install
npm run dev
```

## Example Structure

Most examples follow this structure:

```
examples/<name>/
├── src/
│   ├── server.ts      # Main MCP server setup
│   └── tools/         # Tool definitions
├── package.json
└── README.md
```

## Contributing Examples

Have a useful pattern or integration? Consider contributing an example to help others!

## Next Steps

- [**Getting Started**](/mcp-lite/getting-started) - Build your first server
- [**Deployment**](/mcp-lite/deployment/environments) - Deploy to production
