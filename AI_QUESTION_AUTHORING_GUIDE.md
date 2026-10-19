# VisuCode — AI question-authoring guide

Use this file as the operating brief for any AI or developer adding the remaining lessons. The goal is to add one independently valid question module without breaking compilation, the learner UI, or existing adapters.

## Non-negotiable rules

1. **Never edit `generated/questions.compiled.json` manually.** It is compiler output.
2. **One lesson equals one file:** `questions/ds-XX.question.json`.
3. Use a question’s actual problem ID; IDs must be unique and match `DS-01` format.
4. Preserve valid JSON. Use `npm run questions:check` before finishing.
5. Mark a question `READY` only when its listed `visual.adapter` has a working server trace adapter **and** matching frontend renderer.
6. Until then, use `PLANNED` and provide a complete visual blueprint. Planned modules remain visible but disabled.
7. Do not add Java execution to the Node process. Template Java is display/reference content until the isolated sandbox worker exists.
8. Keep every default input small, deterministic, valid JSON, and suitable for a first visual trace.

## Authoring workflow

```bash
# 1. Copy the documentation example or an adjacent question module.
# 2. Add the template.
npm run questions:compile
npm run questions:check
npm start
```

The normal compiler is fail-safe: a bad module is diagnosed without blocking healthy ones. Parseable invalid modules are excluded from the runnable registry and are shown disabled by default; malformed JSON and duplicate IDs are omitted. The strict command is for CI and must be clean before merging. The running app re-reads the question folder on API requests, and an open curriculum polls every five seconds; a saved module should appear without a server restart.

## READY question checklist

A READY module needs all fields below:

```json
{
  "templateVersion": 1,
  "id": "DS-11",
  "order": 11,
  "status": "READY",
  "title": "Question title",
  "category": "ARRAYS",
  "difficulty": "EASY",
  "summary": "One plain-language sentence.",
  "input": {
    "kind": "integer-array",
    "default": "[4, 1, 3]",
    "hint": "JSON array of integers"
  },
  "visual": { "adapter": "bubble-sort" },
  "code": {
    "starter": "class Solution { /* learner scaffold */ }",
    "reference": "class Solution { /* canonical implementation */ }"
  },
  "approach": {
    "explanation": "Why this algorithm works.",
    "time": "O(n)",
    "space": "O(1)"
  }
}
```

The compiler rejects a READY module if its adapter, input kind, default JSON, Java source text, or approach metadata is missing. A `visual.family` / `renderer` description is only a plan; it is not a runnable adapter. A question cannot render just by changing `status` to `READY`: its `visual.adapter` must be registered, and server frame generation plus the browser renderer must already support it.

## PLANNED question checklist

PLANNED modules should still be complete curriculum specifications. They are allowed to use a visual blueprint instead of a registered adapter:

```json
{
  "templateVersion": 1,
  "id": "DS-09",
  "order": 9,
  "status": "PLANNED",
  "title": "Number of Islands",
  "category": "2D GRID",
  "difficulty": "MEDIUM",
  "summary": "Flood fill connected land cells.",
  "input": {
    "kind": "binary-grid",
    "default": "{\"grid\":[[\"1\",\"0\"],[\"1\",\"1\"]]}",
    "hint": "JSON object: { grid: string[][] }"
  },
  "visual": {
    "family": "GRID_GRAPH",
    "renderer": "number-of-islands-grid",
    "representation": "2D land/water grid with visited cells and flood-fill frontier.",
    "readiness": "PHASE_3"
  },
  "code": { "starter": "...", "reference": "..." },
  "approach": { "explanation": "...", "time": "O(m × n)", "space": "O(m × n)" }
}
```

## Current executable adapter contracts

| Adapter | Required `input.kind` | Frame structure | Renderer |
|---|---|---|---|
| `bubble-sort` | `integer-array` | `ARRAY` | Array tiles / bars |
| `binary-search` | `array-target` | `BINARY_SEARCH` | Bounds + midpoint lane |
| `search-insert-position` | `array-target` | `BINARY_SEARCH` | Bounds + midpoint + final insertion/return index |
| `tree-traversal` | `tree-traversal` | `TREE_TRAVERSAL` | Binary tree + BFS queue / DFS stack + visited order |
| `bst-insert` | `bst-insert` | `TREE_BST_INSERT` | BST search path + inserted node + resulting height |
| `valid-palindrome` | `text-object` | `TWO_POINTER_STRING` | Character row + L/R pointers |
| `longest-substring` | `text-object` | `SLIDING_WINDOW_STRING` | Character window + best range |
| `reverse-linked-list` | `integer-array` | `LINKED_LIST` | Nodes, links, pointer labels |

### Tree traversal input and behavior

Use `input.kind: "tree-traversal"` with a JSON object such as:

```json
{"tree":[1,2,3,4,5,null,6],"strategy":"BFS"}
```

`tree` is a level-order binary-tree serialization; `null` marks a missing child. `strategy` is `BFS` or `DFS`. The visualizer draws the actual parent/child links, current/visited/frontier nodes, and the live queue or stack. DFS is preorder: push right before left so the left child is visited next. The UI exposes BFS/queue and DFS/stack tabs that update the selected strategy.

BST insertion uses `input.kind: "bst-insert"`, for example `{"tree":[8,3,10,1,6,null,14],"e":5}`. It requires a valid distinct-key BST, visualizes comparisons and the insertion path, highlights the new node, and reports height `h` in node-levels (empty tree has height zero).

## Adding a new visual mode

A new question is not truly READY until all of these exist:

1. Add the adapter name, input kind, and visual mode to `lib/question-registry.js`.
2. Add safe input parsing and deterministic trace generation in `server.js`.
3. Emit normalized frames with `step`, `lineHighlighted`, `actionDescription`, `variables`, and `structureState.type`.
4. Add a matching renderer and legend branch in `public/app.js`.
5. Add renderer CSS in `public/styles.css`.
6. Add canonical and deliberately wrong trace fixtures or API checks.
7. Test playback, reference focus, code comparison drawer, and error input handling.
8. Change the module’s `status` to `READY` only after all checks pass.

## Representation planning matrix

| Curriculum lesson | Required representation | Key states |
|---|---|---|
| Two Sum | Array + hash-map inspection card | index, current value, complement, map entries, match |
| Inorder Traversal | Hierarchical binary tree + call stack | current node, return point, traversal order |
| BFS / DFS | Tree/graph + queue/stack frontier | active node, visited set, frontier contents, traversal order |
| Number of Islands | Interactive 2D grid graph | water, land, visited, flood-fill frontier, island count |
| Climbing Stairs | DP table + optional recursion tree | current step, prior values, table cells, recurrence result |
| Search Insert Position | Sorted array + binary-search bounds and return marker | left/right/mid, found state, final return or insertion index |
| BST insertion | Binary tree + path and node-height labels | comparison path, inserted node, subtree heights, final height h |

## Why a well-authored template may still not render

A valid JSON file can compile as a `PLANNED` curriculum entry without becoming executable. The app only enables a question with `status: "READY"` and a registered `visual.adapter`; a `visual.family`, `renderer`, or `readiness` blueprint alone is not enough. For example, `Search Insert Position` originally used `status: "PLANNED"`, input kind `numbers-target`, and only a renderer blueprint. It was correctly disabled. It now uses the registered `search-insert-position` adapter, `array-target` input, and the existing binary-search visualization with a distinct insertion-index result marker.

## Error visibility policy

By default, a parseable broken template stays visible as a disabled **template error** entry in the curriculum. This is intentional: authors can find and repair it without losing track of the lesson.

Add this field to hide an invalid module instead:

```json
"onCompileError": "SKIP"
```

Malformed JSON and duplicate IDs are always diagnostic-only, because their identity cannot be safely routed in the learner UI.

## Definition of done

Before saying a question is complete, run:

```bash
npm run questions:check
```

Then verify that the compiled question has the expected status through:

```bash
curl http://localhost:4173/api/problems
curl http://localhost:4173/api/question-diagnostics
```
