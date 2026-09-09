import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createStudyTools } from '../lib/study-tools.ts';
import { emptyProgress } from '../lib/progress.ts';
const lessons = readdirSync(new URL('../lib/curriculum/', import.meta.url))
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) =>
    JSON.parse(
      readFileSync(new URL('../lib/curriculum/' + f, import.meta.url), 'utf8'),
    ),
  );
test('study action contracts share completion state, support batches and reject invalid mutations', () => {
  let state = emptyProgress();
  const tools = createStudyTools(
    lessons,
    () => state,
    (ids, done) => {
      state = {
        ...state,
        completed: done
          ? [...new Set([...state.completed, ...ids])]
          : state.completed.filter((id) => !ids.includes(id)),
      };
      return true;
    },
  );
  assert.deepEqual(
    tools.map((t) => t.name),
    ['search_course', 'read_learning_progress', 'set_lesson_completion'],
  );
  assert.deepEqual(
    tools.map((t) => t.annotations.readOnlyHint),
    [true, true, false],
  );
  assert.equal(tools[0].execute({ query: 'PCA' }).lessons[0].id, 'pca');
  assert.equal(tools[1].execute({}).completed.length, 0);
  assert.equal(
    tools[2].execute({
      lessonIds: ['pca', 'gradient-descent'],
      completed: true,
    }).completedCount,
    2,
  );
  assert.equal(
    tools[2].execute({ lessonIds: ['pca'], completed: true }).completedCount,
    2,
  );
  assert.deepEqual(tools[1].execute({}).completed, ['pca', 'gradient-descent']);
  assert.throws(
    () => tools[2].execute({ lessonIds: ['pca', 'unknown'], completed: false }),
    /valid lessonIds/,
  );
  assert.equal(state.completed.length, 2);
  tools[2].execute({ lessonIds: ['pca'], completed: false });
  assert.deepEqual(tools[1].execute({}).completed, ['gradient-descent']);
  assert.throws(() => tools[0].execute({ query: '' }));
  assert.throws(() => tools[1].execute({ unexpected: true }));
});
test('failed persistence cannot report a successful completion', () => {
  const tools = createStudyTools(lessons, emptyProgress, () => false);
  assert.throws(
    () => tools[2].execute({ lessonIds: ['pca'], completed: true }),
    /storage rejected/,
  );
});
