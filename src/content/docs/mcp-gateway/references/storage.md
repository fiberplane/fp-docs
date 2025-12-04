---
title: Storage
description: Data persistence and server registry format
---

Files stored under `~/.mcp-gateway/`:

```
~/.mcp-gateway/
├── mcp.json     # Server registry
├── logs.db      # SQLite traffic logs
└── logs.db-*    # SQLite files
```

## Server Registry (mcp.json)

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
