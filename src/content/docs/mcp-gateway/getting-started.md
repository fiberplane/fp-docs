---
title: Getting Started
description: Install and set up MCP Gateway
---

Get up and running with MCP Gateway in minutes.

## Installation

### NPM

```bash
npm install -g @fiberplane/mcp-gateway
```

### Bun

```bash
bun add -g @fiberplane/mcp-gateway
```

### Platform Binaries

Download platform-specific binaries from the [releases page](https://github.com/fiberplane/mcp-gateway/releases):

- `mcp-gateway-darwin-arm64` - macOS Apple Silicon
- `mcp-gateway-darwin-x64` - macOS Intel
- `mcp-gateway-linux-x64` - Linux
- `mcp-gateway-windows-x64` - Windows

## Quick Start

### 1. Start the Gateway

```bash
mcp-gateway
```

This starts the gateway with:
- **Terminal UI** in your current shell
- **API server** on port 3333
- **Web UI** at `http://localhost:3333/ui`

### 2. Add Your First MCP Server

In the Terminal UI, press `a` to add a new server:

```
Name: my-server
URL: http://localhost:3000/mcp
```

Or use the Web UI at `http://localhost:3333/ui`.

### 3. Test the Connection

The gateway will automatically attempt to connect to your server. Check the status in:
- **TUI**: Press `m` to view server management
- **Web UI**: Navigate to the dashboard

### 4. View Activity Logs

See requests and responses in real-time:
- **TUI**: Press `v` to view activity log
- **Web UI**: Click on a server to see its logs

## Basic Configuration

### Custom Port

```bash
mcp-gateway --port 8080
```

### Custom Storage Directory

```bash
mcp-gateway --storage-dir /custom/path
```

### Headless Mode

Run without the Terminal UI (useful for Docker, systemd, or background processes):

```bash
mcp-gateway --no-tui
```

Access the Web UI at `http://localhost:3333/ui` to manage servers.

## Common Commands

```bash
# Show help
mcp-gateway --help

# Show version
mcp-gateway --version

# Start with custom settings
mcp-gateway --port 8080 --storage-dir ~/.my-gateway
```

## Verifying Installation

Check that the gateway is running:

```bash
# Check API health
curl http://localhost:3333/api/health

# Or visit in browser
open http://localhost:3333/ui
```

## Next Steps

- [**Server Management**](/mcp-gateway/core-concepts/server-management) - Add and configure MCP servers
- [**Terminal UI**](/mcp-gateway/features/terminal-ui) - Learn keyboard shortcuts
- [**CLI Options**](/mcp-gateway/features/cli-options) - Explore all command-line options
