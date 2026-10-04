'use strict';

const UNIVERSAL = [
  'agent-harness-construction',
  'continuous-agent-loop',
  'agent-introspection-debugging'
];

const RULES = [
  { test: /security|auth|secret|permission|credential|payment/i, skills: ['security-review'], agents: ['security-reviewer'] },
  { test: /test|regression|bug|verify|quality/i, skills: ['ai-regression-testing', 'verification-loop'], agents: ['pr-test-analyzer', 'code-reviewer'] },
  { test: /memory|learn|lesson|preference|pattern/i, skills: ['continuous-learning-v2'], agents: [] },
  { test: /cost|token|budget|model route/i, skills: ['cost-aware-llm-pipeline', 'cost-tracking', 'context-budget'], agents: ['harness-optimizer'] },
  { test: /architecture|design|system|scal/i, skills: ['agentic-engineering'], agents: ['architect', 'code-architect'] },
  { test: /database|postgres|supabase|schema|sql/i, skills: ['database-migrations'], agents: ['database-reviewer'] },
  { test: /react|next|frontend|ui|component/i, skills: ['frontend-patterns'], agents: ['react-reviewer'] },
  { test: /research|evidence|source|market/i, skills: ['deep-research'], agents: ['docs-lookup'] }
];

function unique(values) {
  return [...new Set(values)];
}

function route(task = {}) {
  const text = [task.type, task.title, task.description, ...(task.tags || [])].filter(Boolean).join(' ');
  const skills = [...UNIVERSAL];
  const agents = [];
  for (const rule of RULES) {
    if (rule.test.test(text)) {
      skills.push(...rule.skills);
      agents.push(...rule.agents);
    }
  }
  if (!agents.length) agents.push('planner', 'code-reviewer');
  return {
    schema: 'nexus.route.v1',
    catalog_mode: 'full-catalog-lazy',
    selected_skills: unique(skills),
    selected_agents: unique(agents),
    note: 'Selection is task-local. The full ECC catalog remains available but is not eagerly loaded.'
  };
}

module.exports = { route };
