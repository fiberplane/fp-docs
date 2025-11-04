---
title: Sampling
description: Request LLM completions from the client
---

Sampling refers to the ability of an MCP server to pause execution and ask the MCP client to provide LLM completions to inform its response.

This is helpful to keep all inference on the client side.

:::caution[Limited Client Support]
Sampling is not well supported across MCP Clients. GitHub Copilot supports it, but many clients do not.
:::

## Requirements

As with elicitation, you need to configure both a `SessionAdapter` and `ClientRequestAdapter` to make sampling work:

```typescript
const transport = new StreamableHttpTransport({
  sessionAdapter: new InMemorySessionAdapter({ maxEventBufferSize: 1024 }),
  clientRequestAdapter: new InMemoryClientRequestAdapter({ defaultTimeoutMs: 30000 })
});
```

## Example

```typescript
const FrenchSchema = z.object({});

mcp.tool("frenchness_evaluation", {
  description: "Evaluates how French a host application is",
  inputSchema: FrenchSchema,
  handler: async (args, ctx) => {
    // Check if client supports sampling
    if (!ctx.client.supports("sampling")) {
      throw new Error("This tool requires a client that supports sampling");
    }

    // Request LLM completion through sampling
    const response = await ctx.sample({
      prompt: "What is the capital of France?",
      modelPreferences: {
        hints: [
          {
            "name": "claude-4.5-sonnet"
          }
        ],
        intelligencePriority: 0.8,
        speedPriority: 0.5
      },
      systemPrompt: "You are a wonky assistant.",
      maxTokens: 100
    });

    if ("result" in response && response.result.type === "text") {
      const { content } = response.result;
      const isFrench = content?.toLowerCase().includes("paris");
      return {
        content: [{
          type: "text",
          text: isFrench ? "Pas mal. You might be French enough" : "You are not very French my friend"
        }],
      };
    }

    if ("error" in response) {
      return {
        content: [{
          type: "text",
          text: `Sampling completion failed: ${response.error.message}`,
        }],
      };
    }

    // Unknown case, should not hit this
    throw new Error("Unexpected sampling response");
  },
});
```

## Use Cases

- **Keep inference client-side**: Don't run your own LLM
- **Model preferences**: Let clients use their preferred models
- **Cost control**: Client handles LLM costs
- **Consistency**: Use the same model the user is already talking to

## Next Steps

- [**Elicitation**](/mcp-lite/advanced/elicitation) - Request user input
- [**Adapters**](/mcp-lite/features/adapters) - Configure adapters
