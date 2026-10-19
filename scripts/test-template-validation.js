#!/usr/bin/env node
// Regression checks for incomplete templates, duplicate IDs, and per-file isolation.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { compileQuestionTemplates } = require('../lib/question-registry');

const root = path.resolve(__dirname, '..');
const sourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'AlgoCanvas-template-test-'));
const questionsDir = path.join(sourceDir, 'questions');
const outFile = path.join(sourceDir, 'generated', 'questions.compiled.json');
fs.mkdirSync(questionsDir, { recursive: true });

try {
  const valid = JSON.parse(fs.readFileSync(path.join(root, 'questions', 'ds-01.question.json'), 'utf8'));
  fs.writeFileSync(path.join(questionsDir, 'ds-01.question.json'), JSON.stringify(valid));
  fs.writeFileSync(path.join(questionsDir, 'ds-99-incomplete.question.json'), JSON.stringify({
    templateVersion: 1, id: 'DS-99', order: 99, status: 'PLANNED', title: 'Incomplete shell',
    category: 'TEST', difficulty: 'EASY', summary: 'This deliberately has no input, visual contract, code, or approach.'
  }));
  fs.writeFileSync(path.join(questionsDir, 'ds-98-hidden.question.json'), JSON.stringify({
    templateVersion: 1, id: 'DS-98', order: 98, status: 'PLANNED', title: 'Hidden broken draft', onCompileError: 'SKIP'
  }));
  fs.writeFileSync(path.join(questionsDir, 'zz-duplicate.question.json'), JSON.stringify(valid));

  const report = compileQuestionTemplates({ sourceDir: questionsDir, outFile });
  if (report.summary.loaded !== 1) throw new Error(`Expected one valid module, got ${report.summary.loaded}.`);
  if (!report.diagnostics.some(item => item.code === 'MISSING_FIELD' && item.file === 'ds-99-incomplete.question.json')) throw new Error('Incomplete planned shell was not rejected with MISSING_FIELD.');
  if (!report.diagnostics.some(item => item.code === 'DUPLICATE_ID' && item.file === 'zz-duplicate.question.json')) throw new Error('Duplicate ID was not rejected.');
  if (!report.unavailableQuestions.some(item => item.title === 'Incomplete shell' && item.status === 'UNAVAILABLE')) throw new Error('Default policy did not preserve the incomplete question as disabled.');
  if (report.unavailableQuestions.some(item => item.title === 'Hidden broken draft')) throw new Error('onCompileError=SKIP did not hide the invalid draft.');
  if (!report.questions.some(item => item.id === 'DS-01')) throw new Error('A valid question was blocked by another invalid file.');
  console.log('Template validation regression checks passed (incomplete, duplicate, isolation, and SKIP policy).');
} finally {
  fs.rmSync(sourceDir, { recursive: true, force: true });
}
