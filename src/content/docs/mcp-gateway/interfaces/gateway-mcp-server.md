---
title: Gateway MCP Server
description: Manage the gateway using MCP tools
---

The gateway exposes its own MCP server with tools for programmatic control. Any MCP client (like Claude Desktop, Cursor, or custom clients) can connect and manage the gateway.

## Endpoint

```
http://localhost:3333/gateway/mcp
```

Or the shorthand:

```
http://localhost:3333/g/mcp
```

:::note
This endpoint requires Bearer token authentication. Include the token in the `Authorization` header.
:::

## Available Tools

The gateway exposes these MCP tools for server management:

### `add_server`

Add a new MCP server to the gateway registry.

**Parameters:**

| Parameter | Type   | Required | Description                                                   |
| --------- | ------ | -------- | ------------------------------------------------------------- |
| `name`    | string | Yes      | Unique server identifier (alphanumeric, hyphens, underscores) |
| `url`     | string | Yes      | Full HTTP/HTTPS URL to the MCP server                         |
| `headers` | object | No       | Custom HTTP headers for authentication                        |

---

### `remove_server`

Remove a server from the gateway registry.

**Parameters:**

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `name`    | string | Yes      | Name of the server to remove |

---

### `list_servers`

List all registered servers with optional filtering.

**Parameters:**

| Parameter | Type | Required | Description                                             |
| --------- | ---- | -------- | ------------------------------------------------------- |
| `filter`  | enum | No       | `"all"`, `"active"`, or `"inactive"` (default: `"all"`) |
| `format`  | enum | No       | `"concise"` or `"detailed"` (default: `"concise"`)      |

---

### `search_records`

Search and analyze captured MCP traffic.

**Parameters:**

| Parameter    | Type   | Required | Description                                     |
| ------------ | ------ | -------- | ----------------------------------------------- |
| `serverName` | string | No       | Filter by server name                           |
| `sessionId`  | string | No       | Filter by session ID                            |
| `method`     | string | No       | Filter by JSON-RPC method (partial match)       |
| `limit`      | number | No       | Max records to return (default: 100, max: 1000) |
| `order`      | enum   | No       | `"asc"` or `"desc"` (default: `"desc"`)         |

## Using with MCP Clients

Any MCP client that supports HTTP transport can connect to the gateway's MCP server.

## Next Steps

- [**REST API**](/mcp-gateway/interfaces/rest-api) - HTTP API reference
- [**Web UI**](/mcp-gateway/interfaces/web-ui) - Visual management
- [**Proxy**](/mcp-gateway/concepts/proxy) - Route traffic through the gateway
