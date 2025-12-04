## MCP Gateway — Technical Guide (Concise)

Accurate, minimal docs for installing and operating MCP Gateway via a package manager.

---

## Install

Global:

```bash
npm i -g @fiberplane/mcp-gateway
# or: yarn global add … | pnpm add -g … | bun add -g …
```

Ephemeral:

```bash
npx mcp-gateway
# or: pnpm dlx @fiberplane/mcp-gateway | bunx @fiberplane/mcp-gateway
```

---

## Start

```bash
mcp-gateway
```

Output includes port (default 3333) and Web UI URL with token:

```
Web UI: http://localhost:3333/ui?token=<token>
```

---

## Endpoints

- Web UI (token in query): `/ui?token=<token>`
- REST API (Bearer token): `/api/*`
- Gateway MCP Server (Bearer token): `/gateway/mcp`
- Proxy (no auth; upstream handles auth): `/s/{serverName}/mcp`

Auth token:

```bash
export MCP_GATEWAY_TOKEN="my-secret-token"
mcp-gateway
```

---

## Getting Started

- Add first server (Web UI): “Add Server” → name + URL → health check runs
- Proxy pattern:
  ```
  http://localhost:3333/s/{serverName}/mcp
  ```

---

## CLI

```bash
mcp-gateway --port 8080
mcp-gateway --storage-dir /custom/path
DEBUG=* mcp-gateway
mcp-gateway --help | --version
```

Env:

- `MCP_GATEWAY_PORT` (default 3333)
- `MCP_GATEWAY_STORAGE` (default `~/.mcp-gateway`)
- `MCP_GATEWAY_TOKEN` (optional)
- `DEBUG` (`*`, `@fiberplane/*`)

---

## Configuration

Files under `~/.mcp-gateway/`:

```
~/.mcp-gateway/
├── mcp.json     # server registry
├── logs.db      # SQLite logs
└── logs.db-*    # SQLite files
```

HTTP server (mcp.json):

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

Stdio server (mcp.json):

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

Notes:

- `sessionMode`: `"shared"` (default) or `"isolated"` (per `x-session-id`)
- Stdio servers are long-lived; restart via UI/API

---

## REST API

Base:

```
http://localhost:3333/api
```

Auth:

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3333/api/servers
```

Common:

- `GET /api/logs`
- `GET /api/servers`
- `POST /api/servers`
- `GET /api/health`

Filtering and pagination:

- Query params: `server`, `sessionId`, `method`, `limit` (max 1000), `order` (`asc|desc`)

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3333/api/logs?server=my-server&sessionId=abc123&method=tools/list&limit=50&order=desc"
```

---

## Gateway MCP Server

Endpoint:

```
http://localhost:3333/gateway/mcp
```

Tools:

- `add_server`, `remove_server`, `list_servers`, `search_records`
  Auth: Bearer token required.

---

## Web UI

- Activity Log (filter/search), Server management, Health, Export JSON
- Open: `http://localhost:3333/ui?token=<token>`

---

## Troubleshooting

- Port in use:
  ```bash
  mcp-gateway --port 8080
  ```
- Auth errors:
  - Use full UI URL with `?token=…` or set `MCP_GATEWAY_TOKEN`
- Connectivity:
  - Verify upstream URL, check UI health, inspect Activity Log
- Reset data:
  ```bash
  rm -rf ~/.mcp-gateway/ && mcp-gateway
  ```

---

## FAQ

- Logs location: `~/.mcp-gateway/logs.db`
- Proxy auth: upstream server handles its own auth
- Claude Desktop: no HTTP MCP support (can’t use proxy endpoints)
