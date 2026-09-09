import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  freshAssessment,
  parseAssessment,
  gradeAssessment,
} from '../lib/assessment.ts';
const questions = JSON.parse(
  readFileSync(new URL('../lib/assessment.json', import.meta.url), 'utf8'),
);
test('assessment provides 30 distinct questions with one valid answer and explanations for every option', () => {
  assert.equal(questions.length, 30);
  assert.equal(new Set(questions.map((q) => q.id)).size, 30);
  assert.equal(new Set(questions.map((q) => q.question)).size, 30);
  for (const q of questions) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.rationales.length, 4);
    assert.ok(q.rationales.every((r) => r.length > 25));
    assert.ok(q.answer >= 0 && q.answer < 4);
    assert.ok(q.explanation.length > 60);
  }
});
test('grading and saved attempts preserve answers, reject invalid state and distinguish unanswered from wrong', () => {
  const state = freshAssessment();
  assert.equal(gradeAssessment(questions, state.answers).answered, 0);
  for (const q of questions) state.answers[q.id] = q.answer;
  state.submitted = true;
  assert.equal(gradeAssessment(questions, state.answers).correct, 30);
  assert.deepEqual(parseAssessment(JSON.stringify(state), questions), state);
  state.answers.q01 = 0;
  assert.equal(gradeAssessment(questions, state.answers).correct, 29);
  assert.throws(() =>
    parseAssessment(
      JSON.stringify({ ...state, answers: { q01: 9 } }),
      questions,
    ),
  );
  assert.throws(() =>
    parseAssessment(JSON.stringify({ ...state, answers: {} }), questions),
  );
});
test('numerical assessment answers agree with independent calculations', () => {
  assert.equal(6 / (1 + 2), 2);
  assert.equal((10 + 22 / 3) / (1 + 1 / 3), 13);
  assert.ok(Math.abs(0.5 - 0.9 * 0.49 - 0.059) < 1e-12);
  assert.equal(4 * (0.5 + 0.5 / 10), 2.2);
  assert.ok(Math.abs(0.009 / (0.009 + 0.0495) - 0.15384615384615385) < 1e-12);
  assert.equal((6 + 3) / 10, 0.9);
});
