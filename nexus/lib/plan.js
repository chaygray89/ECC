'use strict';

const { classify } = require('./governor');
const { route } = require('./router');

function buildPlan(task, config) {
  const governor = classify(task, config);
  const routing = route(task);
  const stages = [
    { id: 'observe', purpose: 'Verify current state and evidence before intervention.' },
    { id: 'decompose', purpose: 'Break work into independently verifiable units.' },
    { id: 'execute', purpose: 'Use routed ECC skills/agents and bounded tools.' },
    { id: 'verify', purpose: 'Run the governor-required gates.' },
    { id: 'record', purpose: 'Write action/outcome evidence as a receipt.' },
    { id: 'learn', purpose: 'Promote only evidence-backed lessons; memory is not policy.' }
  ];
  return {
    schema: 'nexus.execution-plan.v1',
    governor,
    routing,
    stages,
    ecc_surfaces: {
      memory: 'scripts/memory.js',
      eval: 'scripts/eval-harness.js',
      profiles: 'scripts/profile.js',
      harness_audit: 'scripts/harness-audit.js',
      skills_health: 'scripts/skills-health.js'
    }
  };
}

module.exports = { buildPlan };
