---
title: Authentication
description: How authentication works in MCP Gateway
---

MCP Gateway uses Bearer token authentication to protect sensitive endpoints while allowing proxy endpoints to remain open.

## Token Generation

When the gateway starts, it generates a random authentication token displayed in the terminal:

```
mcp-gateway v0.7.0

MCP Gateway server started at http://localhost:3333
Web UI: http://localhost:3333/ui?token=HxWFRLBUMjeUWgwSZERD2p86EpWhL1zwASWIwcZ-97A

```

**Important:** Copy this token for API access. The token regenerates on each gateway restart unless you set a custom token.

## Custom Token

Set a persistent token via environment variable:

```bash
MCP_GATEWAY_TOKEN=my-secret-token mcp-gateway
```

## Protected Endpoints

These endpoints require Bearer token authentication:

| Endpoint       | Description                    |
| -------------- | ------------------------------ |
| `/ui/*`        | Web UI (token via query param) |
| `/api/*`       | REST API                       |
| `/gateway/mcp` | Gateway MCP Server             |
| `/g/mcp`       | Gateway MCP Server (shorthand) |

### Web UI Authentication

The Web UI accepts the token as a query parameter:

```
http://localhost:3333/ui?token=YOUR_TOKEN
```

- Token is stored in browser session storage
- Subsequent navigation within `/ui/*` doesn't require the token
- Token expires when browser session ends

### API Authentication

Include the token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/api/servers
```

### Gateway MCP Server Authentication

The Gateway MCP Server uses the same Bearer token authentication. MCP clients pass the token in the `Authorization` header when connecting.

## Unprotected Endpoints

Proxy endpoints do **not** require authentication:

| Endpoint               | Description                    |
| ---------------------- | ------------------------------ |
| `/s/{server-name}/mcp` | Proxy to registered MCP server |

This allows upstream MCP servers to handle their own authentication as needed.

## Next Steps

- [**Getting Started**](/mcp-gateway/getting-started) - Quick setup guide
- [**REST API**](/mcp-gateway/interfaces/rest-api) - API endpoint reference
- [**Proxy**](/mcp-gateway/concepts/proxy) - Using the gateway as a proxy
