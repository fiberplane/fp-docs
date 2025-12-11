---
title: Overview MCP Gateway
description: Unified gateway for managing and debugging MCP servers
---

MCP Gateway is a unified HTTP proxy for managing, routing, and debugging multiple Model Context Protocol (MCP) servers.

## What is MCP Gateway?

MCP Gateway is a local development tool that proxies communication between AI applications and multiple MCP servers. MCP Gateway runs from a terminal command and exposes a Web UI for managing and interacting with MCP servers. The gateway provides capabilities for:

- **Multi-server management** from a single interface
- **Activity logging** of all requests and responses
- **Real-time monitoring** via a Web UI
- **Traffic capture** stored in SQLite for inspection

## Architecture

The gateway operates in dual mode: it's both a proxy for MCP servers AND an MCP server itself.

```text
┌───────────────────────────────────────────────────────────────┐
│                       MCP Gateway                             │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │  Web UI     │  │ Gateway MCP  │  │   MCP Proxy Router    │ │
│  │  (React)    │  │   Server     │  │  (/s/{name}/mcp)      │ │
│  │  (/ui)      │  │ (/gateway/   │  │                       │ │
│  │             │  │     mcp)     │  │  - Traffic capture    │ │
│  └──────┬──────┘  │              │  │  - Request routing    │ │
│         │         │  Tools:      │  └───────────┬───────────┘ │
│         │         │  • add_server│              │             │
│         │         │  • remove_   │              │             │
│         │         │    server    │              │             │
│         │         │  • list_     │              │             │
│         │         │    servers   │              │             │
│         │         │  • search_   │              │             │
│         │         │    records   │              │             │
│         │         └──────┬───────┘              │             │
│         └────────────────┼──────────────────────┘             │
│                          │                                    │
│         ┌────────────────▼──────────────────┐                 │
│         │     REST API (/api)               │                 │
│         │   (Powers Web UI)                 │                 │
│         └────────────────┬──────────────────┘                 │
│                          │                                    │
│         ┌────────────────▼──────────────────┐                 │
│         │  Storage & Log Management         │                 │
│         │  (SQLite + mcp.json registry)     │                 │
│         └────────────────┬──────────────────┘                 │
│                          │                                    │
└──────────────────────────┼────────────────────────────────────┘
                           │
               ┌───────────┼───────────┐
               │           │           │
        ┌──────▼───┐  ┌────▼────┐  ┌───▼──────┐
        │  MCP     │  │   MCP   │  │   MCP    │
        │ Server 1 │  │ Server 2│  │ Server N │
        └──────────┘  └─────────┘  └──────────┘
```

## Endpoints

| Endpoint              | Auth          | Description                   |
| --------------------- | ------------- | ----------------------------- |
| `/ui?token=<token>`   | Token (query) | Web UI dashboard              |
| `/api/*`              | Bearer token  | REST API                      |
| `/gateway/mcp`        | Bearer token  | Gateway MCP Server            |
| `/s/{serverName}/mcp` | None          | Proxy (upstream handles auth) |

## Next Steps

- [**Getting Started**](/mcp-gateway/getting-started) - Install and configure MCP Gateway
- [**Reference**](/mcp-gateway/reference#cli) - CLI, storage, and API reference
