# Copyable question templates

These are documentation templates only. Do **not** save this Markdown file as a question. Create one JSON file per lesson under `questions/`, for example `questions/ds-11.question.json`.

## Ready template — use only after the adapter and renderer exist

```json
{
  "templateVersion": 1,
  "id": "DS-11",
  "order": 11,
  "status": "READY",
  "title": "Example ready question",
  "category": "ARRAYS",
  "difficulty": "EASY",
  "summary": "Explain the learner goal in one sentence.",
  "input": {
    "kind": "integer-array",
    "default": "[4, 1, 3]",
    "hint": "JSON array of integers"
  },
  "visual": {
    "adapter": "bubble-sort"
  },
  "code": {
    "starter": "class Solution {\n  public void solve(int[] values) {\n    // learner code\n  }\n}",
    "reference": "class Solution {\n  public void solve(int[] values) {\n    // canonical solution\n  }\n}"
  },
  "approach": {
    "explanation": "Describe the invariant and why the canonical solution is correct.",
    "time": "O(n²)",
    "space": "O(1)"
  }
}
```

## Planned template — use while the renderer is still being built

```json
{
  "templateVersion": 1,
  "id": "DS-12",
  "order": 12,
  "status": "PLANNED",
  "title": "Example graph question",
  "category": "GRAPHS",
  "difficulty": "MEDIUM",
  "summary": "Describe the goal in one sentence.",
  "input": {
    "kind": "adjacency-list",
    "default": "{\"graph\":{\"A\":[\"B\"],\"B\":[]},\"start\":\"A\"}",
    "hint": "JSON object: { graph: adjacency list, start: node id }"
  },
  "visual": {
    "family": "GRAPH",
    "renderer": "graph-traversal",
    "representation": "Node-link graph with active frontier, visited nodes, and traversal order.",
    "readiness": "PHASE_3"
  },
  "code": {
    "starter": "class Solution {\n  // learner scaffold\n}",
    "reference": "class Solution {\n  // reference solution\n}"
  },
  "approach": {
    "explanation": "Describe the graph invariant.",
    "time": "O(V + E)",
    "space": "O(V)"
  },
  "onCompileError": "SHOW_DISABLED"
}
```

## Compile visibility policy

- Omit `onCompileError` or set it to `SHOW_DISABLED` to show a parseable invalid template as a disabled library entry.
- Set `"onCompileError": "SKIP"` to keep an invalid template out of the library.
- Run `npm run questions:check` before handing off work.
