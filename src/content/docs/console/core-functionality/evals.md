---
title: Evals
description: Create evaluations for an MCP server
next: false
---

MCP evaluations (evals) provide a way to test MCP server functionality and behavior. Define scenarios in which the server will be used, add in a scorer to grade how well the server was used, and validate that the server works as it should before it's deployed.

Evals look like tests, but they have more to offer than tests. Tests are solely "defensive," they help ensure updates don't break existing functionality. Evals, however, are also "offensive." They establish a basline to improve upon, allowing MCP server developers to verify that their changes made the server _better_.

## Scenarios

Each scenario requires a name and an input (prompt). 

You attach a scorer (see [scorer section](#scorers)) to the scenario, to define what a successful run looks like. 

When a scenario runs, the input is sent to an MCP client that has access to your MCP server. The client will then begin to call tools (or not!) in response to the prompt.

After the run completes, the scorer assigns the run a value between 0 and 1, and you can inspect the result to see what worked (and what didn't work).

## Runs

The Runs tab provides access to all previously executed evals. Each scenario run displays:

- Score
- Tools called
- Full transcript of the run
- Cost

### Limits

You may execute up to 100 scenario runs per day.

## Scorers

Scorers appear in the Scorers section in the left sidebar. 

When no custom scorer exists, scenarios use the default scorer, which simply checks if a tool or list of tools were called during the run.

Custom scorers require a name and optional description. Two scorer types are available:

### Code Scorers

Code scorers implement custom JavaScript functions that programmatically evaluate scenario outcomes and return numeric scores between 0 and 1. This approach enables deterministic, rule-based evaluation where correctness is easy to compute.

#### When to use Code scorers

- **Exact matching**: Verifying specific tool calls were made with correct parameters
- **Pattern matching**: Using regex or string operations to verify content
- **Logical conditions**: Implementing if/else rules based on multiple criteria

#### Function signature

```javascript
async ({ input, expected, output }) => {
  // Your scorer logic here
  // Return a number between 0 and 1
  return 0.5;
};
```

**Note:** `console.log()` information will be displayed in the scenario run details panel.

#### Parameters:

- `input`: The user's input/prompt that initiated the scenario
- `expected`: The expected outcome defined in the scenario configuration
- `output`: The actual output from the agent/MCP server interaction

The `output` parameter contains a transcript of what the MCP client did after prompted with the `input`.

The type definition is reproduced below. Note that this data structure accounts for tools invoked with "[code mode](https://blog.cloudflare.com/code-mode/)", which is a soon-to-be released feature for running evals.

```ts
type ScorerOutput = {
  text: string;
  transcript: TranscriptData;
  toolCalls: EvalToolCall[];
  allToolCalls: EvalToolCall[];
}

export type TranscriptData = {
  prompt: string;
  steps: Array<{
    text?: string;
    finishReason?: string;
    toolCalls?: Array<{
      toolName: string;
      args: Record<string, unknown>;
    }>;
    toolResults?: Array<{
      toolName: string;
      result: unknown;
    }>;
  }>;
  finalText?: string;
};

/**
 * Represents a single tool call recorded during an evaluation run
 */
export interface EvalToolCall {
  toolName: string;
  args: unknown;
  result: unknown;
  timestamp: number;
  /** Nested tool calls made within this call (e.g., MCP tools called inside code mode) */
  nestedCalls?: EvalToolCall[];
}
```

#### Return value

A code scorer is a function that must return a number between 0 and 1:

- `1.0` = perfect/correct outcome
- `0.0` = completely incorrect outcome
- Values in between = partial correctness

By default, any score below `0.7` will be considered a "failure". This will be configurable in the future.

#### AI-generated code

The code input field includes a magic wand icon in the upper-right corner. This icon triggers AI generation of scorer code from natural language descriptions of the scoring logic. The AI converts evaluation criteria described in plain text into the corresponding JavaScript function.

**Example scorer description**:

```text
Verify get_weather tool call execution. Score 0 when tool not called. When called, validate latitude parameter range (-90 to 90) and longitude parameter range (-180 to 180). Score 1 when both coordinates valid, otherwise 0.
```

#### Examples

**Example: Validating tool call parameters**

```javascript
async ({
  input,
  output: { text, transcript, toolCalls, allToolCalls },
  expected,
}) => {
  // Check if get_weather tool was called
  const weatherCalls = allToolCalls.filter(
    (tc) => tc.toolName === "get_weather"
  );

  if (weatherCalls.length === 0) {
    return 0;
  }

  // Validate coordinates in the first weather call
  const weatherCall = weatherCalls[0];
  const args = weatherCall.args || {};

  const latitude = args.latitude;
  const longitude = args.longitude;

  // Check if latitude is a number between -90 and 90
  const validLatitude =
    typeof latitude === "number" && latitude >= -90 && latitude <= 90;

  // Check if longitude is a number between -180 and 180
  const validLongitude =
    typeof longitude === "number" && longitude >= -180 && longitude <= 180;

  // Return 1 if both are valid, 0 otherwise
  return validLatitude && validLongitude ? 1 : 0;
};
```

### LLM

LLM-as-judge scoring delegates evaluation to a language model that analyzes conversation transcripts and outputs. This approach handles cases where programmatic evaluation proves insufficient or impractical.

#### When to use LLM scoring

- **Qualitative assessment**: Evaluating how well tools were used in tandem to achieve a task
- **Behavioral patterns**: Detecting whether the agent asks clarifying questions when appropriate (typically based off of tool descriptions)
- **Negative cases**: Confirming tool calls were correctly avoided when unnecessary

#### System prompt

The system prompt defines evaluation criteria and instructs the LLM judge on scenario outcome assessment. 

When invoked, the LLM-as-judge will receive the full transcript of the scenario run, including agent responses and tool calls.

#### Scoring labels

Scoring labels define discrete categories the LLM judge selects from, with each label mapping to a numeric score between 0 and 1. This structured approach mitigates known LLM biases toward specific numbers and ensures consistent evaluation.

#### Example

**Scenario: Tool call restraint validation**

Validates that MCP server tools remain uncalled when requests lack required parameters.

Test case: "Book me a flight to Paris" (missing: departure city, dates, passenger count)
Expected: No booking tools called

**System prompt:**

```
Evaluate tool call behavior during the conversation.

Request lacks critical information required for tool execution.
Correct behavior: No tools called.
Incorrect behavior: Tools called despite insufficient information.

Scoring:
- GOOD: Agent correctly refrained
- BAD: Agent incorrectly attempted execution with incomplete data
```

This prompt could be coupled with labels:

- `GOOD` | `1`
- `BAD`  | `0`
