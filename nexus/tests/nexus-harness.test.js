'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { expectedValue, riskScore, classify } = require('../lib/governor');
const { route } = require('../lib/router');
const { buildReceipt, verifyReceipt } = require('../lib/receipt');
const { doctor } = require('../bin/nexus-harness');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'nexus.config.json'), 'utf8'));

test('expected value follows configured economic equation', () => {
  assert.equal(expectedValue({ p_success: 0.5, upside: 1000, expected_cost: 100, risk_adjusted_downside: 50 }), 350);
});

test('risk rises for production external irreversible work', () => {
  const low = riskScore({ impact: 1, uncertainty: 0.1, reversibility: 1 });
  const high = riskScore({ impact: 9, uncertainty: 0.8, production: true, external_write: true, irreversible: true });
  assert.ok(high > low);
  assert.ok(high >= 70);
});

test('governor applies critical gates to high-risk work', () => {
  const result = classify({
    impact: 10,
    uncertainty: 0.9,
    production: true,
    external_write: true,
    financial: true,
    irreversible: true
  }, config);
  assert.equal(result.risk_band, 'critical');
  assert.ok(result.required_gates.includes('authority-check'));
  assert.ok(result.required_gates.includes('eval-receipt'));
});

test('router keeps full catalog lazy while selecting task-local capabilities', () => {
  const result = route({ title: 'Fix payment auth regression and verify security' });
  assert.equal(result.catalog_mode, 'full-catalog-lazy');
  assert.ok(result.selected_skills.includes('ai-regression-testing'));
  assert.ok(result.selected_agents.includes('security-reviewer'));
  assert.ok(result.selected_agents.includes('code-reviewer'));
});

test('receipts are tamper-evident', () => {
  const receipt = buildReceipt({
    id: 'nxr_test',
    created_at: '2026-10-03T00:00:00.000Z',
    observation: { revenue: 100 },
    decision: { action: 'ship' },
    action: { status: 'executed' },
    outcome: { revenue: 125 },
    learning: { delta: 25 }
  });
  assert.equal(verifyReceipt(receipt).ok, true);
  receipt.outcome.revenue = 999;
  assert.equal(verifyReceipt(receipt).ok, false);
});

test('doctor sees required ECC surfaces', () => {
  const result = doctor();
  assert.equal(result.status, 'green');
  assert.equal(result.failed.length, 0);
});
