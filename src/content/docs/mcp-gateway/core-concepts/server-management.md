---
title: Server Management
description: Add, configure, and monitor MCP servers
---

MCP Gateway acts as a proxy for multiple MCP servers, allowing you to manage them all from one interface.

## Adding Servers

### Via Terminal UI

1. Press `a` to open the "Add Server" dialog
2. Enter server details:
   - **Name**: A unique identifier for this server
   - **URL**: The HTTP endpoint for the MCP server
3. Press Enter to save

Example:
```
Name: weather-server
URL: http://localhost:3000/mcp
```

### Via Web UI

1. Navigate to `http://localhost:3333/ui`
2. Click "Add Server"
3. Fill in the form and submit

### Via Registry File

Manually edit `~/.mcp-gateway/mcp.json`:

```json
{
  "servers": [
    {
      "name": "weather-server",
      "url": "http://localhost:3000/mcp"
    },
    {
      "name": "database-server",
      "url": "http://localhost:4000/mcp"
    }
  ]
}
```

## Server Configuration

### URL Format

MCP Gateway expects HTTP endpoints that implement the MCP protocol:

```
http://localhost:3000/mcp
https://api.example.com/mcp
```

### Server Names

- Must be unique within the registry
- Used to identify servers in logs and UI
- Can contain letters, numbers, hyphens, and underscores

## Monitoring Servers

### Server Status

The gateway tracks the status of each server:

- **Connected**: Server is reachable and responding
- **Disconnected**: Server is not responding
- **Error**: Server returned an error

### Viewing Status

**Terminal UI:**
- Press `m` to open Server Management
- View the status column for each server

**Web UI:**
- Check the server dashboard
- Status indicators show connection state

## Managing Servers

### View Server List

**TUI**: Press `m`
**Web UI**: Navigate to the servers page

### Remove a Server

**TUI**:
1. Press `m` to open Server Management
2. Select the server
3. Press `d` to delete

**Web UI**:
1. Navigate to the server
2. Click "Remove Server"

### Edit Server Configuration

**Registry File**:
Edit `~/.mcp-gateway/mcp.json` and restart the gateway.

## Connection Handling

### Automatic Reconnection

The gateway automatically attempts to reconnect to servers that become unavailable.

### Connection Timeout

If a server doesn't respond within the timeout period, it's marked as disconnected.

### Error Handling

Connection errors are logged in the activity log. View them with:
- **TUI**: Press `v`
- **Web UI**: Check the server's activity log

## Multi-Server Routing

The gateway routes requests to servers based on:
- Server name in the request
- Path-based routing (if configured)
- Round-robin (if multiple servers handle the same capability)

## Best Practices

### Naming Conventions

Use descriptive names that reflect the server's purpose:
- ✅ `github-integration`
- ✅ `database-tools`
- ❌ `server1`
- ❌ `test`

### URL Management

- Use `http://localhost` for local development
- Use full URLs with HTTPS for production servers
- Ensure servers are accessible from the gateway's network

### Server Organization

Group related servers logically:
- Development servers on separate ports
- Production servers with HTTPS
- Test servers isolated from production

## Troubleshooting

### Server Won't Connect

1. Verify the URL is correct
2. Check the server is running: `curl <server-url>`
3. Check for CORS issues (HTTP MCP servers)
4. Review server logs for errors

### Server Shows Disconnected

- Check network connectivity
- Verify the server is still running
- Look for errors in activity logs

### Cannot Add Server

- Ensure the name is unique
- Verify URL format is correct
- Check for typos in the URL

## Next Steps

- [**Activity Logging**](/mcp-gateway/core-concepts/activity-logging) - Track requests and responses
- [**Terminal UI**](/mcp-gateway/features/terminal-ui) - Master keyboard shortcuts
- [**Storage & Registry**](/mcp-gateway/features/storage) - Understand data persistence
