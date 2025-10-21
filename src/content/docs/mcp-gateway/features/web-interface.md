---
title: Web Interface
description: Browser-based UI for managing MCP Gateway
---

The Web UI provides a visual, browser-based interface for managing servers and inspecting activity logs.

## Accessing the Web UI

### Default URL

```
http://localhost:3333/ui
```

### Custom Port

If running with `--port`:

```bash
mcp-gateway --port 8080
# Access at: http://localhost:8080/ui
```

### Opening Automatically

```bash
# macOS
open http://localhost:3333/ui

# Linux
xdg-open http://localhost:3333/ui

# Windows
start http://localhost:3333/ui
```

## Dashboard

The main dashboard provides an overview of your MCP infrastructure.

### Server Cards

Each server is displayed as a card showing:
- **Server name**
- **URL**
- **Status** (Connected/Disconnected/Error)
- **Recent activity count**
- **Last request time**

### Quick Actions

- **Add Server**: Click to add a new MCP server
- **Refresh**: Reload server status
- **Settings**: Configure gateway settings

### Activity Summary

View recent activity across all servers:
- Total requests in last hour
- Error rate
- Average response time
- Active servers count

## Server Management

### Adding a Server

1. Click "Add Server" button
2. Fill in the form:
   ```
   Name: [my-server]
   URL: [http://localhost:3000/mcp]
   ```
3. Click "Add"
4. Server appears in the dashboard

### Viewing Server Details

Click on a server card to view:
- Full server configuration
- Connection status history
- Server-specific activity log
- Performance metrics

### Editing a Server

1. Click on a server card
2. Click "Edit" button
3. Update name or URL
4. Click "Save"

### Removing a Server

1. Click on a server card
2. Click "Remove Server"
3. Confirm deletion

**Note**: Removing a server does not delete its logs.

## Activity Log Browser

The activity log browser provides powerful tools for inspecting captured traffic.

### Accessing Logs

**All Servers:**
- Click "Activity" in the main navigation
- View combined logs from all servers

**Single Server:**
- Click on a server card
- View server-specific logs

### Log Entry Display

Each entry shows:
- **Timestamp**
- **Server name**
- **Method** (e.g., tools/list, query)
- **Duration** (in milliseconds)
- **Status** (Success/Error)

### Filtering

Use filters to narrow down logs:

**By Time:**
- Last hour
- Last 24 hours
- Last 7 days
- Custom range

**By Server:**
- Select one or more servers

**By Method:**
- tools/list
- tools/call
- resources/list
- Custom method

**By Status:**
- Success only
- Errors only
- All

### Search

Full-text search across:
- Request parameters
- Response data
- Error messages

```
Search: [create_issue]
```

### Viewing Details

Click on any log entry to see:

```
┌─────────────────────────────────────┐
│ Request Details                     │
├─────────────────────────────────────┤
│ Time: 2025-01-20 15:30:45          │
│ Server: github-server              │
│ Method: tools/call                 │
│ Duration: 89ms                     │
│ Status: Success                    │
│                                    │
│ Request:                           │
│ {                                  │
│   "name": "create_issue",          │
│   "arguments": {                   │
│     "title": "Bug report",         │
│     "body": "Description..."       │
│   }                                │
│ }                                  │
│                                    │
│ Response:                          │
│ {                                  │
│   "content": [                     │
│     {                              │
│       "type": "text",              │
│       "text": "Issue created: #42" │
│     }                              │
│   ]                                │
│ }                                  │
└─────────────────────────────────────┘
```

### Exporting Logs

Export filtered logs:

1. Apply desired filters
2. Click "Export"
3. Choose format:
   - JSON
   - CSV
   - JSON Lines

## Performance Monitoring

### Server Health

View server health metrics:
- Uptime
- Request count
- Error rate
- Average response time

### Request Timeline

Visual timeline of requests:
- Scatter plot of request times
- Color-coded by status
- Hover for details

### Response Time Distribution

Histogram showing:
- Response time ranges
- Request count per bucket
- Percentiles (p50, p95, p99)

## Settings

### Gateway Configuration

View and configure:
- Port number
- Storage directory
- Log retention settings

### UI Preferences

Customize the Web UI:
- Theme (Light/Dark/Auto)
- Refresh interval
- Items per page
- Timezone

## Real-Time Updates

The Web UI updates in real-time:
- New log entries appear automatically
- Server status changes reflect immediately
- Activity counts update live

No manual refresh needed!

## Browser Compatibility

Supported browsers:
- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

Recommended: Latest version of Chrome or Firefox

## Mobile Support

The Web UI is responsive and works on mobile devices:
- Phones: Basic server management and log viewing
- Tablets: Full feature set

Recommended for mobile:
- Use landscape orientation
- Minimum screen width: 375px

## Tips and Tricks

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `r` | Refresh servers |
| `a` | Add server |
| `ESC` | Close modal |

### Quick Filters

Save frequently used filter combinations:

1. Apply filters
2. Click "Save Filter"
3. Name your filter preset
4. Access from "Saved Filters" menu

### Bookmarking

Bookmark URLs with filters:

```
http://localhost:3333/ui/activity?server=github&status=error
```

Direct link to filtered view!

### Multi-Tab Workflow

Open multiple tabs:
- Tab 1: Dashboard (overview)
- Tab 2: Server A logs
- Tab 3: Server B logs

All tabs update in real-time.

## Development Mode

When running the gateway with Vite dev server:

```bash
# Terminal 1: Gateway
mcp-gateway

# Terminal 2: Vite dev server
cd packages/web && npm run dev
```

Access at `http://localhost:5173` for hot reload during development.

## Troubleshooting

### Stale Data

If the UI shows outdated information:

1. Hard refresh: `Cmd+Shift+R` (macOS) or `Ctrl+Shift+R` (Windows/Linux)
2. Clear browser cache
3. Check gateway is running
4. Restart the gateway

### UI Not Loading

**Symptoms:** 404 error at `/ui`

**Solutions:**
1. Verify gateway is running
2. Check the correct port
3. Ensure public folder exists (development builds)

### Slow Performance

If the UI is slow:
1. Reduce refresh interval in settings
2. Apply filters to reduce log count
3. Clear old logs
4. Check browser console for errors

## Next Steps

- [**Terminal UI**](/mcp-gateway/features/terminal-ui) - Learn keyboard shortcuts
- [**CLI Options**](/mcp-gateway/features/cli-options) - Configure the gateway
- [**Activity Logging**](/mcp-gateway/core-concepts/activity-logging) - Understand logging
