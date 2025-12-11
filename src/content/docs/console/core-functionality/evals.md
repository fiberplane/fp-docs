---
title: Evals
description: Create evaluations for an MCP server
next: false
---

MCP evaluations (evals) provide systematic testing of MCP server functionality and behavior. By defining scenarios and scorers, evals validate that servers respond correctly to various inputs, maintain consistent behavior across updates, and meet quality standards before deployment.

Evals are essential for:

- **Quality Assurance**: Verify MCP servers produce expected outputs for defined scenarios
- **Regression Testing**: Ensure updates don't break existing functionality
- **Performance Benchmarking**: Compare different server implementations or versions
- **Behavioral Validation**: Test edge cases and error handling

Whether building custom MCP servers or validating external integrations, evals provide confidence that tools behave as intended within AI agent workflows.

## Scenarios

- Each scenario requires a name and input prompt.
- Scorers available: custom defined scorers (see [scorer section](#scorers)) or the default scorer that evaluates tool call execution.
- Mocking tool calls to the server is supported for scenario execution.

## Runs

The Runs tab provides access to all previously executed evals. Each scenario run displays:

- Score
- Tools called
- Execution steps
- Full transcript
- Cost

### Limits

100 scenario runs per day per user

## Scorers

Scorers appear in the Scorers section in the right sidebar. When no custom scorer exists, scenarios use the default scorer, which validates that the expected tools are called.

Custom scorers require a name and optional description. Two scorer types are available:

### Code

Code scorers implement custom JavaScript/TypeScript functions that programmatically evaluate scenario outcomes and return numeric scores between 0 and 1. This approach enables deterministic, rule-based evaluation where correctness can be computed algorithmically.

#### When to use Code scorers

- **Exact matching**: Verifying specific tool calls were made with correct parameters
- **Format validation**: Checking output structure, data types, or schema compliance
- **Numeric comparisons**: Validating calculations, thresholds, or ranges
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

#### Return value

The function must return a number between 0 and 1:

- `1.0` = perfect/correct outcome
- `0.0` = completely incorrect outcome
- Values in between = partial correctness

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

- **Qualitative assessment**: Evaluating response helpfulness, tone, or appropriateness
- **Semantic validation**: Verifying content accuracy beyond exact string matching
- **Complex reasoning**: Assessing multi-step logic or explanation quality
- **Behavioral patterns**: Detecting whether the agent asks clarifying questions when appropriate
- **Negative cases**: Confirming tool calls were correctly avoided when unnecessary

#### System prompt

The system prompt defines evaluation criteria and instructs the LLM judge on scenario outcome assessment. The prompt receives full conversation context, including agent responses and tool calls.

#### Scoring labels

Scoring labels define discrete categories the LLM judge selects from, with each label mapping to a numeric score between 0 and 1. This structured approach mitigates known LLM biases toward specific numbers and ensures consistent evaluation.

**Label configuration:**

- Each label requires a name and numeric value in the range [0, 1]
- Research demonstrates higher reliability compared to direct numeric scoring

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
- No tool calls present: Agent correctly refrained
- Tool calls present: Agent incorrectly attempted execution with incomplete data
```
