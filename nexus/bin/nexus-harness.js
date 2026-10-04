#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { classify } = require('../lib/governor');
const { route } = require('../lib/router');
const { buildPlan } = require('../lib/plan');
const { buildReceipt, verifyReceipt } = require('../lib/receipt');

const NEXUS_ROOT = path.resolve(__dirname, '..');
const ECC_ROOT = path.resolve(NEXUS_ROOT, '..');
const config = JSON.parse(fs.readFileSync(path.join(NEXUS_ROOT, 'nexus.config.json'), 'utf8'));

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
}

function print(value) {
  process.stdout.write(JSON.stringify(value, null, 2) + '\n');
}

function doctor() {
  const required = [
    'agents',
    'skills',
    'commands',
    'rules',
    'hooks',
    'scripts/memory.js',
    'scripts/eval-harness.js',
    'scripts/profile.js',
    'scripts/harness-audit.js',
    'scripts/skills-health.js',
    'scripts/loop-status.js',
    'scripts/orchestration-status.js',
    'skills/agent-harness-construction/SKILL.md',
    'skills/agent-introspection-debugging/SKILL.md',
    'skills/ai-regression-testing/SKILL.md',
    'skills/continuous-agent-loop/SKILL.md',
    'skills/continuous-learning-v2/SKILL.md',
    'skills/context-budget/SKILL.md',
    'skills/cost-aware-llm-pipeline/SKILL.md',
    'skills/cost-tracking/SKILL.md'
  ];
  const checks = required.map((relative) => ({
    path: relative,
    ok: fs.existsSync(path.join(ECC_ROOT, relative))
  }));
  const failed = checks.filter((check) => !check.ok);
  return {
    schema: 'nexus.doctor.v1',
    status: failed.length ? 'degraded' : 'green',
    catalog_mode: config.mode,
    checked: checks.length,
    failed,
    checks
  };
}

function usage() {
  process.stderr.write([
    'NEXUS Engineering Harness',
    '',
    'Usage:',
    '  node nexus/bin/nexus-harness.js doctor',
    '  node nexus/bin/nexus-harness.js classify <task.json>',
    '  node nexus/bin/nexus-harness.js route <task.json>',
    '  node nexus/bin/nexus-harness.js plan <task.json>',
    '  node nexus/bin/nexus-harness.js receipt-create <input.json>',
    '  node nexus/bin/nexus-harness.js receipt-verify <receipt.json>',
    ''
  ].join('\n'));
  return 2;
}

function main(argv = process.argv.slice(2)) {
  const [command, file] = argv;
  if (command === 'doctor') {
    const result = doctor();
    print(result);
    return result.status === 'green' ? 0 : 1;
  }
  if (!command || !file) return usage();
  const input = readJson(file);
  if (command === 'classify') print(classify(input, config));
  else if (command === 'route') print(route(input));
  else if (command === 'plan') print(buildPlan(input, config));
  else if (command === 'receipt-create') print(buildReceipt(input));
  else if (command === 'receipt-verify') {
    const result = verifyReceipt(input);
    print(result);
    return result.ok ? 0 : 1;
  } else return usage();
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    process.stderr.write('nexus-harness: ' + error.message + '\n');
    process.exitCode = 1;
  }
}

module.exports = { doctor, main };
