import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import katex from 'katex';
const readGroups = (dir) =>
  readdirSync(new URL('../lib/' + dir + '/', import.meta.url))
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) =>
      JSON.parse(
        readFileSync(
          new URL('../lib/' + dir + '/' + f, import.meta.url),
          'utf8',
        ),
      ),
    );
const chapters = readGroups('chapters'),
  lessons = readGroups('curriculum');
const library = JSON.parse(
  readFileSync(new URL('../lib/reading-library.json', import.meta.url), 'utf8'),
);
const assessment = JSON.parse(
  readFileSync(new URL('../lib/assessment.json', import.meta.url), 'utf8'),
);
test('every published chapter has a unique extension with valid prerequisites and guided references', () => {
  assert.equal(chapters.length, 30);
  assert.equal(new Set(chapters.map((c) => c.id)).size, 30);
  for (const l of lessons) {
    const c = chapters.find((c) => c.id === l.id);
    assert.ok(c, l.id);
    assert.equal(c.sections.length, 3, l.id);
    assert.ok(c.objectives.length >= 3);
    assert.ok(c.problems.length >= 2);
    for (const id of c.prerequisites)
      assert.ok(
        lessons.some((l) => l.id === id),
        'Invalid prerequisite ' + id,
      );
    for (const r of c.reading)
      assert.ok(
        library.some((s) => s.id === r.resource),
        'Invalid reading ' + r.resource,
      );
  }
  for (const q of assessment)
    assert.ok(
      lessons.some((l) => l.id === q.lesson),
      q.id,
    );
});
test('all extended mathematical derivations render and prerequisite graph has no cycles', () => {
  for (const c of chapters)
    for (const s of c.derivation.steps)
      assert.doesNotThrow(
        () =>
          katex.renderToString(s.formula, { throwOnError: true, trust: false }),
        c.id + ' ' + s.formula,
      );
  const visit = (id, path = []) => {
    assert.ok(
      !path.includes(id),
      'Prerequisite cycle ' + [...path, id].join(' -> '),
    );
    const c = chapters.find((c) => c.id === id);
    for (const p of c.prerequisites) visit(p, [...path, id]);
  };
  for (const c of chapters) visit(c.id);
});
