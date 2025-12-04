---
title: CLI
description: Command-line options and environment variables
---

```bash
mcp-gateway [options]
```

| Flag            | Environment Variable      | Default          | Description       |
| --------------- | ------------------------- | ---------------- | ----------------- |
| `--port`        | `MCP_GATEWAY_PORT`        | `3333`           | HTTP server port  |
| `--storage-dir` | `MCP_GATEWAY_STORAGE_DIR` | `~/.mcp-gateway` | Storage directory |
| N/A             | `MCP_GATEWAY_TOKEN`       | (auto-generated) | Auth token        |
| `--help`        |                           |                  | Show help         |
| `--version`     |                           |                  | Show version      |

```bash
# Examples
mcp-gateway --port 8080
MCP_GATEWAY_TOKEN=my-secret-token mcp-gateway
DEBUG=* mcp-gateway  # Enable debug logging
```

CLI flags override environment variables.

