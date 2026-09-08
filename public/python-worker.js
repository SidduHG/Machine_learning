/* ML Atlas: Python execution in a dedicated browser worker. */
let runtime;
let busy = false;
self.onmessage = async ({ data }) => {
  if (busy || typeof data.code !== 'string' || data.code.length > 30000) return;
  busy = true;
  let buffer = '';
  const append = (text) => {
    if (buffer.length < 20000)
      buffer += String(text).slice(0, 20000 - buffer.length) + '\n';
  };
  try {
    if (!runtime) {
      self.postMessage({ type: 'loading' });
      importScripts(
        'https://cdn.jsdelivr.net/pyodide/v314.0.6/full/pyodide.js',
      );
      runtime = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v314.0.6/full/',
      });
    }
    runtime.setStdout({ batched: append });
    runtime.setStderr({ batched: append });
    self.postMessage({ type: 'running' });
    const globals = runtime.toPy({ __name__: '__main__' });
    try {
      const result = await runtime.runPythonAsync(data.code, { globals });
      if (result !== undefined) append(String(result));
      if (result && typeof result.destroy === 'function') result.destroy();
      self.postMessage({
        type: 'done',
        output:
          buffer || 'Finished successfully. Use print() to display a value.',
      });
    } finally {
      globals.destroy();
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      output: buffer + String(error).slice(0, 12000),
    });
  } finally {
    busy = false;
  }
};
