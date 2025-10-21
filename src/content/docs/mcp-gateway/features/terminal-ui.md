---
title: Terminal UI
description: Keyboard shortcuts and TUI features
---

The Terminal UI (TUI) provides a fast, keyboard-driven interface for managing MCP servers and viewing activity logs.

## Keyboard Shortcuts

### Global

| Key | Action |
|-----|--------|
| `/` | Open command menu |
| `q` | Quit application |
| `ESC` | Go back / Close modal |
| `h` | Help & Setup Guide |

### Navigation

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate up/down in lists |
| `←` `→` | Navigate left/right (where applicable) |
| `Enter` | Select / View details |
| `Tab` | Move between input fields |

### Views

| Key | Action |
|-----|--------|
| `v` | View Activity Log |
| `m` | Manage Servers |
| `a` | Add New Server |
| `c` | Clear Activity Logs (view only) |

## Command Menu

Press `/` to open the command menu:

```
┌─ Command Menu ──────────────────┐
│                                  │
│  v  View Activity Log            │
│  m  Manage Servers               │
│  a  Add New Server               │
│  c  Clear Activity Logs          │
│  h  Help & Setup Guide           │
│  q  Quit                         │
│                                  │
└──────────────────────────────────┘
```

Navigate with arrow keys and press `Enter` to select.

## Activity Log View

Press `v` to view the activity log.

### Features

- **Real-time updates**: See requests as they happen
- **Filtering**: Press `/` to filter by keyword
- **Details**: Press `Enter` to view full request/response
- **Auto-scroll**: Automatically scrolls to show newest entries

### Layout

```
┌─ Activity Log ────────────────────────────────────┐
│ Filter: [______________]                          │
├───────────────────────────────────────────────────┤
│ Time      Server          Method         Duration │
├───────────────────────────────────────────────────┤
│ ● 15:30:45  github-server  tools/list      45ms   │
│ ● 15:30:50  weather-server query           120ms  │
│ ● 15:30:55  github-server  tools/call      89ms   │
│ ● 15:31:00  database-server query          234ms  │
│                                                    │
│ ↑↓ Navigate  Enter: Details  /: Filter  ESC: Back │
└────────────────────────────────────────────────────┘
```

### Filtering

1. Press `/` while in Activity Log
2. Type your search term
3. Press `Enter` to apply
4. Press `ESC` to clear filter

**Example filters:**
- `github` - Show only github-server logs
- `tools/list` - Show only tools/list method calls
- `error` - Show only errors

### Viewing Details

1. Navigate to an entry with arrow keys
2. Press `Enter` to view details

```
┌─ Request Details ─────────────────────────────────┐
│                                                    │
│ Time: 2025-01-20 15:30:45                        │
│ Server: github-server                            │
│ Method: tools/list                               │
│ Duration: 45ms                                   │
│ Status: Success                                  │
│                                                   │
│ Request:                                         │
│ {                                                │
│   "params": {}                                   │
│ }                                                │
│                                                   │
│ Response:                                        │
│ {                                                │
│   "tools": [                                     │
│     {                                            │
│       "name": "create_issue",                    │
│       "description": "Create a GitHub issue"     │
│     }                                            │
│   ]                                              │
│ }                                                │
│                                                   │
│ Press ESC to close                               │
└───────────────────────────────────────────────────┘
```

### Clearing the View

Press `c` to clear the current view:
- Clears the display buffer
- Does **not** delete log files
- Useful for reducing clutter

## Server Management View

Press `m` to manage servers.

### Features

- View all configured servers
- See connection status
- Navigate to add/remove servers
- Monitor server health

### Layout

```
┌─ Server Management ────────────────────────────────┐
│                                                    │
│ Name            URL                      Status    │
├────────────────────────────────────────────────────┤
│ ● github-server   http://localhost:3000   Connected │
│ ○ weather-server  http://localhost:4000   Disconn. │
│ ● database-server http://localhost:5000   Connected │
│                                                    │
│ ↑↓ Navigate  a: Add  d: Delete  Enter: Details    │
└────────────────────────────────────────────────────┘
```

### Status Indicators

- `●` (green) - Connected
- `○` (gray) - Disconnected
- `×` (red) - Error

### Actions

- `a` - Add new server
- `d` - Delete selected server (with confirmation)
- `Enter` - View server details

## Add Server Dialog

Press `a` to add a new server.

```
┌─ Add MCP Server ──────────────────────┐
│                                        │
│ Name:                                  │
│ ┌────────────────────────────────────┐ │
│ │ my-server                          │ │
│ └────────────────────────────────────┘ │
│                                        │
│ URL:                                   │
│ ┌────────────────────────────────────┐ │
│ │ http://localhost:3000/mcp          │ │
│ └────────────────────────────────────┘ │
│                                        │
│        [Cancel]        [Add]           │
└────────────────────────────────────────┘
```

### Input Validation

- **Name**: Must be unique, alphanumeric with hyphens/underscores
- **URL**: Must be valid HTTP/HTTPS URL

### Keyboard Navigation

- `Tab` - Move between fields
- `Enter` - Submit (when on Add button)
- `ESC` - Cancel

## Help View

Press `h` to view help and setup information.

```
┌─ Help & Setup Guide ──────────────────────────────┐
│                                                    │
│ Keyboard Shortcuts:                               │
│   / - Command Menu                                │
│   v - View Activity Log                           │
│   m - Manage Servers                              │
│   a - Add New Server                              │
│   c - Clear Activity Logs                         │
│   h - Help                                        │
│   q - Quit                                        │
│                                                    │
│ Getting Started:                                  │
│   1. Press 'a' to add your first MCP server      │
│   2. Enter server name and URL                   │
│   3. Press 'v' to view activity                  │
│                                                    │
│ Web UI: http://localhost:3333/ui                  │
│                                                    │
│ Press ESC to close                                │
└────────────────────────────────────────────────────┘
```

## Terminal Compatibility

### Recommended Terminals

**macOS:**
- iTerm2 (recommended)
- Alacritty
- Terminal.app

**Linux:**
- Alacritty (recommended)
- kitty
- gnome-terminal
- konsole

**Windows:**
- Windows Terminal (recommended)
- Alacritty

### Requirements

- ANSI escape code support
- UTF-8 encoding
- Minimum 80x24 characters
- Recommended 120x30+ for best experience

### Troubleshooting Display Issues

**Garbled text or overlapping elements:**

1. Ensure terminal supports ANSI codes
2. Try resizing the terminal window
3. Check UTF-8 encoding is enabled
4. Update terminal emulator to latest version

**Colors not displaying:**

1. Check terminal color support
2. Enable 256-color mode
3. Try a different terminal emulator

## Tips and Tricks

### Quick Navigation

- Use `/` to quickly jump to any command
- Use `v` → `/` to filter logs without opening the menu

### Multiple Windows

Run multiple instances in different terminals:

```bash
# Terminal 1
mcp-gateway --port 3333 --storage-dir ~/.gateway-1

# Terminal 2
mcp-gateway --port 3334 --storage-dir ~/.gateway-2
```

### Background Mode

Run TUI in one terminal, use another for work:

```bash
# Terminal 1: Gateway TUI
mcp-gateway

# Terminal 2: Development work
cd my-project && npm run dev
```

## Next Steps

- [**Web Interface**](/mcp-gateway/features/web-interface) - Explore the Web UI
- [**CLI Options**](/mcp-gateway/features/cli-options) - Configure the gateway
- [**Activity Logging**](/mcp-gateway/core-concepts/activity-logging) - Understand logging
