---
title: Protocol Versions
description: Understanding MCP protocol version negotiation and compatibility
---

`mcp-lite` supports multiple MCP protocol versions with automatic negotiation.

## Supported Versions

- **`2025-06-18`** (current) - Full feature set including elicitation and structured tool outputs
- **`2025-03-26`** (backward compatible) - Includes batch request support, optional protocol headers

During the `initialize` handshake, the server accepts the client's requested version if supported and echoes it back. The negotiated version is persisted per session and enforces version-specific behavior throughout the connection.

## Version-Specific Behavior

### Protocol Header Requirements

- **`2025-06-18`**: The `MCP-Protocol-Version` header is **required** on all non-initialize requests when using sessions
- **`2025-03-26`**: The `MCP-Protocol-Version` header is **optional** on non-initialize requests (if present, must match the negotiated version)

### Batch Requests

- **`2025-06-18`**: Batch requests (JSON array of requests) are **not supported** and will return an error
- **`2025-03-26`**: Batch requests are **supported** - send an array of JSON-RPC requests and receive an array of responses

### Client Capabilities

- **`2025-06-18`**: Clients may declare `elicitation` and `sampling` capabilities
- **`2025-03-26`**: Clients may declare `roots` and `sampling` capabilities

:::note
Server capabilities (`tools`, `prompts`, `resources`) are version-independent.
:::

## Version Negotiation Example

```typescript
// Client requests 2025-03-26
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-03-26",
    clientInfo: { name: "my-client", version: "1.0.0" },
    capabilities: {}
  }
};

// Server responds with the same version
const initResponse = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    protocolVersion: "2025-03-26",  // Echoed back
    serverInfo: { name: "my-server", version: "1.0.0" },
    capabilities: {
      tools: { listChanged: true }
      // Server capabilities are version-independent
    }
  }
};
```

## Unsupported Versions

If a client requests an unsupported version, the server returns an error with the list of supported versions:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "Unsupported protocol version. Server supports: 2025-03-26, 2025-06-18, client requested: 2024-01-01",
    "data": {
      "supportedVersions": ["2025-03-26", "2025-06-18"],
      "requestedVersion": "2024-01-01"
    }
  }
}
```

## Using Version Constants in Code

`mcp-lite` exports version constants as an object for clarity:

```typescript
import { SUPPORTED_MCP_PROTOCOL_VERSIONS } from "mcp-lite";

// Access specific versions
const version03_26 = SUPPORTED_MCP_PROTOCOL_VERSIONS.V2025_03_26; // "2025-03-26"
const version06_18 = SUPPORTED_MCP_PROTOCOL_VERSIONS.V2025_06_18; // "2025-06-18"

// Get all supported versions as an array
const allVersions = Object.values(SUPPORTED_MCP_PROTOCOL_VERSIONS);
```

## Further Reading

For more details on protocol changes, see the [MCP Specification Changelog](https://modelcontextprotocol.io/specification/2025-06-18/changelog).

## Next Steps

- [**Sessions**](/mcp-lite/features/sessions) - Understand session management
- [**Elicitation**](/mcp-lite/advanced/elicitation) - Use version-specific features
