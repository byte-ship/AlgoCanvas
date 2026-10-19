# VisuCode source handoff

This workspace is the updated project source. The downloadable archive includes the frontend, guided-trace server, question templates, compiled registry, and AI authoring docs.

## Automatic question discovery

- Each file matching `questions/*.question.json` is discovered and independently validated by `lib/question-registry.js`.
- `npm start` compiles the question folder into `generated/questions.compiled.json` before the server starts.
- The server refreshes the source registry on curriculum API reads; an open browser polls `/api/problems` every five seconds, so new or corrected modules appear without restarting.
- The browser builds its curriculum list from `/api/problems`; it does not contain a separate hard-coded lesson list.
- The curriculum badge displays `compiled / discovered` from the registry summary.
- `READY` entries are enabled, `PLANNED` entries remain visible and disabled, and parseable invalid entries are shown disabled by default. Add `"onCompileError": "SKIP"` to a source file to keep that invalid entry out of the curriculum.
- Invalid JSON cannot supply a title, so it is omitted from the list and reported in `/api/question-diagnostics`.
- A broken module cannot block other modules. `npm run questions:check` is the strict validation command.

## Add another question

1. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AI_QUESTION_AUTHORING_GUIDE.md`](AI_QUESTION_AUTHORING_GUIDE.md).
2. Copy [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md) as a format reference.
3. Add `questions/ds-XX.question.json` with the next unused ID.
4. Keep it `PLANNED` until its adapter, normalized trace frames, frontend renderer, and QA are implemented.
5. Run `npm test`; the same gate runs in GitHub Actions on relevant pull requests.
6. Repository owners must require **Question Bank Validation / Question validation** in branch protection to prevent a failing pull request from merging.

## Run locally

Requires Node.js 20 or newer; there are no npm dependencies.

```bash
npm run questions:check
npm start
```

Open `http://localhost:4173`.
