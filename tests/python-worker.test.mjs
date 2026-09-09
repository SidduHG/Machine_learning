import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(
  new URL('../public/python-worker.js', import.meta.url),
  'utf8',
);
test('Python worker initializes lazily, isolates namespaces and reports execution failures', async () => {
  const messages = [],
    namespaces = [];
  let imports = 0,
    destroys = 0,
    stdout;
  const runtime = {
    setStdout: (x) => {
      stdout = x.batched;
    },
    setStderr: () => {},
    toPy: (x) => {
      namespaces.push(x);
      return { destroy: () => destroys++ };
    },
    runPythonAsync: async (source) => {
      if (source === 'error') throw new Error('Sample Python failure');
      stdout('computed result');
      return undefined;
    },
  };
  const self = {
    postMessage: (x) => messages.push(x),
    loadPyodide: async () => runtime,
  };
  const context = vm.createContext({ self, importScripts: () => imports++ });
  vm.runInContext(code, context);
  assert.equal(imports, 0);
  await self.onmessage({ data: { code: 'print(1)' } });
  await self.onmessage({ data: { code: 'print(2)' } });
  assert.equal(imports, 1);
  assert.equal(namespaces.length, 2);
  assert.notEqual(namespaces[0], namespaces[1]);
  assert.equal(destroys, 2);
  assert.match(messages.at(-1).output, /computed result/);
  await self.onmessage({ data: { code: 'error' } });
  assert.equal(messages.at(-1).type, 'error');
  assert.match(messages.at(-1).output, /Sample Python failure/);
  assert.equal(destroys, 3);
});
test('Python worker caps output and rejects oversized input without execution', async () => {
  const messages = [];
  let stdout,
    runs = 0;
  const self = {
    postMessage: (x) => messages.push(x),
    loadPyodide: async () => ({
      setStdout: (x) => {
        stdout = x.batched;
      },
      setStderr: () => {},
      toPy: () => ({ destroy() {} }),
      runPythonAsync: async () => {
        runs++;
        stdout('a'.repeat(40000));
        stdout('b'.repeat(40000));
      },
    }),
  };
  vm.runInContext(code, vm.createContext({ self, importScripts() {} }));
  await self.onmessage({ data: { code: 'x'.repeat(30001) } });
  assert.equal(runs, 0);
  await self.onmessage({ data: { code: 'print()' } });
  assert.ok(messages.at(-1).output.length <= 20001);
});
