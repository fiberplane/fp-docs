---
title: CLI Options
description: Command-line configuration options for MCP Gateway
---

Configure MCP Gateway behavior using command-line flags.

## Basic Usage

```bash
mcp-gateway [options]
```

## Options

### `--port <number>`

Set the HTTP server port.

```bash
# Use port 8080 instead of default 3333
mcp-gateway --port 8080
```

**Default:** `3333`

**Example:**
```bash
mcp-gateway --port 8080
# API: http://localhost:8080/api
# Web UI: http://localhost:8080/ui
```

### `--storage-dir <path>`

Set custom storage directory for logs and registry.

```bash
mcp-gateway --storage-dir /custom/path
```

**Default:** `~/.mcp-gateway`

**Example:**
```bash
mcp-gateway --storage-dir ~/my-gateway-data
# Registry: ~/my-gateway-data/mcp.json
# Logs: ~/my-gateway-data/captures/
```

### `--no-tui`

Run in headless mode without the Terminal UI.

```bash
mcp-gateway --no-tui
```

**Use Cases:**
- Docker containers with TTY allocated but headless mode desired
- systemd services
- CI/CD environments
- Background processes
- Multiple instances managed via Web UI only

**Example:**
```bash
# Run in background
mcp-gateway --no-tui &

# Access via Web UI
open http://localhost:3333/ui
```

### `--help`

Display help information.

```bash
mcp-gateway --help
```

**Output:**
```
MCP Gateway - Unified proxy for MCP servers

Usage: mcp-gateway [options]

Options:
  --port <number>       Set HTTP server port (default: 3333)
  --storage-dir <path>  Set storage directory (default: ~/.mcp-gateway)
  --no-tui              Run without Terminal UI
  --version             Show version number
  --help                Show this help message
```

### `--version`

Display version information.

```bash
mcp-gateway --version
```

**Output:**
```
@fiberplane/mcp-gateway v1.0.0
```

## Combining Options

You can combine multiple options:

```bash
mcp-gateway --port 8080 --storage-dir ~/gateway --no-tui
```

This configures the gateway to:
- Run on port 8080
- Store data in `~/gateway`
- Run without Terminal UI

## Environment Variables

Some configurations can be set via environment variables:

### `MCP_GATEWAY_PORT`

Alternative to `--port`:

```bash
MCP_GATEWAY_PORT=8080 mcp-gateway
```

### `MCP_GATEWAY_STORAGE_DIR`

Alternative to `--storage-dir`:

```bash
MCP_GATEWAY_STORAGE_DIR=~/gateway mcp-gateway
```

**Note:** CLI flags take precedence over environment variables.

## Configuration Precedence

Options are applied in this order (highest to lowest):

1. Command-line flags
2. Environment variables
3. Default values

Example:

```bash
# Port will be 9000 (CLI flag wins)
MCP_GATEWAY_PORT=8080 mcp-gateway --port 9000
```

## Common Patterns

### Development

```bash
# Default settings, with TUI
mcp-gateway
```

### Production (systemd)

```bash
# Headless, custom storage, non-default port
mcp-gateway --no-tui --port 8080 --storage-dir /var/lib/mcp-gateway
```

### Docker

```bash
# Headless, standard port, volume-mounted storage
docker run -p 3333:3333 \
  -v ./data:/data \
  mcp-gateway --no-tui --storage-dir /data
```

### Multiple Instances

```bash
# Instance 1
mcp-gateway --port 3333 --storage-dir ~/.mcp-gateway-1

# Instance 2
mcp-gateway --port 3334 --storage-dir ~/.mcp-gateway-2
```

## Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3333`

**Solution:**
```bash
# Find process using port
lsof -i :3333

# Kill process
kill -9 <PID>

# Or use different port
mcp-gateway --port 8080
```

### Permission Denied (Storage Directory)

**Error:** `EACCES: permission denied, mkdir '/var/lib/mcp-gateway'`

**Solution:**
```bash
# Create directory with proper permissions
sudo mkdir -p /var/lib/mcp-gateway
sudo chown $USER:$USER /var/lib/mcp-gateway

# Or use user-writable directory
mcp-gateway --storage-dir ~/mcp-gateway
```

### Invalid Port Number

**Error:** `Invalid port number: abc`

**Solution:**
```bash
# Use numeric port between 1-65535
mcp-gateway --port 3333
```

## Next Steps

- [**Terminal UI**](/mcp-gateway/features/terminal-ui) - Master keyboard shortcuts
- [**Storage & Registry**](/mcp-gateway/features/storage) - Understand data storage
- [**Production Deployment**](/mcp-gateway/deployment/production) - Deploy to production
