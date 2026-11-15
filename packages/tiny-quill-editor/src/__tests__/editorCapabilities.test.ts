import { describe, it, expect } from 'vitest';
import {
  EDITOR_CAPABILITY_TESTS,
  runAllEditorCapabilityTests,
} from '../capabilitiesTestSuite';

describe('TinyQuill 2.x Editor Capabilities Test Suite', () => {
  for (const testCase of EDITOR_CAPABILITY_TESTS) {
    it(`[${testCase.category}] ${testCase.name}`, () => {
      testCase.run();
    });
  }

  it('runs the full self-test runner with 100% pass rate', () => {
    const summary = runAllEditorCapabilityTests();
    expect(summary.failedCount).toBe(0);
    expect(summary.passedCount).toBe(EDITOR_CAPABILITY_TESTS.length);
  });
});
