---
title: Reference
description: technical references
---

## CLI

```bash
mcp-gateway [options]
```

| Flag            | Environment Variable      | Default          | Description       |
| --------------- | ------------------------- | ---------------- | ----------------- |
| `--port`        | `MCP_GATEWAY_PORT`        | `3333`           | HTTP server port  |
| `--storage-dir` | `MCP_GATEWAY_STORAGE_DIR` | `~/.mcp-gateway` | Storage directory |
| N/A             | `MCP_GATEWAY_TOKEN`       | (auto-generated) | Auth token        |
| `--help`        |                           |                  | Show help         |
| `--version`     |                           |                  | Show version      |

```bash
# Examples
mcp-gateway --port 8080
MCP_GATEWAY_TOKEN=my-secret-token mcp-gateway
DEBUG=* mcp-gateway  # Enable debug logging
```

CLI flags override environment variables.

## Authentication

Bearer token required for `/ui/*`, `/api/*`, and `/gateway/mcp`. Proxy endpoints (`/s/{name}/mcp`) are unauthenticated—upstream handles its own auth.

Token is auto-generated on startup (shown in terminal) or set via `MCP_GATEWAY_TOKEN`.

```bash
# API authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3333/api/servers

# Web UI (token in query string)
http://localhost:3333/ui?token=YOUR_TOKEN
```

## Proxy

Route MCP clients through the gateway to capture traffic:

```text
Direct:  MCP Client → http://localhost:3001/mcp → MCP Server
Proxied: MCP Client → http://localhost:3333/s/my-server/mcp → Gateway → MCP Server
                                                                  ↓
                                                           SQLite Storage
```

Proxy URL pattern: `http://localhost:3333/s/{serverName}/mcp`

Example (Claude Code):

```bash
claude mcp add --transport http "my-server" \
  "http://localhost:3333/s/my-server/mcp"
```

Proxy endpoints do **not** require authentication—upstream servers handle their own auth.

## Storage

Files stored under `~/.mcp-gateway/`:

```text
~/.mcp-gateway/
├── mcp.json     # Server registry
├── logs.db      # SQLite traffic logs
└── logs.db-*    # SQLite files
```

### Server Registry (mcp.json)

HTTP server:

```json
{
  "servers": [
    {
      "name": "my-server",
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "enabled": true
    }
  ]
}
```

Stdio server:

```json
{
  "servers": [
    {
      "name": "memory",
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "sessionMode": "shared",
      "timeout": 30000
    }
  ]
}
```

- `sessionMode`: `"shared"` (default) or `"isolated"` (per `x-session-id`)
- Stdio servers are long-lived; restart via UI/API

## Web UI

Access: `http://localhost:3333/ui?token=YOUR_TOKEN`

### Features

- **Activity Log** — view/filter captured MCP traffic
- **Server Management** — add, edit, remove servers
- **Health Status** — real-time health checks
- **Export** — download logs as JSONL

Updates in real-time; no manual refresh needed.

## REST API

Base: `http://localhost:3333/api`

All endpoints require Bearer token authentication.

### GET /api/servers

List registered servers with health status.

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3333/api/servers
```

### POST /api/servers

Add a server.

```bash
curl -X POST http://localhost:3333/api/servers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name": "my-server", "url": "http://localhost:3001/mcp"}'
```

With auth headers for upstream:

```json
{
  "name": "private-api",
  "url": "https://api.example.com/mcp",
  "headers": { "Authorization": "Bearer SERVER_KEY" }
}
```

### GET /api/logs

Query parameters: `serverName`, `sessionId`, `method`, `limit` (default 100), `before`, `after`

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3333/api/logs?serverName=my-server&limit=50"
```

### POST /api/logs/clear

Clear logs. Optional: `?serverName=...` or `?before=2025-01-01T00:00:00Z`

### GET /api/sessions

List active sessions.

### GET /api/clients

List connected clients.

### GET /api/health

Health check.

## Gateway MCP server

Endpoint: `http://localhost:3333/gateway/mcp` (or `/g/mcp`)

Requires Bearer token. Any MCP client can connect to manage the gateway programmatically.

### Available Tools

| Tool             | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `add_server`     | Add server (name, url, headers)                          |
| `remove_server`  | Remove server by name                                    |
| `list_servers`   | List servers (filter: all/active/inactive)               |
| `search_records` | Query logs (serverName, sessionId, method, limit, order) |
