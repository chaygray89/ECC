'use strict';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function expectedValue({ p_success = 0.5, upside = 0, expected_cost = 0, risk_adjusted_downside = 0 } = {}) {
  return Number(p_success) * Number(upside) - Number(expected_cost) - Number(risk_adjusted_downside);
}

function riskScore(task = {}) {
  let score = 0;
  score += clamp(Number(task.impact || 0), 0, 10) * 3;
  score += clamp(Number(task.uncertainty || 0), 0, 1) * 15;
  score += task.production ? 12 : 0;
  score += task.external_write ? 10 : 0;
  score += task.financial ? 12 : 0;
  score += task.credentials ? 15 : 0;
  score += task.sensitive_data ? 12 : 0;
  score += task.irreversible ? 15 : 0;
  score -= clamp(Number(task.reversibility || 0), 0, 1) * 10;
  return Math.round(clamp(score, 0, 100));
}

function bandFor(score, config) {
  const bands = [...config.risk_bands].sort((a, b) => a.max - b.max);
  return bands.find((band) => score <= band.max) || bands[bands.length - 1];
}

function classify(task, config) {
  const score = riskScore(task);
  const band = bandFor(score, config);
  const ev = expectedValue(task.economics || {});
  return {
    schema: 'nexus.governor-result.v1',
    risk_score: score,
    risk_band: band.name,
    required_gates: [...band.gates],
    expected_value: ev,
    authority_required: Boolean(
      task.irreversible || task.credentials || task.financial || task.external_write
    )
  };
}

module.exports = { clamp, expectedValue, riskScore, bandFor, classify };
