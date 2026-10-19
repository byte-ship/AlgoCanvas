#!/usr/bin/env node
// Smoke-test every READY question through the real HTTP trace endpoint.
// This catches templates that compile but lack a live execution adapter or renderer.
const fs = require('fs');
const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const knownStructureTypes = new Set(['ARRAY', 'BINARY_SEARCH', 'TREE', 'LINKED_LIST', 'TWO_POINTER_STRING', 'SLIDING_WINDOW_STRING']);

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function waitForApi(baseUrl, child, getLog) {
  const deadline = Date.now() + 12_000;
  let lastError;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Question server exited during startup.\n${getLog()}`);
    try {
      const response = await fetch(`${baseUrl}/api/problems`);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) { lastError = error; }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  throw new Error(`Question server did not become ready: ${lastError?.message || 'timeout'}\n${getLog()}`);
}

async function main() {
  const port = await freePort(); const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, [path.join(root, 'server.js')], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let log = '';
  const collect = (chunk) => { log = (log + chunk.toString()).slice(-6000); };
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  try {
    const payload = await waitForApi(baseUrl, child, () => log);
    const { problems, registry } = payload;
    if (!registry || registry.summary.loaded !== registry.summary.discovered || registry.summary.skipped !== 0) {
      throw new Error(`Registry did not compile cleanly: ${JSON.stringify(registry?.summary)}`);
    }
    if (registry.diagnostics?.some((item) => item.level === 'error')) throw new Error('Registry contains error diagnostics.');
    const rendererSource = fs.readFileSync(path.join(root, 'public', 'app.js'), 'utf8');
    for (const type of knownStructureTypes) {
      if (!new RegExp(`structure\\.type\\s*===\\s*['\"]${type}['\"]`).test(rendererSource)) throw new Error(`No frontend renderer branch is registered for structure type ${type}.`);
    }
    const ready = problems.filter((problem) => problem.status === 'READY');
    if (!ready.length) throw new Error('No READY questions were found.');

    for (const problem of ready) {
      const response = await fetch(`${baseUrl}/api/execute`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id, userCode: problem.starterCode, input: problem.defaultInput })
      });
      const result = await response.json();
      if (!response.ok || result.executionStatus !== 'SUCCESS') {
        throw new Error(`${problem.id} (${problem.title}) failed its default-input smoke test: ${result.error || response.status}`);
      }
      for (const trace of [result.userTrace, result.optimalTrace]) {
        if (!trace?.frames?.length || trace.totalSteps !== trace.frames.length) throw new Error(`${problem.id} returned an empty or inconsistent trace.`);
        for (const item of trace.frames) {
          const type = item.structureState?.type;
          if (!knownStructureTypes.has(type)) throw new Error(`${problem.id} emitted unsupported structureState.type “${type}”.`);
        }
      }
      console.log(`PASS ${problem.id} ${problem.title}`);
    }
    console.log(`Question bank smoke test passed: ${ready.length} READY questions.`);
  } finally {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      let forceKillTimer;
      await Promise.race([
        new Promise((resolve) => child.once('exit', resolve)),
        new Promise((resolve) => { forceKillTimer = setTimeout(() => { if (child.exitCode === null) child.kill('SIGKILL'); resolve(); }, 2000); })
      ]);
      clearTimeout(forceKillTimer);
    }
  }
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
