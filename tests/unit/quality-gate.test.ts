import { describe, expect, it } from 'vitest';
import { qualityGatePassed } from '../../scripts/quality-gate.mjs';

describe('required CI gate', () => {
  it('accepts only completed, successful jobs', () => {
    expect(qualityGatePassed(['success', 'success'])).toBe(true);
  });
  it.each(['failure', 'cancelled', 'skipped', 'pending', ''])(
    'rejects a %s job',
    (status) => {
      expect(qualityGatePassed(['success', status])).toBe(false);
    },
  );
  it('fails closed when no results are supplied', () => {
    expect(qualityGatePassed([])).toBe(false);
  });
});
