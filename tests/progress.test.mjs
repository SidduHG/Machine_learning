import test from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyProgress,
  parseProgress,
  toggleId,
  mergeProgress,
} from '../lib/progress.ts';
test('progress roundtrips, deduplicates and toggles completion', () => {
  const p = emptyProgress();
  p.completed = ['python', 'python'];
  p.notes.python = 'My explanation';
  const restored = parseProgress(JSON.stringify(p));
  assert.deepEqual(restored.completed, ['python']);
  assert.equal(restored.notes.python, 'My explanation');
  assert.deepEqual(toggleId(restored.completed, 'python'), []);
  assert.deepEqual(toggleId([], 'python'), ['python']);
});
test('invalid imports fail explicitly rather than destroying existing state', () => {
  for (const raw of [
    'broken',
    '{}',
    'null',
    JSON.stringify({ ...emptyProgress(), completed: ['bad/id'] }),
    JSON.stringify({ ...emptyProgress(), notes: { python: 42 } }),
    JSON.stringify({ ...emptyProgress(), quiz: { python: 'yes' } }),
    JSON.stringify({
      ...emptyProgress(),
      notes: { python: 'x'.repeat(10001) },
    }),
  ])
    assert.throws(() => parseProgress(raw));
  assert.throws(() => parseProgress('x'.repeat(1000001)));
  assert.deepEqual(parseProgress(null), emptyProgress());
});
test('import merge preserves existing completions and unrelated notes', () => {
  const a = {
    ...emptyProgress(),
    completed: ['python'],
    notes: { python: 'old', arrays: 'keep' },
  };
  const b = {
    ...emptyProgress(),
    completed: ['arrays'],
    notes: { python: 'new' },
    lastLesson: 'arrays',
  };
  const result = mergeProgress(a, b);
  assert.deepEqual(result.completed, ['python', 'arrays']);
  assert.deepEqual(result.notes, { python: 'new', arrays: 'keep' });
  assert.equal(result.lastLesson, 'arrays');
  assert.equal(a.notes.python, 'old');
});
