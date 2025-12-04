---
title: REST API
description: HTTP API endpoints
---

Base: `http://localhost:3333/api`

All endpoints require Bearer token authentication.

## GET /api/servers

List registered servers with health status.

```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:3333/api/servers
```

## POST /api/servers

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

## GET /api/logs

Query parameters: `serverName`, `sessionId`, `method`, `limit` (default 100), `before`, `after`

```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:3333/api/logs?serverName=my-server&limit=50"
```

## POST /api/logs/clear

Clear logs. Optional: `?serverName=...` or `?before=2025-01-01T00:00:00Z`

## GET /api/sessions

List active sessions.

## GET /api/clients

List connected clients.

## GET /api/health

Health check.

