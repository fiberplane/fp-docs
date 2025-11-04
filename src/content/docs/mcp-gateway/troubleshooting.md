---
title: Troubleshooting
description: Common issues and solutions
---

Solutions to common problems when using MCP Gateway.

## Installation Issues

### NPM Install Fails

**Symptom:** `npm install -g @fiberplane/mcp-gateway` fails

**Solutions:**
```bash
# Try with sudo (macOS/Linux)
sudo npm install -g @fiberplane/mcp-gateway

# Or use npx (no install)
npx @fiberplane/mcp-gateway

# Or use Bun instead
bun add -g @fiberplane/mcp-gateway
```

### Binary Not Found

**Symptom:** `mcp-gateway: command not found`

**Solutions:**
```bash
# Check npm global bin directory
npm config get prefix

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$PATH:$(npm config get prefix)/bin"

# Or use npx
npx @fiberplane/mcp-gateway
```

## Startup Issues

### Port Already in Use

**Symptom:** `EADDRINUSE: address already in use :::3333`

**Solutions:**
```bash
# Find process using port 3333
lsof -i :3333

# Kill the process
kill -9 <PID>

# Or use a different port
mcp-gateway --port 8080
```

### Storage Directory Permission Denied

**Symptom:** `EACCES: permission denied, mkdir '/var/lib/mcp-gateway'`

**Solutions:**
```bash
# Create directory with proper permissions
sudo mkdir -p /var/lib/mcp-gateway
sudo chown $USER:$USER /var/lib/mcp-gateway

# Or use user-writable directory
mcp-gateway --storage-dir ~/mcp-gateway
```

### Registry File Corrupted

**Symptom:** `SyntaxError: Unexpected token in JSON`

**Solutions:**
```bash
# Restore from backup
cp ~/.mcp-gateway/mcp.json.backup ~/.mcp-gateway/mcp.json

# Or recreate empty registry
echo '{"version":"1.0","servers":[]}' > ~/.mcp-gateway/mcp.json

# Restart gateway
mcp-gateway
```

## Connection Issues

### Cannot Connect to MCP Server

**Symptom:** "Failed to connect to server" in TUI/Web UI

**Solutions:**

1. **Verify server is running:**
   ```bash
   curl http://localhost:3000/mcp
   ```

2. **Check server URL is correct:**
   - Ensure protocol (http/https)
   - Verify port number
   - Check path (/mcp)

3. **Test from gateway's perspective:**
   ```bash
   # From same machine as gateway
   curl http://localhost:3000/mcp
   ```

4. **Check for CORS issues:**
   - MCP servers must allow gateway's origin
   - Check server CORS configuration

5. **Review server logs:**
   - Look for connection errors
   - Check for auth requirements

### Server Shows Disconnected

**Symptom:** Server status shows "Disconnected" in UI

**Solutions:**

1. **Check network connectivity:**
   ```bash
   ping <server-host>
   ```

2. **Verify server is still running:**
   ```bash
   curl <server-url>
   ```

3. **Check gateway logs:**
   Press `v` in TUI or view Web UI logs for connection errors

4. **Restart gateway:**
   Sometimes a restart resolves transient issues

### Timeout Errors

**Symptom:** "Request timeout" errors

**Solutions:**

1. **Check server response time:**
   ```bash
   time curl http://localhost:3000/mcp
   ```

2. **Increase timeout** (if configurable in future versions)

3. **Check server performance:**
   - High load?
   - Resource constraints?

## UI Issues

### TUI Display Issues

**Symptom:** Garbled text, overlapping elements, incorrect colors

**Solutions:**

1. **Check terminal compatibility:**
   - Use iTerm2, Alacritty, or Windows Terminal
   - Ensure ANSI escape code support

2. **Resize terminal window:**
   - Minimum 80x24 characters
   - Recommended 120x30+

3. **Check UTF-8 encoding:**
   ```bash
   echo $LANG
   # Should show UTF-8, e.g., en_US.UTF-8
   ```

4. **Try different terminal:**
   ```bash
   # macOS
   open -a iTerm

   # Linux
   alacritty
   ```

5. **Update terminal emulator** to latest version

### Web UI Shows 404

**Symptom:** Visiting `http://localhost:3333/ui` shows "404 Not Found"

**Solutions:**

1. **Verify gateway is running:**
   ```bash
   curl http://localhost:3333/api/health
   ```

2. **Check correct port:**
   ```bash
   # If using custom port
   curl http://localhost:8080/api/health
   ```

3. **Rebuild Web UI** (development):
   ```bash
   cd packages/web
   bun run build
   cp -r public ../cli/public
   ```

### Web UI Shows Stale Data

**Symptom:** Web UI doesn't reflect recent changes

**Solutions:**

1. **Hard refresh browser:**
   - macOS: `Cmd+Shift+R`
   - Windows/Linux: `Ctrl+Shift+R`

2. **Clear browser cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Firefox: Preferences → Privacy → Clear Data

3. **Check real-time updates:**
   - Ensure WebSocket connection is active
   - Check browser console for errors

4. **Restart gateway:**
   ```bash
   # Stop and restart
   mcp-gateway
   ```

## Performance Issues

### Slow Log Loading

**Symptom:** Activity log takes long to load

**Solutions:**

1. **Apply filters to reduce data:**
   - Filter by date range
   - Filter by server
   - Filter by method

2. **Clean up old logs:**
   ```bash
   find ~/.mcp-gateway/captures -name "*.jsonl" -mtime +30 -delete
   ```

3. **Check disk I/O:**
   ```bash
   iostat -x 1
   ```

4. **Move storage to faster disk** (SSD vs HDD)

### High Memory Usage

**Symptom:** Gateway consuming excessive RAM

**Solutions:**

1. **Check log buffer size:**
   - Large buffers consume more memory
   - Restart gateway to clear buffers

2. **Reduce active servers:**
   - Remove unused servers
   - Distribute servers across multiple gateways

3. **Monitor memory:**
   ```bash
   # macOS/Linux
   ps aux | grep mcp-gateway
   ```

### High CPU Usage

**Symptom:** Gateway using high CPU

**Solutions:**

1. **Check request volume:**
   - High traffic increases CPU usage
   - Review server activity

2. **Check for request loops:**
   - Server calling itself via gateway?
   - Review logs for patterns

3. **Update to latest version:**
   - Performance improvements in newer versions

## Log Issues

### Logs Not Being Captured

**Symptom:** No log files in `~/.mcp-gateway/captures/`

**Solutions:**

1. **Check storage directory:**
   ```bash
   ls -la ~/.mcp-gateway/captures
   ```

2. **Verify write permissions:**
   ```bash
   touch ~/.mcp-gateway/captures/test.txt
   rm ~/.mcp-gateway/captures/test.txt
   ```

3. **Check disk space:**
   ```bash
   df -h
   ```

4. **Review gateway logs** for write errors

### Corrupted Log Files

**Symptom:** Cannot parse log files, invalid JSON

**Solutions:**

1. **Validate JSON Lines:**
   ```bash
   cat ~/.mcp-gateway/captures/server/2025-01-20.jsonl | jq '.'
   ```

2. **Find corrupted lines:**
   ```bash
   cat file.jsonl | while read line; do
     echo "$line" | jq '.' >/dev/null 2>&1 || echo "Bad: $line"
   done
   ```

3. **Remove corrupted entries:**
   ```bash
   # Backup first!
   cp file.jsonl file.jsonl.backup

   # Filter valid JSON
   cat file.jsonl | while read line; do
     echo "$line" | jq '.' >/dev/null 2>&1 && echo "$line"
   done > file.jsonl.clean
   ```

## Server Management Issues

### Cannot Add Server

**Symptom:** Add server fails with validation error

**Solutions:**

1. **Check server name uniqueness:**
   - Name must be unique across all servers
   - Check `~/.mcp-gateway/mcp.json` for conflicts

2. **Verify URL format:**
   ```
   ✅ http://localhost:3000/mcp
   ✅ https://api.example.com/mcp
   ❌ localhost:3000
   ❌ http://localhost:3000 (missing /mcp path)
   ```

3. **Check special characters:**
   - Server name: alphanumeric, hyphens, underscores only
   - No spaces, no special chars

### Cannot Remove Server

**Symptom:** Delete server fails or server reappears

**Solutions:**

1. **Manually edit registry:**
   ```bash
   nano ~/.mcp-gateway/mcp.json
   # Remove server entry, save
   ```

2. **Restart gateway:**
   ```bash
   mcp-gateway
   ```

3. **Check file permissions:**
   ```bash
   ls -la ~/.mcp-gateway/mcp.json
   chmod 644 ~/.mcp-gateway/mcp.json
   ```

## Debug Techniques

### Enable Debug Logging

```bash
# Set DEBUG environment variable
DEBUG=* mcp-gateway
```

### Inspect Storage

```bash
# View registry
cat ~/.mcp-gateway/mcp.json | jq '.'

# List captures
ls -la ~/.mcp-gateway/captures/

# View recent logs
tail -f ~/.mcp-gateway/captures/my-server/$(date +%Y-%m-%d).jsonl
```

### Test MCP Server Connection

```bash
# Test with curl
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method":"tools/list","params":{}}'
```

### Check Gateway API

```bash
# Health check
curl http://localhost:3333/api/health

# List servers (if API supports)
curl http://localhost:3333/api/servers
```

## Getting Help

If you've tried the above and still have issues:

1. **Check GitHub Issues:**
   https://github.com/fiberplane/mcp-gateway/issues

2. **Create a Bug Report:**
   - Include OS and version
   - Gateway version (`mcp-gateway --version`)
   - Steps to reproduce
   - Error messages
   - Relevant logs

3. **Community Support:**
   - Discussions tab on GitHub
   - Fiberplane Discord/Slack

## Next Steps

- [**Development Debugging**](/mcp-gateway/development/debugging) - Advanced debugging
- [**CLI Options**](/mcp-gateway/features/cli-options) - Configuration options
- [**Storage & Registry**](/mcp-gateway/features/storage) - Understanding data storage
