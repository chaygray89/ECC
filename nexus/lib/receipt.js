'use strict';

const crypto = require('crypto');

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])]));
  }
  return value;
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
}

function buildReceipt(input = {}) {
  const base = {
    schema: 'nexus.action-receipt.v1',
    id: input.id || ('nxr_' + Date.now()),
    created_at: input.created_at || new Date().toISOString(),
    observation: input.observation ?? null,
    decision: input.decision ?? null,
    action: input.action ?? null,
    outcome: input.outcome ?? null,
    learning: input.learning ?? null
  };
  return {
    ...base,
    integrity: { algorithm: 'sha256', digest: digest(base) }
  };
}

function verifyReceipt(receipt) {
  if (!receipt || receipt.schema !== 'nexus.action-receipt.v1') {
    return { ok: false, reason: 'schema_mismatch' };
  }
  const { integrity, ...base } = receipt;
  if (!integrity || integrity.algorithm !== 'sha256') {
    return { ok: false, reason: 'integrity_metadata_missing' };
  }
  const actual = digest(base);
  return {
    ok: actual === integrity.digest,
    expected: integrity.digest,
    actual,
    reason: actual === integrity.digest ? null : 'digest_mismatch'
  };
}

module.exports = { canonical, digest, buildReceipt, verifyReceipt };
