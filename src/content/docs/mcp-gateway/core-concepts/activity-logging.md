---
title: Activity Logging
description: Track and inspect MCP requests and responses
---

MCP Gateway captures all traffic flowing through the proxy, providing detailed logs for debugging and monitoring.

## What Gets Logged

### Request Data

For each request, the gateway logs:
- **Timestamp**: When the request was received
- **Server**: Which MCP server handled the request
- **Method**: The MCP method called
- **Parameters**: Request parameters (sanitized if needed)
- **Headers**: HTTP headers

### Response Data

For each response, the gateway logs:
- **Status**: Success or error
- **Result**: The response payload
- **Duration**: How long the request took
- **Size**: Response size in bytes

### Example Log Entry

```jsonl
{
  "timestamp": "2025-01-20T15:30:45.123Z",
  "server": "github-server",
  "method": "tools/list",
  "params": {},
  "response": {
    "tools": [
      { "name": "create_issue", "description": "..." }
    ]
  },
  "duration_ms": 45,
  "status": "success"
}
```

## Log Storage

### Storage Location

Logs are stored in `~/.mcp-gateway/captures/`:

```
~/.mcp-gateway/
├── mcp.json              # Server registry
└── captures/
    ├── github-server/
    │   ├── 2025-01-20.jsonl
    │   └── 2025-01-21.jsonl
    └── weather-server/
        └── 2025-01-20.jsonl
```

### Log Format

Logs are stored as **JSON Lines (JSONL)**:
- One JSON object per line
- Easy to parse and process
- Efficient for streaming

### Log Rotation

- Logs are organized by server and date
- Each day creates a new log file
- Old logs are retained based on storage settings

## Inspecting Logs

### Via Terminal UI

Press `v` to open the Activity Log viewer:

- **Navigation**: Use arrow keys to scroll
- **Filter**: Press `/` to search
- **Details**: Press Enter to view full request/response
- **Clear**: Press `c` to clear the current view (doesn't delete files)

### Via Web UI

Navigate to a server in the Web UI:

1. Select a server from the dashboard
2. View the activity log in the sidebar
3. Click on entries to see details
4. Use filters to narrow down results

### Via Command Line

Logs are plain JSON Lines files, so you can use standard tools:

```bash
# View today's logs for a server
cat ~/.mcp-gateway/captures/github-server/$(date +%Y-%m-%d).jsonl

# Pretty-print logs
cat ~/.mcp-gateway/captures/github-server/*.jsonl | jq '.'

# Filter by method
cat ~/.mcp-gateway/captures/github-server/*.jsonl | jq 'select(.method == "tools/list")'

# Count requests per method
cat ~/.mcp-gateway/captures/github-server/*.jsonl | jq -r '.method' | sort | uniq -c
```

## Filtering and Searching

### Terminal UI Filters

In the Activity Log (`v`):
- `/`: Open search
- Type to filter by any field
- ESC to clear filter

### Web UI Filters

Use the filter controls to:
- Filter by date range
- Filter by server
- Filter by method
- Filter by status (success/error)
- Search in request/response data

## Log Retention

### Default Retention

By default, logs are kept indefinitely. You can manually clean up old logs:

```bash
# Remove logs older than 30 days
find ~/.mcp-gateway/captures -name "*.jsonl" -mtime +30 -delete
```

### Custom Retention

Set up a cron job for automatic cleanup:

```bash
# Add to crontab: clean up logs older than 30 days daily
0 2 * * * find ~/.mcp-gateway/captures -name "*.jsonl" -mtime +30 -delete
```

## Privacy and Security

### Sensitive Data

The gateway logs all request and response data. If your MCP servers handle sensitive information:

- Avoid logging in production environments
- Implement log sanitization
- Restrict access to the storage directory
- Use encryption for log files

### Log Access

Protect log files with appropriate permissions:

```bash
# Restrict access to logs
chmod 700 ~/.mcp-gateway
chmod 600 ~/.mcp-gateway/captures/**/*.jsonl
```

## Performance Considerations

### Log Volume

High-traffic servers generate large log files. Monitor disk usage:

```bash
# Check log storage size
du -sh ~/.mcp-gateway/captures
```

### Impact on Gateway

Logging has minimal performance impact:
- Logs written asynchronously
- Buffered writes for efficiency
- No impact on request/response latency

## Use Cases

### Debugging

Inspect failed requests:

```bash
# Find all errors
cat ~/.mcp-gateway/captures/*/*.jsonl | jq 'select(.status == "error")'
```

### Performance Analysis

Analyze request durations:

```bash
# Average response time
cat ~/.mcp-gateway/captures/my-server/*.jsonl | \
  jq '.duration_ms' | \
  awk '{sum+=$1; count++} END {print sum/count}'
```

### Usage Monitoring

Track API usage:

```bash
# Requests per hour
cat ~/.mcp-gateway/captures/my-server/*.jsonl | \
  jq -r '.timestamp' | \
  cut -d: -f1 | \
  sort | uniq -c
```

### Replay and Testing

Use captured logs to replay requests for testing:

```bash
# Extract a request
cat ~/.mcp-gateway/captures/my-server/*.jsonl | \
  jq 'select(.method == "tools/list") | .params' | \
  head -1
```

## Next Steps

- [**Interfaces**](/mcp-gateway/core-concepts/interfaces) - Learn about TUI and Web UI
- [**Storage & Registry**](/mcp-gateway/features/storage) - Understand data persistence
- [**Debugging**](/mcp-gateway/development/debugging) - Advanced debugging techniques
