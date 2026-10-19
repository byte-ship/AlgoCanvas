# VisuCode — delegated workstreams

> These are small, independently shippable directives for the build. Status is kept here so handoffs remain explicit.

| Agent | Status | Small directive | Deliverable / acceptance check |
|---|---|---|---|
| **A1 · Product contract** | ✅ Complete | Turn the specification into a thin vertical-slice scope, named boundaries, and non-negotiable safety rules. Do **not** invent a production sandbox. | `README.md` defines MVP, API contract, trace limits, and sandbox boundary. |
| **A2 · Domain & trace model** | ✅ Complete | Define one normalized frame model that every renderer can consume. Implement deterministic trace generators for Array Sort, Binary Search, Reverse Linked List, two-pointer strings, and sliding windows. | `server.js` responds to `POST /api/execute` with user and reference traces. |
| **A3 · Execution gateway** | ✅ Complete (scaffold) | Create the HTTP boundary that accepts a problem, Java source, and JSON input. Validate payload size / input shape and return structured compile/runtime-style errors. Use deterministic guided traces until isolated Java workers exist. | `POST /api/execute`, `GET /api/problems`, static asset serving. |
| **A4 · Learning workspace UI** | ✅ Complete | Build the visual-first workspace: retractable problem navigator, one editable/reference-switched code surface, central visualizer, timeline, metrics, and feedback states. | Live browser-ready SPA in `public/`. |
| **A5 · Visual renderer** | ✅ Complete | Render semantic frames—not one-off animations—for bars, binary-search bounds and insertion positions, linked lists, two pointers, and sliding windows. Highlight active variables and changed values. | The visualizer supports `ARRAY`, `BINARY_SEARCH`, `TREE`, `LINKED_LIST`, `TWO_POINTER_STRING`, and `SLIDING_WINDOW_STRING`. |
| **A6 · Playback & diff** | ✅ Complete | Implement synchronized start/back/play/next/end controls, rate selection, keyboard shortcuts, first-divergence detection, and operation comparison. | Both panes advance from a shared scrubber and diff panel updates. |
| **A7 · Question module compiler** | ✅ Complete | Compile developer-authored `*.question.json` templates into one validated lesson registry. Isolate malformed files and retain a last-known-good registry when every current source module fails. | `questions/`, `lib/question-registry.js`, `scripts/compile-questions.js`, generated registry, diagnostics endpoint, and strict CI mode. |
| **A8 · Sandbox hardening** | ⏳ Blocked by deployment runtime | Replace guided trace generation with AST instrumentation + an isolated Java worker. Enforce network denial, cgroups, PID cap, wall/CPU timeout, trace cap, and output cap. | Docker/Kubernetes worker contract and security test suite. **Never run untrusted Java in the API process.** |
| **A9 · Persistence & curriculum** | ⏳ Next | Add PostgreSQL migrations, seed all ten problems, auth/progress model, submissions, and reference revisions. | Schema migrations + seed + repository tests. |
| **A10 · Quality & accessibility** | ⏳ Next | Add renderer unit tests, API contract tests, mobile layout checks, keyboard focus order, reduced-motion behavior, and WCAG color review. | CI checks and an accessibility checklist. |

## Phase 2 vertical slice — complete

The String and Pointer Structures milestone now has a working guided-trace implementation:

- **DS-04 Valid Palindrome:** case/punctuation skipping, left/right pointer frames, mismatch state, and result state.
- **DS-05 Longest Substring Without Repeating Characters:** active-window expansion, duplicate contraction, last-seen semantics, and best-window state.
- **DS-06 Reverse Linked List:** retained as the pointer-structure renderer, with `head`, `prev`, `curr`, and `nextTemp` state in every frame.
- **DS-08 BFS / DFS:** now READY with level-order binary-tree parsing, interactive BFS queue / DFS stack tabs, tree-node frontier highlighting, visited-state rendering, and traversal-order frames.
- **DS-12 BST insertion:** now READY with validated BST level-order input, search-path and new-node frames, per-node subtree heights, and final tree height `h`.
- **DS-11 Search Insert Position:** uses the registered `search-insert-position` guided adapter and binary-search renderer; final frames show either the found index or the insertion gap.
- **One visual surface, synchronized traces:** learners can switch between their captured trace and the canonical trace without duplicated rendering. The existing playback controls remain shared by both traces.

This is still a guided-trace adapter: an isolated Java instrumentation worker remains the prerequisite for treating learner Java as executable source.

## UX direction revision — October 2026

The Phase-1 workspace has been revised around the visualizer as the primary learning surface:

- **Light, instructional canvas:** high-contrast white cards, restrained blue accents, and compact control surfaces take inspiration from the supplied sorting workspace.
- **Visualizer-first hierarchy:** the large, centered animation card appears before code. Its playback timeline, state count, and visual legend are collocated with the frame.
- **Sorting view modes:** Array and Bars are tabs on a single renderer; they represent the same trace state, so changing view never restarts or forks execution.
- **One code surface:** learner and canonical Java are never rendered side-by-side. Opening **Optimal approach** reveals an explanatory right drawer and swaps the existing lower code surface into a read-only reference view. Returning restores the learner draft.
- **Retractable curriculum rail:** the left navigation is independently collapsible without removing problem selection.

## Coordination protocol

1. **A2 owns the trace contract.** Renderers consume frames only; they never infer algorithm state from Java source.
2. **A3 owns trust boundaries.** Code execution stays out of the web process. A worker may only return validated, capped JSON.
3. **A4/A5/A6 own presentation only.** A UI error must never expose worker internals or source paths.
4. Every new visual mode adds: input schema, normalized state schema, reference trace fixture, renderer, diff comparator, and tests.
5. A change is only “done” after its API response / UI state has a documented error mode.
