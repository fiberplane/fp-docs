---
title: Authentication
description: Token-based security
---

Bearer token required for `/ui/*`, `/api/*`, and `/gateway/mcp`. Proxy endpoints (`/s/{name}/mcp`) are unauthenticated—upstream handles its own auth.

Token is auto-generated on startup (shown in terminal) or set via `MCP_GATEWAY_TOKEN`.

```bash
# API authentication
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3333/api/servers

# Web UI (token in query string)
http://localhost:3333/ui?token=YOUR_TOKEN
```

