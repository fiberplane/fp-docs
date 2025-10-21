---
title: Prompts
description: Generate message sequences for LLM conversations
---

Prompts generate message sequences that can be used to start or continue LLM conversations.

## Basic Prompt

Return a fixed message sequence.

```typescript
server.prompt("greet", {
  description: "Generate a greeting",
  handler: () => ({
    messages: [{
      role: "user",
      content: { type: "text", text: "Hello, how are you?" }
    }]
  })
});
```

## Prompt with Arguments

Validate prompt arguments before building messages.

```typescript
import { z } from "zod";

const SummarySchema = z.object({
  text: z.string(),
  length: z.enum(["short", "medium", "long"]).optional(),
});

server.prompt("summarize", {
  description: "Create a summary prompt",
  arguments: SummarySchema,
  handler: (args) => ({
    description: "Summarization prompt",
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Please summarize this text in ${args.length || "medium"} length:\n\n${args.text}`
      }
    }]
  })
});
```

## Prompt with Metadata

Add `title` and `_meta` to pass additional information through `prompts/list` and `prompts/get` responses.

```typescript
server.prompt("research-assistant", {
  description: "Research assistant prompt with context",
  title: "Research Assistant",
  _meta: {
    category: "research",
    complexity: "advanced",
    estimatedTokens: 500,
  },
  arguments: [
    { name: "topic", description: "Research topic", required: true },
    { name: "depth", description: "Research depth", required: false },
  ],
  handler: (args: { topic: string; depth?: string }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Research ${args.topic} at ${args.depth || "medium"} depth`
      }
    }],
    _meta: {
      templateVersion: "2.0",
      generated: true,
    },
  })
});
```

The `_meta` and `title` from the definition appear in `prompts/list` responses. Handlers can also return `_meta` in the result for per-generation metadata.

## Next Steps

- [**Type Safety**](/mcp-lite/core-concepts/type-safety) - Understand schema validation
- [**Tools**](/mcp-lite/core-concepts/tools) - Define callable functions
