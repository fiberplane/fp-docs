---
title: REST API
description: HTTP API reference for MCP Gateway
---

The MCP Gateway provides an HTTP API for programmatic access to server management, activity logs, and session information. This API is primarily used by the Web UI but is available for programmatic access.

## Base URL

```
http://localhost:3333/api
```

Or your configured port:

```bash
# If using custom port
http://localhost:8080/api
```

## Authentication

All API endpoints require Bearer token authentication:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Getting Your API Token

The API token is **displayed in the console** when the gateway starts:

![Token](/src/assets/terminal-output.png)

## Endpoints

### GET /api/logs

Retrieve activity logs from all servers.

**Query Parameters:**

| Parameter    | Type   | Description                               |
| ------------ | ------ | ----------------------------------------- |
| `serverName` | string | Filter by server name                     |
| `method`     | string | Filter by MCP method (e.g., `tools/list`) |
| `sessionId`  | string | Filter by session ID                      |
| `limit`      | number | Maximum number of entries (default: 100)  |
| `before`     | string | Cursor for pagination (oldest timestamp)  |
| `after`      | string | Cursor for pagination (newest timestamp)  |

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3333/api/logs?serverName=linear-mcp&limit=2"
```

**Example Response:**

```json
{
  "data": [
    {
      "timestamp": "2025-12-02T13:30:47.543Z",
      "method": "tools/call",
      "id": "2",
      "direction": "request",
      "metadata": {
        "serverName": "linear-mcp",
        "sessionId": "d87bc227...",
        "durationMs": 89,
        "httpStatus": 200,
        "userAgent": "claude-code/2.0.55",
        "clientIp": "::1",
        "inputTokens": 13,
        "methodDetail": "list_issues(assignee: \"me\")"
      },
      "request": { ... },
      "response": { ... }
    }
  ],
  "pagination": {
    "count": 2,
    "limit": 2,
    "hasMore": true,
    "oldestTimestamp": "2025-12-02T13:11:22.216Z",
    "newestTimestamp": "2025-12-02T13:30:47.543Z"
  }
}
```

---

### GET /api/servers

List all registered MCP servers.

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/api/servers
```

**Example Response:**

```json
{
  "servers": [
    {
      "name": "linear-mcp",
      "status": "online",
      "url": "https://mcp.linear.app/mcp",
      "health": "up",
      "lastCheckTime": 1764686521450,
      "lastHealthyTime": 1764686521450,
      "responseTimeMs": 80
    }
  ]
}
```

**Response Fields:**

| Field             | Type   | Description                                  |
| ----------------- | ------ | -------------------------------------------- |
| `name`            | string | Server identifier                            |
| `url`             | string | Server endpoint URL                          |
| `status`          | string | Server status: `online` or `offline`         |
| `health`          | string | Health status: `up`, `down`, or `unknown`    |
| `lastCheckTime`   | number | Unix timestamp of last health check (ms)     |
| `lastHealthyTime` | number | Unix timestamp of last successful check (ms) |
| `responseTimeMs`  | number | Last response time in milliseconds           |

---

### POST /api/servers

Add a new MCP server.

**Request Body:**

```json
{
  "name": "weather-api",
  "url": "http://localhost:3001/mcp",
  "headers": {
    "Authorization": "Bearer token123"
  }
}
```

**Example Request:**

```bash
curl -X POST http://localhost:3333/api/servers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "test-server", "url": "http://localhost:3001/mcp"}'
```

---

### GET /api/sessions

Retrieve active and recent MCP sessions.

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/api/sessions
```

**Example Response:**

```json
{
  "sessions": [
    {
      "sessionId": "d87bc227931ab7d8...",
      "serverName": "linear-mcp",
      "startTime": "2025-12-02T13:11:22.034Z",
      "endTime": "2025-12-02T13:30:47.543Z"
    }
  ]
}
```

**Special Values:**

- `sessionId: "stateless"` - Indicates a stateless session (no session ID provided by client)

---

### GET /api/clients

List connected clients.

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/api/clients
```

**Example Response:**

```json
{
  "clients": [
    {
      "clientName": "claude-code",
      "clientVersion": "2.0.55"
    }
  ]
}
```

---

### POST /api/logs/clear

Clear activity logs.

**Query Parameters:**

| Parameter    | Type   | Description                                      |
| ------------ | ------ | ------------------------------------------------ |
| `serverName` | string | Clear only logs for specific server (optional)   |
| `before`     | string | Clear only logs before this timestamp (optional) |

**Example Request:**

```bash
# Clear all logs
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/api/logs/clear

# Clear logs for specific server
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3333/api/logs/clear?serverName=linear-mcp"
```

---

### GET /api/health

Health check endpoint.

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3333/api/health
```

---

## Error Responses

All endpoints return standard HTTP error codes:

| Status | Description                             |
| ------ | --------------------------------------- |
| `401`  | Missing or invalid authentication token |
| `400`  | Invalid query parameters                |
| `404`  | Resource not found                      |
| `500`  | Internal server error                   |

## Next Steps

- [**Gateway MCP Server**](/mcp-gateway/interfaces/gateway-mcp-server) - MCP-based programmatic control
- [**Web UI**](/mcp-gateway/interfaces/web-ui) - Visual server management
- [**Proxy**](/mcp-gateway/concepts/proxy) - Using the gateway as a proxy
