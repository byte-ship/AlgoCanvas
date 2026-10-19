# Contributing questions to AlgoCanvas

Thanks for helping grow the question bank. Questions are added as small, independently validated JSON modules. A pull request is the submission; the required **Question Bank Validation** check must pass before the change is eligible to merge.

## Add a question

1. Read [`AI_QUESTION_AUTHORING_GUIDE.md`](AI_QUESTION_AUTHORING_GUIDE.md) and [`questions/README.md`](questions/README.md).
2. Copy the appropriate example from [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md).
3. Add one file named `questions/ds-XX.question.json`. Choose the next unused ID and matching `order`.
4. For a runnable question, use `status: "READY"` and an existing registered adapter. If a new visualization is needed, include its adapter, server trace generation, renderer, and tests in the same PR before setting it READY.
5. Use `status: "PLANNED"` only when the visual adapter is not implemented yet. Planned entries must still include complete input, code, approach, and visual-blueprint metadata; they compile into the curriculum but remain disabled.
6. Run `npm test` and include its result in the PR.

Do not edit `generated/questions.compiled.json` manually. The compiler regenerates it from the source modules.

## What CI checks

The GitHub Actions **Question Bank Validation** check runs on every pull request (and on pushes to `main`) so the required status is always reported. It:

- strictly validates every discovered question module, including required fields, valid default-input JSON, IDs, registered adapters, and input/adapter compatibility;
- rejects incomplete planned shells, malformed JSON, duplicate IDs, unknown adapters, and invalid READY modules;
- syntax-checks the Node server, compiler, and browser app; and
- starts the real HTTP server and smoke-tests the default input for every READY question, checking that it returns non-empty traces with renderer-supported structure types.

A passing check means the module compiles and its default trace reaches a supported renderer. It is not a substitute for human review of algorithm correctness, teaching quality, or edge cases. Please include a short explanation of the invariant and at least one meaningful edge case in the PR description.

## Content and attribution

- Link to the original problem/source in the pull request.
- Write the summary and explanation in your own words; do not copy a full proprietary problem statement.
- Include a concise canonical approach, accurate complexity, and a small deterministic default input.
- Make the visual contract explicit: which structure is drawn and which state changes at each step.
- Do not include secrets, personal data, external scripts, or arbitrary executable build steps.

## Using an AI coding assistant

You may give an AI assistant these files as its authoring brief:

- [`AI_QUESTION_AUTHORING_GUIDE.md`](AI_QUESTION_AUTHORING_GUIDE.md)
- [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md)
- [`questions/README.md`](questions/README.md)

Suggested prompt:

> Read the AlgoCanvas AI question-authoring guide, question README, and question template first. Add exactly one question module for [problem]. Choose the next unused DS ID. Check whether its visual adapter is already registered. Use READY only if that adapter, trace adapter, and renderer exist; otherwise use PLANNED and provide a complete visual blueprint. Do not edit generated output. Run `npm test`, inspect diagnostics, and report the new file, status, adapter, and test result. Do not claim Java source is executed by the development trace gateway.

Review the AI-generated source and explanation yourself before opening the PR.

## Merge protection for repository owners

For validation to gate merges, enable branch protection (or a ruleset) on the default branch and require the status check **Question Bank Validation / Question validation**. CI runs automatically on PRs, but only repository settings can make it a mandatory merge check.
