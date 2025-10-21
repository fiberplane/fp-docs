---
title: Overview
description: Unified gateway for managing and debugging MCP servers
---

MCP Gateway is a unified HTTP proxy for managing, routing, and debugging multiple Model Context Protocol servers with ease.

## What is MCP Gateway?

MCP Gateway provides a local development tool that acts as a proxy between your AI applications and multiple MCP servers. It combines a **Terminal UI (TUI)** and **Web UI** to help you:

- Manage multiple MCP servers from a single interface
- Inspect and debug request/response traffic
- Monitor server activity in real-time
- Store and replay captured logs

## Key Features

### Multi-Server Management
Add, configure, and monitor multiple MCP servers from one place. Switch between servers seamlessly and manage their lifecycle.

### Activity Logging
Capture all requests and responses flowing through the gateway. Inspect detailed logs, filter by server or time, and debug issues faster.

### Dual Interfaces
- **Terminal UI**: Keyboard-driven interface for power users
- **Web UI**: Browser-based dashboard for visual server management

### Local Development
Run the gateway locally during development to test and debug MCP integrations before deploying to production.

## Use Cases

### Local MCP Development
Develop and test MCP servers locally with full request/response visibility. The gateway acts as an intermediary, logging all traffic for inspection.

### Multi-Server Coordination
Route requests to different MCP servers based on your needs. Manage complex setups with multiple specialized servers.

### Request Debugging
Inspect the exact requests sent to MCP servers and responses received. Identify issues quickly with detailed logging.

### Activity Monitoring
Track server health, response times, and error rates. Monitor your MCP infrastructure in real-time.

## Architecture

```
┌─────────────┐
│ AI Client  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  MCP Gateway    │
│  ┌──────────┐   │
│  │   TUI    │   │
│  └──────────┘   │
│  ┌──────────┐   │
│  │ Web UI   │   │
│  └──────────┘   │
│  ┌──────────┐   │
│  │  Proxy   │   │
│  └──────────┘   │
│  ┌──────────┐   │
│  │ Storage  │   │
│  └──────────┘   │
└────┬────┬───┬───┘
     │    │   │
     ▼    ▼   ▼
   MCP  MCP MCP
  Server1 2  3
```

## Quick Example

```bash
# Install MCP Gateway
npm install -g @fiberplane/mcp-gateway

# Start the gateway
mcp-gateway

# Add a server (in TUI, press 'a')
# Name: my-server
# URL: http://localhost:3000/mcp

# Access Web UI
open http://localhost:3333/ui
```

## Next Steps

- [**Getting Started**](/mcp-gateway/getting-started) - Install and configure MCP Gateway
- [**Server Management**](/mcp-gateway/core-concepts/server-management) - Learn to manage MCP servers
- [**Terminal UI**](/mcp-gateway/features/terminal-ui) - Master keyboard shortcuts and TUI features
