---
title: Web UI
description: Browser-based dashboard for managing MCP Gateway
---

The Web UI provides a visual, browser-based interface for managing servers and inspecting activity logs.

## Accessing the Web UI

### Default URL

```
http://localhost:3333/ui?token=YOUR_TOKEN
```

The token is displayed in the terminal when the gateway starts. Copy the full URL from the terminal output.

### Custom Port

If running with `--port`:

```bash
mcp-gateway --port 8080
# Access at: http://localhost:8080/ui?token=YOUR_TOKEN
```

## Features

The Web UI provides:

- **Activity Log** - View all captured MCP traffic with filtering
- **Server Management** - Add, edit, remove, and monitor servers
- **Health Status** - Real-time health checks for all servers
- **Export Logs** - Export captured traffic as JSON
- **Search & Filter** - Find specific requests by server, method, or content

## Dashboard

The main dashboard shows your registered MCP servers and their activity.

### Manage Servers

- **Add Server** - Register a new MCP server with the gateway
- **View Server Details** - Click on any server to see health information, gateway URL, and configuration
- **Edit Server** - Modify the origin URL of a registered server
- **Remove Server** - Delete a server from the registry

### Logs

View all logs across servers, or select a specific server to filter the activity log. Additional filters available:

- **Token**
- **Client**
- **Duration**
- **Method**
- **Session**

#### Viewing Log Details

Click on any log entry to see the full request and response details including:

- Timestamp
- Server name
- Method called
- Duration
- Request parameters
- Response data

#### Exporting Logs

The dashboard allows exporting selected logs as JSONL.

### Popular MCP Servers

We've collected some of the most popular MCP servers. These remote servers are available directly through the marketplace.

## Real-Time Updates

The Web UI updates in real-time:

- New log entries appear automatically
- Server status changes reflect immediately
- Activity counts update live

No manual refresh needed!

## Next Steps

- [**REST API**](/mcp-gateway/interfaces/rest-api) - Programmatic access
- [**Gateway MCP Server**](/mcp-gateway/interfaces/gateway-mcp-server) - MCP-based control
- [**CLI**](/mcp-gateway/configuration/cli) - Command-line options
