# NEXUS Engineering Intelligence Harness

This directory adapts ECC into the engineering/execution layer around NEXUS.

## Boundary

NEXUS remains the decision kernel. ECC supplies engineering capabilities: planning, implementation support, memory, context routing, evaluation, review, security, recovery, cost discipline, and continuous learning.

The harness deliberately does **not** make memories into policy, does not eagerly load the entire ECC catalog into model context, and does not collapse observation, prediction, intervention, and verified outcome into one state.

## Runtime model

```text
observe -> decompose -> route -> execute -> verify -> receipt -> learn
                    ^                         |
                    |------ recovery ---------|
```

All ECC skills and agents remain available. Selection is task-local and lazy.

## Risk-adaptive gates

The governor scores task risk from impact, uncertainty, production exposure, external writes, financial consequences, credentials, sensitive data, irreversibility, and reversibility.

Low-risk experiments stay fast. Higher-risk work progressively adds targeted tests, independent review, security checks, eval receipts, and authority checks.

This replaces a blanket "every task gets maximum ceremony" rule with risk-adjusted engineering effort.

## Economic state

For a task with economic estimates, the harness reports:

```text
expected value = p_success * upside - expected_cost - risk_adjusted_downside
```

Predicted expected value is not treated as an observed outcome. Actual outcomes belong in a signed action receipt.

## Tamper-evident receipts

`nexus.action-receipt.v1` records:

```text
observation -> decision -> action -> outcome -> learning
```

The receipt carries a canonical SHA-256 digest. Editing an outcome or any preceding state invalidates verification.

## Commands

```bash
node nexus/bin/nexus-harness.js doctor
node nexus/bin/nexus-harness.js classify nexus/examples/task.json
node nexus/bin/nexus-harness.js route nexus/examples/task.json
node nexus/bin/nexus-harness.js plan nexus/examples/task.json
npm --prefix nexus test
```

To create and verify a receipt:

```bash
node nexus/bin/nexus-harness.js receipt-create input.json > receipt.json
node nexus/bin/nexus-harness.js receipt-verify receipt.json
```

## Existing ECC surfaces used

The doctor requires and verifies the presence of ECC's agent, skill, command, rule, hook, memory, evaluation, profile, harness-audit, skills-health, loop-status, orchestration-status, continuous-learning, regression-testing, context-budget, cost, recovery, and harness-construction surfaces.

No ECC source is duplicated here. NEXUS composes those capabilities and adds its own governor, receipts, and system boundaries.

## Invariants

1. Evidence outranks narrative.
2. Memory is context, not authority.
3. Project learning remains scoped unless explicitly promoted.
4. Full capability catalog is available; only relevant capabilities load per task.
5. Predicted value and verified outcome are separate fields.
6. Irreversible/external/credential/financial actions require authority appropriate to their risk.
7. A failed gate changes the plan; it does not get silently waived.
8. Learning is promoted only after evidence exists.
