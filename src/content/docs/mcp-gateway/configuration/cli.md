---
title: CLI
description: Command-line options for MCP Gateway
---

Configure MCP Gateway behavior using command-line flags and environment variables.

## Basic Usage

```bash
mcp-gateway [options]
```

## Options

### `--port <number>`

Set the HTTP server port.

```bash
mcp-gateway --port 8080
```

**Default:** `3333`

**Result:**

- API: `http://localhost:8080/api`
- Web UI: `http://localhost:8080/ui`
- Proxy: `http://localhost:8080/s/{server}/mcp`

---

### `--storage-dir <path>`

Set custom storage directory for logs and registry.

```bash
mcp-gateway --storage-dir /custom/path
```

**Default:** `~/.mcp-gateway`

**Result:**

- Registry: `/custom/path/mcp.json`
- Database: `/custom/path/gateway.db`

---

### `--help`

Display help information.

```bash
mcp-gateway --help
```

---

### `--version`

Display version information.

```bash
mcp-gateway --version
```

## Environment Variables

All CLI options have environment variable equivalents:

| Environment Variable      | CLI Flag        | Default          |
| ------------------------- | --------------- | ---------------- |
| `MCP_GATEWAY_PORT`        | `--port`        | `3333`           |
| `MCP_GATEWAY_STORAGE_DIR` | `--storage-dir` | `~/.mcp-gateway` |
| `MCP_GATEWAY_TOKEN`       | N/A             | (auto-generated) |

**Examples:**

```bash
# Set port via environment
MCP_GATEWAY_PORT=8080 mcp-gateway

# Set storage directory
MCP_GATEWAY_STORAGE_DIR=~/gateway mcp-gateway

# Set custom auth token
MCP_GATEWAY_TOKEN=my-secret-token mcp-gateway
```

## Configuration Precedence

Options are applied in this order (highest to lowest priority):

1. Command-line flags
2. Environment variables
3. Default values

**Example:**

```bash
# Port will be 9000 (CLI flag wins)
MCP_GATEWAY_PORT=8080 mcp-gateway --port 9000
```

## Next Steps

- [**Storage**](/mcp-gateway/configuration/storage) - Understand data storage
- [**Authentication**](/mcp-gateway/concepts/authentication) - Token configuration
- [**Getting Started**](/mcp-gateway/getting-started) - Quick setup guide


