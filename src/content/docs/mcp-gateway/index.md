---
title: Overview
description: Unified gateway for managing and debugging MCP servers
---

MCP Gateway is a unified HTTP proxy for managing, routing, and debugging multiple Model Context Protocol (MCP) servers.

## What is MCP Gateway?

MCP Gateway is a local development tool that proxies communication between AI applications and multiple MCP servers. MCP Gateway runs from a terminal command and exposes a Web UI for managing and interacting with MCP servers. The gateway provides capabilities for:

- Managing multiple MCP servers from a single interface
- Inspecting and debugging request/response traffic
- Monitoring server activity in real-time
- Storing and replaying captured logs

## Key Features

### Multi-Server Management

The gateway allows multiple MCP servers to be added, configured, and monitored from a single interface. Switching between servers and managing their lifecycle is supported seamlessly.

### Activity Logging

The gateway captures all requests and responses passing through it. Logs can be filtered by server or time, providing detailed information to facilitate debugging

### Interface

The Gateway comes with a Web-UI with browser-based dashboard for visual server management

### Local Development

The gateway runs locally during development, supporting testing and debugging of MCP integrations before deployment to production.

## Use Cases

### Local MCP Development

MCP Gateway supports local development and testing of MCP servers with complete visibility into request and response traffic. It operates as an intermediary, logging all communication for inspection.

### Multi-Server Coordination

The gateway facilitates routing requests to multiple MCP servers and managing complex setups with specialized servers efficiently.

### Request Debugging

Captured requests and responses can be inspected in detail, aiding in the identification and resolution of issues.

### Activity Monitoring

The gateway provides real-time monitoring of server health, response times, and error rates, offering full visibility into the MCP infrastructure.

## Architecture

The gateway operates in dual mode: it's both a proxy for MCP servers AND an MCP server itself.

```
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

## Quick Example

```bash
# Install MCP Gateway
npm install -g @fiberplane/mcp-gateway

# Start the gateway
mcp-gateway

# To access the web interface, copy the Web UI URL with the authetication token from your terminal output:
```

![Terminal Output after starting the gateway](/src/assets/terminal-output.png)

## Next Steps

- [**Getting Started**](/mcp-gateway/getting-started) - Install and configure MCP Gateway
