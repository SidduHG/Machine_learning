import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const base = process.argv[2] || 'http://127.0.0.1:4173';
const lessons = readdirSync(new URL('../lib/curriculum/', import.meta.url))
  .filter((f) => f.endsWith('.json'))
  .flatMap((f) =>
    JSON.parse(
      readFileSync(new URL('../lib/curriculum/' + f, import.meta.url), 'utf8'),
    ),
  );
const projects = JSON.parse(
  readFileSync(new URL('../lib/projects.json', import.meta.url), 'utf8'),
);
const examples = JSON.parse(
  readFileSync(
    new URL('../lib/practical-examples.json', import.meta.url),
    'utf8',
  ),
);
const routes = [
  '/',
  '/learn',
  '/labs',
  '/practice',
  '/progress',
  '/resources',
  '/assessment',
  ...lessons.map((l) => '/learn/' + l.id),
  '/python-worker.js',
  '/favicon.svg',
  '/fonts/KaTeX_Main-Regular.woff2',
  ...projects.map((p) => '/notebooks/' + p.id + '.ipynb'),
  ...examples.map((e) => '/examples/' + e.id + '.py'),
];
for (let i = 0; i < routes.length; i += 4) {
  await Promise.all(
    routes.slice(i, i + 4).map(async (path) => {
      const response = await fetch(new URL(path, base), { redirect: 'manual' });
      assert.equal(
        response.status,
        200,
        path + ' must return 200 without authentication',
      );
      const body = await response.text();
      assert.ok(body.length > 50, path + ' should contain content');
      if (path === '/' || path.startsWith('/learn'))
        assert.ok(
          body.includes('ML Atlas'),
          path + ' should contain rendered course content',
        );
    }),
  );
}
for (const path of [
  '/not-a-page',
  '/learn/not-a-lesson',
  '/learn/attention',
  '/learn/neural-networks',
]) {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  assert.equal(response.status, 404, path + ' must return 404');
}
console.log(
  `${routes.length} public routes/assets returned 200; unknown and deferred lesson routes returned 404 at ${base}.`,
);
