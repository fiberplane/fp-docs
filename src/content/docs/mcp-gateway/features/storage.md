---
title: Storage & Registry
description: Data persistence and file organization
---

MCP Gateway stores server configuration and captured logs in a local directory.

## Storage Location

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
├── mcp.json                 # Server registry
└── captures/                # Captured logs
    ├── github-server/
    │   ├── 2025-01-20.jsonl
    │   ├── 2025-01-21.jsonl
    │   └── 2025-01-22.jsonl
    ├── weather-server/
    │   └── 2025-01-20.jsonl
    └── database-server/
        └── 2025-01-20.jsonl
```

## Server Registry

### File: `mcp.json`

The registry stores server configurations.

### Format

```json
{
  "version": "1.0",
  "servers": [
    {
      "id": "github-server",
      "name": "GitHub Integration",
      "url": "http://localhost:3000/mcp",
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    },
    {
      "id": "weather-server",
      "name": "Weather Service",
      "url": "http://localhost:4000/mcp",
      "createdAt": "2025-01-20T11:00:00.000Z",
      "updatedAt": "2025-01-20T11:00:00.000Z"
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

## Capture Storage

### Organization

Logs are organized by server and date:

```
captures/
└── <server-name>/
    └── YYYY-MM-DD.jsonl
```

### File Format: JSON Lines

Each log file uses JSON Lines format:
- One JSON object per line
- Easy to parse and stream
- Append-only for performance

### Example Log File

```jsonl
{"timestamp":"2025-01-20T15:30:45.123Z","server":"github-server","method":"tools/list","params":{},"response":{"tools":[]},"duration_ms":45,"status":"success"}
{"timestamp":"2025-01-20T15:30:50.456Z","server":"github-server","method":"tools/call","params":{"name":"create_issue"},"response":{"content":[{"type":"text","text":"Issue created"}]},"duration_ms":89,"status":"success"}
```

### Log Rotation

- New file created each day
- No automatic cleanup (manual or scripted)
- Files can be deleted without affecting the gateway

## Data Persistence

### When Data is Written

**Registry (`mcp.json`):**
- When adding a server
- When removing a server
- When updating server configuration

**Captures:**
- After each request/response
- Buffered writes for performance
- Flushed on gateway shutdown

### Data Durability

- Registry updates are atomic (safe from crashes)
- Logs written asynchronously (small risk of loss on crash)
- No data loss on clean shutdown

## Disk Usage

### Monitoring

```bash
# Check total storage size
du -sh ~/.mcp-gateway

# Check captures size
du -sh ~/.mcp-gateway/captures

# Size by server
du -sh ~/.mcp-gateway/captures/*
```

### Example Sizes

Approximate disk usage:
- Registry: ~1-10 KB
- Logs: ~1-10 MB per day per high-traffic server

## Cleanup

### Manual Cleanup

```bash
# Remove old logs (older than 30 days)
find ~/.mcp-gateway/captures -name "*.jsonl" -mtime +30 -delete

# Remove all logs for a specific server
rm -rf ~/.mcp-gateway/captures/old-server
```

### Automated Cleanup

Create a cron job:

```bash
# Edit crontab
crontab -e

# Add daily cleanup at 2 AM
0 2 * * * find ~/.mcp-gateway/captures -name "*.jsonl" -mtime +30 -delete
```

### Cleanup Script

```bash
#!/bin/bash
# cleanup-gateway-logs.sh

STORAGE_DIR="${MCP_GATEWAY_STORAGE_DIR:-$HOME/.mcp-gateway}"
RETENTION_DAYS=30

find "$STORAGE_DIR/captures" \
  -name "*.jsonl" \
  -mtime +$RETENTION_DAYS \
  -delete

echo "Cleaned up logs older than $RETENTION_DAYS days"
```

## Migration

### Moving Storage Directory

```bash
# Stop gateway
# Move directory
mv ~/.mcp-gateway ~/new-location/.mcp-gateway

# Start with new location
mcp-gateway --storage-dir ~/new-location/.mcp-gateway
```

### Merging Registries

```bash
# Backup both registries
cp ~/.mcp-gateway-1/mcp.json mcp1.json
cp ~/.mcp-gateway-2/mcp.json mcp2.json

# Manually merge server arrays in a text editor
# Copy merged file to primary location
cp merged.json ~/.mcp-gateway/mcp.json
```

### Combining Logs

```bash
# Merge logs for the same server from different gateways
cat ~/.mcp-gateway-1/captures/my-server/*.jsonl \
    ~/.mcp-gateway-2/captures/my-server/*.jsonl \
    > combined.jsonl

# Sort by timestamp
cat combined.jsonl | jq -s 'sort_by(.timestamp)[]' > sorted.jsonl
```

## Backup and Restore

### Full Backup

```bash
# Backup entire storage directory
tar -czf mcp-gateway-backup-$(date +%Y%m%d).tar.gz ~/.mcp-gateway
```

### Restore from Backup

```bash
# Stop gateway
# Extract backup
tar -xzf mcp-gateway-backup-20250120.tar.gz -C ~/

# Start gateway
mcp-gateway
```

### Selective Backup

```bash
# Backup registry only
cp ~/.mcp-gateway/mcp.json mcp-backup.json

# Backup logs for specific server
tar -czf github-server-logs.tar.gz ~/.mcp-gateway/captures/github-server
```

## Security

### File Permissions

Protect sensitive data:

```bash
# Restrict directory access
chmod 700 ~/.mcp-gateway

# Restrict registry access
chmod 600 ~/.mcp-gateway/mcp.json

# Restrict logs
chmod 600 ~/.mcp-gateway/captures/**/*.jsonl
```

### Encryption

For sensitive environments:

```bash
# Encrypt storage directory (macOS)
hdiutil create -size 100m -encryption -volname "MCP Gateway" \
  -fs HFS+J ~/mcp-gateway-encrypted.dmg

# Mount and use
hdiutil attach ~/mcp-gateway-encrypted.dmg
mcp-gateway --storage-dir /Volumes/MCP\ Gateway
```

### Git Ignore

If storage is in a project directory:

```gitignore
# .gitignore
.mcp-gateway/
*.jsonl
mcp.json
```

## Troubleshooting

### Registry Corrupted

**Symptoms:** Gateway won't start, JSON parse error

**Solution:**
```bash
# Restore from backup
cp ~/.mcp-gateway/mcp.json.backup ~/.mcp-gateway/mcp.json

# Or recreate empty registry
echo '{"version":"1.0","servers":[]}' > ~/.mcp-gateway/mcp.json
```

### Disk Full

**Symptoms:** ENOSPC error, logs not being written

**Solution:**
```bash
# Check disk space
df -h

# Clean up old logs
find ~/.mcp-gateway/captures -name "*.jsonl" -mtime +7 -delete

# Or move storage to larger disk
mv ~/.mcp-gateway /larger-disk/.mcp-gateway
mcp-gateway --storage-dir /larger-disk/.mcp-gateway
```

### Permission Denied

**Symptoms:** EACCES error

**Solution:**
```bash
# Fix permissions
chmod -R u+rw ~/.mcp-gateway

# Or use different directory
mcp-gateway --storage-dir ~/mcp-data
```

## Next Steps

- [**Activity Logging**](/mcp-gateway/core-concepts/activity-logging) - Understanding captured logs
- [**CLI Options**](/mcp-gateway/features/cli-options) - Configure storage location
- [**Debugging**](/mcp-gateway/development/debugging) - Inspect storage
