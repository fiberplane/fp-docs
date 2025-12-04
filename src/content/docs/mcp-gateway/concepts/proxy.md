---
title: Proxy
description: Using MCP Gateway as a proxy for MCP servers
---

The gateway proxies MCP requests to registered servers, enabling traffic capture and centralized management. This is the core functionality of MCP Gateway.

## How It Works

```
Direct Connection (no capture):
MCP Client → http://localhost:3001/mcp → MCP Server

Proxied Connection (with capture):
MCP Client → http://localhost:3333/s/weather/mcp → Gateway → MCP Server
                                                      ↓
                                               SQLite Storage
```

Routing traffic through the gateway:

1. Requests are captured and logged to SQLite
2. Requests are proxied to the actual server
3. Responses are captured and returned to your client
4. All traffic is viewable in the Web UI

## Proxy Endpoint Pattern

Each registered server gets a proxy endpoint:

```
http://localhost:3333/s/{serverName}/mcp
```

**Example:** For a server named `weather-api`:

```
http://localhost:3333/s/weather-api/mcp
```

:::note
Proxy endpoints do **not** require authentication. This allows upstream MCP servers to handle their own auth.
:::

## Registering Servers

Before you can proxy to a server, you must register it with the gateway.

### Via Web UI

1. Open `http://localhost:3333/ui?token=YOUR_TOKEN`
2. Naviagte to "Server Management"
3. Click "Add Server"
4. Enter name and URL
5. Click "Add"

### Via REST API

```bash
curl -X POST http://localhost:3333/api/servers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "weather-api", "url": "http://localhost:3001/mcp"}'
```

### Via Gateway MCP Server

MCP clients connected to the Gateway MCP Server can use the `add_server` tool to register new servers programmatically.

## Connecting MCP Clients

### Claude Code

```bash
claude mcp add --transport http "weather-api" \
  "http://localhost:3333/s/weather-api/mcp"
```

### Other HTTP-Based MCP Clients

Point any MCP client that supports HTTP transport to:

```
http://localhost:3333/s/{server-name}/mcp
```

## Server with Authentication

If your upstream MCP server requires authentication, include headers when registering:

```bash
curl -X POST http://localhost:3333/api/servers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_GATEWAY_TOKEN" \
  -d '{
    "name": "private-api",
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer SERVER_API_KEY"
    }
```

The gateway will include these headers when proxying requests to the server.

## Viewing Captured Traffic

All proxied traffic is captured and viewable:

### Web UI

Navigate to `http://localhost:3333/ui?token=YOUR_TOKEN` to see:

- Activity log with all requests/responses
- Filter by server, method, or time
- Request/response details
- Performance metrics

### REST API

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3333/api/logs?serverName=weather-api"
```

### Gateway MCP Server

MCP clients connected to the Gateway MCP Server can use the `search_records` tool to access logs.

## Next Steps

- [**Web UI**](/mcp-gateway/interfaces/web-ui) - Visual traffic inspection
- [**REST API**](/mcp-gateway/interfaces/rest-api) - Programmatic log access
- [**Storage**](/mcp-gateway/configuration/storage) - Where captured data is stored


