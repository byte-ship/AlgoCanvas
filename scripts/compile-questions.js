#!/usr/bin/env node
const path = require('path');
const { compileQuestionTemplates } = require('../lib/question-registry');

const root = path.resolve(__dirname, '..');
const strict = process.argv.includes('--strict');
const report = compileQuestionTemplates({
  sourceDir: path.join(root, 'questions'),
  outFile: path.join(root, 'generated', 'questions.compiled.json')
});

console.log(`Question compiler: ${report.summary.loaded}/${report.summary.discovered} templates loaded${report.summary.usingLastKnownGood ? ' (last-known-good registry retained)' : ''}.`);
for (const item of report.diagnostics) {
  const writer = item.level === 'error' ? console.error : console.warn;
  writer(`${item.level.toUpperCase()} [${item.code}] ${item.file}: ${item.message}`);
}

// Normal development mode is fail-safe: valid modules still start the project.
// CI can use --strict to make skipped templates fail the validation job.
if (strict && report.diagnostics.some((item) => item.level === 'error')) process.exitCode = 1;
