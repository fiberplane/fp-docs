---
title: Storage
description: Data persistence and file organization
---

MCP Gateway stores server configuration and captured traffic locally using SQLite and JSON files.

## Storage Location

Files are stored under `~/.mcp-gateway/`:

```
~/.mcp-gateway/
├── mcp.json     # Server registry
├── logs.db      # SQLite traffic logs
└── logs.db-*    # SQLite files
```

### Default Directory

```
~/.mcp-gateway/
```

### Custom Directory

```bash
mcp-gateway --storage-dir /custom/path
```

Or via environment variable:

```bash
MCP_GATEWAY_STORAGE_DIR=/custom/path mcp-gateway
```

## Directory Structure

```
~/.mcp-gateway/
├── mcp.json          # Server registry
└── gateway.db        # SQLite database (captured traffic)
```

## Server Registry

### File: `mcp.json`

The registry stores server configurations in JSON format.

### Format

```json
{
  "servers": [
    {
      "name": "github-server",
      "url": "http://localhost:3000/mcp",
      "headers": {}
    },
    {
      "name": "weather-api",
      "url": "http://localhost:4000/mcp",
      "headers": {
        "Authorization": "Bearer token123"
      }
    }
  ]
}
```

### Manual Editing

You can manually edit `mcp.json`:

```bash
# Edit registry
nano ~/.mcp-gateway/mcp.json

# Restart gateway to apply changes
mcp-gateway
```

**Caution**: Invalid JSON will prevent the gateway from starting.

### Backup

```bash
# Backup registry
cp ~/.mcp-gateway/mcp.json ~/.mcp-gateway/mcp.json.backup

# Restore from backup
cp ~/.mcp-gateway/mcp.json.backup ~/.mcp-gateway/mcp.json
```

## Captured Traffic (SQLite)

### Database: `gateway.db`

All captured MCP traffic is stored in a SQLite database for efficient querying and filtering.

### Querying Directly

You can query the database directly if needed:

```bash
sqlite3 ~/.mcp-gateway/gateway.db

# List tables
.tables

# Query recent logs
SELECT * FROM logs ORDER BY timestamp DESC LIMIT 10;
```

### Data Retention

By default, logs are kept indefinitely. Clean up via:

**Web UI:** Use the "Clear Sessions" functionality

**REST API:**

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3333/api/logs/clear?before=2025-01-01T00:00:00Z"
```

**Manual:**

```bash
# Delete and recreate database
rm ~/.mcp-gateway/gateway.db
mcp-gateway
```

## Next Steps

- [**CLI**](/mcp-gateway/configuration/cli) - Configure storage location
- [**Proxy**](/mcp-gateway/concepts/proxy) - How traffic is captured
- [**Web UI**](/mcp-gateway/interfaces/web-ui) - View captured traffic
