# VisuCode

A browser workspace for learning algorithms by stepping through a learner trace beside a canonical reference trace.

## What is running now

This repository contains a functional visual-first algorithm-learning workspace:

- a polished SPA with editable learner Java, a separate optimal-code drawer, input editor, playback controls, metric cards, and trace comparison;
- deterministic trace generation for **Bubble Sort**, **Binary Search**, **Valid Palindrome**, **Longest Substring**, **Reverse Linked List**, **BFS / DFS**, **Search Insert Position**, and **BST insertion**;
- a developer-authored question-module system: every lesson is defined in `questions/*.question.json`, then compiled into the runtime registry used by both the API and UI;
- a small Node HTTP gateway with `GET /api/problems`, `GET /api/question-diagnostics`, and `POST /api/execute`; and
- renderers driven by a normalized frame contract, rather than hard-coded screen animations.

The gateway is intentionally a **guided-trace development adapter**, not an arbitrary Java executor. It recognizes the selected template adapter and produces safe deterministic traces from its input. This makes the UX, question-template contract, trace schema, playback, and diff contracts testable before any untrusted-code infrastructure exists.

## Question module compiler

```bash
npm run questions:compile  # compile templates and report diagnostics
npm run questions:check    # strict schema/adapter validation
npm test                   # strict validation + runtime smoke tests for every READY question
npm start                  # compiles on boot; API/UI refresh the registry while running
```

A malformed module is isolated: valid templates are still emitted and served. Parseable failures appear as disabled curriculum entries by default (or can be hidden with `"onCompileError": "SKIP"`); malformed JSON remains diagnostic-only. The running curriculum refreshes automatically when templates are added or changed. If all source templates fail and a prior registry exists, the last-known-good registry stays active. See [`questions/README.md`](questions/README.md) for the template format, [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md) for copyable JSON, and [`AI_QUESTION_AUTHORING_GUIDE.md`](AI_QUESTION_AUTHORING_GUIDE.md) for the agent/developer handoff.

## Contributing questions

See [`CONTRIBUTING.md`](CONTRIBUTING.md), [`AI_QUESTION_AUTHORING_GUIDE.md`](AI_QUESTION_AUTHORING_GUIDE.md), and [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md) for the question-bank workflow. Pull requests that change question modules or their runtime run the **Question Bank Validation** GitHub Actions workflow; it strictly validates templates and smoke-tests every READY adapter against its default input. Repository owners should require **Question Bank Validation / Question validation** in default-branch protection to block merges when validation fails.

## Run locally

```bash
cd visucode
npm test
npm start
# open http://localhost:4173
```

## API contract

### `POST /api/execute`

```json
{
  "problemId": "DS-01",
  "userCode": "public void bubbleSort(int[] arr) { ... }",
  "input": "[8, 3, 5, 1, 7]"
}
```

Response shape (abridged):

```json
{
  "executionStatus": "SUCCESS",
  "engineMode": "GUIDED_TRACE_ADAPTER",
  "userTrace": {
    "totalSteps": 18,
    "metrics": { "totalOperations": 18, "space": "O(1)" },
    "frames": [{ "step": 0, "kind": "ARRAY", "variables": {}, "structureState": {} }]
  },
  "optimalTrace": { "totalSteps": 18, "metrics": {}, "frames": [] },
  "diff": { "firstDivergence": null, "summary": "…" }
}
```

### Normalized frame contract

Every frame has:

| Field | Meaning |
|---|---|
| `step` | Zero-based frame index |
| `lineHighlighted` | Source line that produced the state, when known |
| `action` / `actionDescription` | Compact machine / learner-readable event label |
| `variables` | Serializable algorithm variables and indices |
| `structureState` | Renderer-specific structure snapshot, with a `type` field |
| `changed` | Named values that changed in this transition |

Frame payloads are capped at **1,000 frames** in the current adapter. The production worker must retain an independent hard cap.

## Production execution boundary (required before public code execution)

The Node API process must never compile or execute user Java. The eventual runner should:

1. parse and instrument source in a dedicated build worker (e.g. JavaParser);
2. execute per-request containers/VMs as an unprivileged UID with a read-only root filesystem;
3. deny all network egress, use an allowlist-only syscall profile, impose cgroup memory / CPU / PID caps, and apply both CPU and wall-clock timeouts;
4. cap trace frames, stdout/stderr, input size, compiled artifact size, and result JSON size;
5. move trace artifacts through a strict schema validator before returning them from the worker; and
6. log opaque request IDs and operational metrics, never raw learner source by default.

The Docker daemon is not available in this development workspace, so that security-critical layer has deliberately been left as an explicit workstream rather than simulated as “secure execution.”

## Roadmap handoff

See [`AGENT_WORKSTREAMS.md`](AGENT_WORKSTREAMS.md) for granular directives, owners, acceptance checks, and dependencies.
