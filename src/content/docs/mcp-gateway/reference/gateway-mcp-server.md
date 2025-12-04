---
title: Gateway MCP Server
description: MCP tools for gateway control
---

Endpoint: `http://localhost:3333/gateway/mcp` (or `/g/mcp`)

Requires Bearer token. Any MCP client can connect to manage the gateway programmatically.

## Available Tools

| Tool             | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `add_server`     | Add server (name, url, headers)                          |
| `remove_server`  | Remove server by name                                    |
| `list_servers`   | List servers (filter: all/active/inactive)               |
| `search_records` | Query logs (serverName, sessionId, method, limit, order) |

