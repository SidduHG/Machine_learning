import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { answerQuestion, searchLessons } from '../lib/tutor.ts';
const lessons = readdirSync(new URL('../lib/curriculum/', import.meta.url))
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) =>
    JSON.parse(
      readFileSync(new URL('../lib/curriculum/' + f, import.meta.url), 'utf8'),
    ),
  );
test('named topics return correct primary lessons and grounded passages', () => {
  for (const [q, id] of [
    ['Explain linear regression', 'linear-regression'],
    ['Explain PCA simply', 'pca'],
    ['What is data leakage?', 'data-preparation'],
    ['How does attention work?', 'attention'],
    ['Why does my loss increase?', 'gradient-descent'],
  ]) {
    const answer = answerQuestion(q, lessons);
    assert.equal(answer.lessonIds[0], id, q);
    assert.ok(answer.sources.length);
    assert.ok(answer.passages.every((p) => typeof p === 'string' && p.length));
  }
});
test('short follow-ups use lesson context and return the actual formula/example/code', () => {
  const l = lessons.find((l) => l.id === 'linear-regression');
  assert.equal(
    answerQuestion('Show the math', lessons, l.id).formula,
    l.formula,
  );
  assert.ok(
    answerQuestion('Give me an example', lessons, l.id).passages.includes(
      l.example.steps[0],
    ),
  );
  assert.equal(answerQuestion('Show code', lessons, l.id).code, l.code);
  assert.ok(
    answerQuestion('Quiz me', lessons, l.id).passages.includes(l.quiz.question),
  );
});
test('unrelated, empty and excessively long questions do not fabricate an answer', () => {
  assert.equal(
    answerQuestion('How do I bake chocolate cake?', lessons, 'python').matched,
    false,
  );
  assert.equal(
    answerQuestion('What is the weather in Paris?', lessons).matched,
    false,
  );
  assert.throws(() => answerQuestion('', lessons));
  assert.throws(() => answerQuestion('a'.repeat(1001), lessons));
  assert.equal(searchLessons('zxqvnotaword', lessons).length, 0);
});
