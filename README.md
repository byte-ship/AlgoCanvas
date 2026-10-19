# AlgoCanvas 🎨

> **Visual-first algorithm learning workspace with synchronized dual-trace execution.**

AlgoCanvas is an interactive web workspace built for mastering Data Structures & Algorithms (DSA). Instead of reading dry explanations, AlgoCanvas allows you to step through algorithm state changes frame-by-frame and compare a learner trace side-by-side with a canonical reference solution.

[![Validate Question Bank](https://github.com/OWNER/algocanvas/actions/workflows/validate-questions.yml/badge.svg)](https://github.com/OWNER/algocanvas/actions/workflows/validate-questions.yml)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- 🎬 **Semantic Visual Frame Renderers**: Dynamic visualizations for:
  - **Arrays & Sorting**: Tile and bar representations with active, sorted, and swap highlights.
  - **Binary Search**: Bounds ($L/R$), midpoint lane ($M$), probe inspections, and insertion targets.
  - **Two Pointers & Sliding Window**: String pointer lanes, active windows, and character frequencies.
  - **Linked Lists**: Node-link diagrams with live pointer reroutes.
- ⚡ **Side-by-Side Dual-Trace Comparison**: Step through learner code and optimal reference solutions simultaneously to see the exact moment an invariant diverges.
- 🧩 **Modular Question Bank**: Every problem lives in an isolated `questions/ds-XX.question.json` file.
- 🤖 **AI-Ready Contribution Pipeline**: Easily add new questions using LLMs (ChatGPT, Claude, Gemini) and validate with automated GitHub Actions CI.
- 🛡️ **Fail-Safe Compiler**: Malformed templates won't crash the server. Valid questions always compile cleanly.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (v9 or higher)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/algocanvas.git
cd algocanvas

# 2. Run the application
node server.js
```

Open your browser and navigate to **`http://localhost:4173`**.

---

## 🧪 Question Compiler & Validation

AlgoCanvas compiles individual question templates into an optimized runtime registry (`generated/questions.compiled.json`):

```bash
# Compile question templates
npm run questions:compile

# Strict schema validation (used by CI)
npm run questions:check

# Run test suite
npm test
```

---

## 🤝 Contributing to the Question Bank

We want AlgoCanvas to have the most comprehensive, visually explorable DSA curriculum on the web!

Contributing a new question takes less than 2 minutes using AI:

1. **Pick the next ID** (e.g. `questions/ds-12.question.json`).
2. **Copy the AI Prompt** from [`CONTRIBUTING.md`](CONTRIBUTING.md) and paste it into ChatGPT, Claude, or Gemini alongside any LeetCode problem.
3. **Save the generated JSON** to `questions/ds-XX.question.json`.
4. **Validate locally**:
   ```bash
   npm run questions:check
   ```
5. **Open a Pull Request** — our CI will automatically check the schema!

For full technical specifications and adapter contracts, read [`AI_QUESTION_AUTHORING_GUIDE.md`](AI_QUESTION_AUTHORING_GUIDE.md) and [`questions/QUESTION_TEMPLATE.md`](questions/QUESTION_TEMPLATE.md).

---

## 🏛️ Architecture Overview

- **Frontend**: Vanilla JavaScript and modern CSS tokens (`public/`). Zero heavy UI framework dependencies for maximum performance and instant responsiveness.
- **Backend / Gateway**: Lightweight Node.js server (`server.js`) providing deterministic guided traces, schema-validated problem endpoints, and live curriculum reloads.
- **Compiler Pipeline**: `lib/question-registry.js` parses, isolates, and normalizes each question template into a runtime registry.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
