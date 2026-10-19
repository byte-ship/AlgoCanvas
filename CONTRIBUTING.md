# Contributing Questions to VisuCode

We welcome contributions to grow our algorithm question bank! VisuCode is designed with an AI-friendly, modular question system where **one lesson equals one isolated JSON file** under `questions/`.

---

## ⚡ The Quick Way: Add a Question with AI

You can use ChatGPT, Claude, Gemini, or any AI coding assistant to create a question for you.

### Copy & Paste Prompt for AI:

```markdown
I want to contribute a new algorithm question to VisuCode.
Please read these two reference files in the repository:
1. `questions/QUESTION_TEMPLATE.md` (for the schema and fields)
2. `AI_QUESTION_AUTHORING_GUIDE.md` (for validation rules and adapter contracts)

Here is the problem details:
- Title: [e.g. Search Insert Position]
- Difficulty: [EASY | MEDIUM | HARD]
- Category: [e.g. ARRAYS]
- Description / LeetCode link: [Insert problem text or link]

Please generate the JSON content for `questions/ds-XX.question.json` following the schema exactly.
Ensure:
- `id` follows format `DS-XX` with unique order.
- Valid Java syntax in `starter` and `reference`.
- `default` is valid JSON and parses cleanly.
```

---

## 🛠 Manual Contribution Workflow

### 1. Pick the Next Available ID
Check the `questions/` directory to find the next question number (e.g., `ds-12.question.json`).

### 2. Choose `READY` or `PLANNED`
- **Use `READY`** if the question matches an existing server trace adapter (`bubble-sort`, `binary-search`, `valid-palindrome`, `longest-substring`, `reverse-linked-list`).
- **Use `PLANNED`** if the visualizer/renderer for this algorithm category is still under development. Provide a complete `visualBlueprint` describing the representation.

### 3. Create the File
Copy the starter template from [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md) into `questions/ds-XX.question.json`.

### 4. Validate Locally
Run the strict validator to make sure your question passes all schema checks:

```bash
npm run questions:check
```

### 5. Submit a Pull Request
1. Fork the repository and create your branch (`git checkout -b add-question-ds-12`).
2. Commit your new `questions/ds-XX.question.json` file.
3. Push to your branch and open a Pull Request.
4. GitHub Actions will automatically run the schema checker on your PR!
