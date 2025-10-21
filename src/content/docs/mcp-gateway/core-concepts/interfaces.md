---
title: Interfaces
description: Terminal UI and Web UI for managing MCP Gateway
---

MCP Gateway provides two interfaces for managing servers and viewing logs: a Terminal UI (TUI) for keyboard-driven workflows and a Web UI for visual management.

## Terminal UI (TUI)

The Terminal UI runs in your console and provides fast, keyboard-driven access to all gateway features.

### Starting the TUI

```bash
# TUI starts by default
mcp-gateway

# Disable TUI (headless mode)
mcp-gateway --no-tui
```

### Navigation

Use keyboard shortcuts to navigate:

- `/` - Open command menu
- `q` - Quit application
- `ESC` - Go back / Close modal
- Arrow keys - Navigate lists
- Enter - Select / View details

### Main Views

#### Activity Log (`v`)

View real-time request/response activity:
- Scroll through recent events
- Filter by keyword
- View full request/response details
- Clear the current view

#### Server Management (`m`)

Manage MCP servers:
- View all configured servers
- See connection status
- Add new servers
- Remove servers

#### Help (`h`)

Access help and setup guide:
- Keyboard shortcuts reference
- Setup instructions
- Troubleshooting tips

### Command Menu (`/`)

Quick access to all commands:

```
/ - Command Menu
────────────────
v - View Activity Log
m - Manage Servers
a - Add New Server
c - Clear Activity Logs
h - Help & Setup Guide
q - Quit
```

### Adding Servers

Press `a` to add a server:

```
┌─ Add MCP Server ─────────────┐
│                               │
│ Name:     [____________]      │
│ URL:      [____________]      │
│                               │
│        [Cancel]  [Add]        │
└───────────────────────────────┘
```

### Activity Log View

```
┌─ Activity Log ───────────────────────────────┐
│ [Filter: ___________]                        │
├──────────────────────────────────────────────┤
│ ● 15:30:45  github-server  tools/list   45ms │
│ ● 15:30:50  weather-server  query       120ms│
│ ● 15:30:55  github-server  tools/call   89ms │
│                                              │
│ Press Enter to view details                  │
└──────────────────────────────────────────────┘
```

### Terminal Compatibility

Recommended terminals:
- **macOS**: iTerm2, Alacritty, Terminal.app
- **Linux**: Alacritty, kitty, gnome-terminal
- **Windows**: Windows Terminal, Alacritty

Requirements:
- ANSI escape code support
- UTF-8 encoding
- Minimum 80x24 character size

## Web UI

The Web UI provides a browser-based interface for visual server management and log inspection.

### Accessing the Web UI

```bash
# Default URL
http://localhost:3333/ui

# Custom port
http://localhost:8080/ui  # if using --port 8080
```

Or open automatically:

```bash
open http://localhost:3333/ui  # macOS
xdg-open http://localhost:3333/ui  # Linux
```

### Dashboard

The main dashboard shows:
- **Server List**: All configured MCP servers
- **Status Indicators**: Connection state for each server
- **Recent Activity**: Latest requests across all servers
- **Quick Actions**: Add/remove servers

### Server Management

Click on a server to:
- View detailed information
- See server-specific activity log
- Configure server settings
- Test connectivity
- Remove the server

### Activity Inspection

The activity view provides:
- **Timeline**: Chronological list of requests
- **Filters**: By server, method, date range, status
- **Search**: Full-text search in requests/responses
- **Details**: Click any entry to see full request/response

Example log entry view:

```
Request
────────
Method: tools/list
Server: github-server
Time: 2025-01-20 15:30:45

Response
────────
Status: Success
Duration: 45ms
Result:
{
  "tools": [
    {
      "name": "create_issue",
      "description": "Create a GitHub issue"
    }
  ]
}
```

### Adding Servers

Click "Add Server" button:

1. Enter server name
2. Enter server URL
3. Click "Add"
4. Server appears in the list

### Server Configuration

Click on a server card to configure:
- Edit server name
- Update server URL
- View connection history
- Remove server

## Choosing an Interface

### Use Terminal UI When:

- Working in a terminal-focused workflow
- Need keyboard-driven speed
- SSH into remote servers
- Limited screen space
- Prefer command-line tools

### Use Web UI When:

- Prefer visual interfaces
- Need to share view with others
- Want to keep logs visible while working
- Managing multiple servers visually
- Need detailed filtering and search

## Running Both Simultaneously

You can use both interfaces at the same time:

```bash
# Start gateway (TUI + Web UI)
mcp-gateway

# In your browser
open http://localhost:3333/ui
```

Both interfaces share the same data:
- Changes in TUI reflect in Web UI
- Web UI updates show in TUI
- Logs visible in both

## Headless Mode

Run without the TUI for background operation:

```bash
mcp-gateway --no-tui
```

Useful for:
- Docker containers
- systemd services
- CI/CD environments
- Production deployments

Access via Web UI only: `http://localhost:3333/ui`

## Next Steps

- [**Terminal UI Features**](/mcp-gateway/features/terminal-ui) - Master keyboard shortcuts
- [**Web Interface**](/mcp-gateway/features/web-interface) - Explore Web UI features
- [**CLI Options**](/mcp-gateway/features/cli-options) - Configure the gateway
