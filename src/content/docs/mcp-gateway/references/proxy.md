---
title: Proxy
description: Routing MCP traffic through the gateway
---

Route MCP clients through the gateway to capture traffic:

```
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
