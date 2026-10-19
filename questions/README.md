# Question modules

Each `*.question.json` file is a standalone developer-authored lesson module. The registry compiler reads every file independently and creates `generated/questions.compiled.json`, which is what the API and UI use at runtime. The running server refreshes the registry whenever the curriculum API is read, and the open UI polls that API every five seconds, so a newly saved template appears without restarting the server or manually editing a list.

- Use [`QUESTION_TEMPLATE.md`](QUESTION_TEMPLATE.md) as a copyable starting point.
- Give another coding agent [`../AI_QUESTION_AUTHORING_GUIDE.md`](../AI_QUESTION_AUTHORING_GUIDE.md) before asking it to add a lesson.

## Add a ready question

Copy an existing ready template and edit it. A ready template needs a registered adapter:

```json
{
  "templateVersion": 1,
  "id": "DS-98",
  "order": 98,
  "status": "READY",
  "title": "Example lesson",
  "category": "ARRAYS",
  "difficulty": "EASY",
  "summary": "One sentence for the lesson header.",
  "input": {
    "kind": "integer-array",
    "default": "[4, 1, 3]",
    "hint": "JSON array of integers"
  },
  "visual": { "adapter": "bubble-sort" },
  "code": {
    "starter": "class Solution { /* learner scaffold */ }",
    "reference": "class Solution { /* canonical scaffold */ }"
  },
  "approach": {
    "explanation": "Why the reference strategy works.",
    "time": "O(n²)",
    "space": "O(1)"
  }
}
```

## Registered adapters

| Adapter | Input kind | Visual mode |
|---|---|---|
| `bubble-sort` | `integer-array` | `ARRAY` |
| `binary-search` | `array-target` | `BINARY_SEARCH` |
| `search-insert-position` | `array-target` | `BINARY_SEARCH` |
| `tree-traversal` | `tree-traversal` | `TREE_TRAVERSAL` → `TREE` |
| `bst-insert` | `bst-insert` | `TREE_BST_INSERT` → `TREE` |
| `valid-palindrome` | `text-object` | `TWO_POINTER_STRING` |
| `longest-substring` | `text-object` | `SLIDING_WINDOW_STRING` |
| `reverse-linked-list` | `integer-array` | `LINKED_LIST` |

A lesson only runs when its source says `"status": "READY"`, `visual.adapter` names an adapter registered in `lib/question-registry.js`, its input kind matches that adapter, and the server/UI can produce and display the trace. Setting `status` to READY or documenting a `visual.family` alone does not create an executable renderer. A complete-looking `PLANNED` module is compiled as curriculum metadata but intentionally stays disabled.

### Tree traversal input

The `tree-traversal` adapter accepts `{"tree":[1,2,3,4,5,null,6],"strategy":"BFS"}`. The `tree` array is level order (`null` marks a missing child); `strategy` is `BFS` or `DFS`. It emits a `TREE` frame with actual parent/child edges, current and visited nodes, frontier, and traversal order. The UI renders a tree and exposes queue-based BFS and stack-based DFS tabs.

The `bst-insert` adapter accepts `{"tree":[8,3,10,1,6,null,14],"e":5}`. It validates the starting BST, traces comparisons and the insertion path, animates the new node, and reports the resulting height `h` (counted in levels; empty tree = 0). Duplicate values are a no-op.

## Planned question blueprints

A `PLANNED` module may already contain its full `input`, `visual`, `code`, and `approach` content. Unlike a READY module, its `visual` block is a blueprint rather than a registered executable adapter:

```json
"visual": {
  "family": "GRID_GRAPH",
  "renderer": "number-of-islands-grid",
  "representation": "2D land/water grid with flood-fill frontier and visited cells.",
  "readiness": "PHASE_3"
}
```

Use blueprints for lessons whose visual adapter is still outstanding—for example, inorder traversal call-stack details, Number of Islands grid traversal, or DP tables. The BFS/DFS binary-tree lesson now has a working adapter and should use `status: "READY"` with `visual.adapter: "tree-traversal"` instead.

## Compile and validation behavior

```bash
npm run questions:compile       # development-safe; logs bad modules and continues
npm run questions:check         # strict template/adapter validation
npm test                        # full contributor gate: validation + runtime smoke tests
npm start                       # starts the project; server compiles on boot and refreshes on API reads
```

Every error is reported with a filename and diagnostic code, and cannot stop other valid modules from compiling. Malformed JSON and duplicate IDs are omitted from the library. A parseable module with a schema/adapter/input error is excluded from the runnable registry and, by default, its title is shown in the curriculum as a disabled **template error** entry. Add this field to suppress that disabled entry and omit the question entirely from the library:

```json
"onCompileError": "SKIP"
```

Broken JSON cannot provide a trustworthy title, so it is always diagnostic-only. Duplicate IDs are also diagnostic-only because showing two entries with the same route would be ambiguous. If every current source template is invalid, the compiler retains the last-known-good compiled registry when one exists.

> The template compiler validates lesson modules; it does not execute Java. Arbitrary Java must remain behind the isolated sandbox worker described in the root README.
