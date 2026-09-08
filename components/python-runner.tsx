'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Square, RotateCcw, Download } from 'lucide-react';
import { downloadText } from './lesson-tools';
export function PythonRunner({
  initialCode,
  id,
}: {
  initialCode: string;
  id: string;
}) {
  const [code, setCode] = useState(initialCode),
    [output, setOutput] = useState('Your output will appear here.'),
    [status, setStatus] = useState<
      'idle' | 'loading' | 'running' | 'done' | 'error'
    >('idle');
  const worker = useRef<Worker | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  const clear = () => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
  };
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      worker.current?.terminate();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);
  const stop = (message = 'Stopped. You can edit the code and run again.') => {
    worker.current?.terminate();
    worker.current = null;
    clear();
    setStatus('idle');
    setOutput(message);
  };
  const run = () => {
    if (status === 'running' || status === 'loading' || !code.trim()) return;
    clear();
    setOutput('');
    setStatus('loading');
    try {
      if (!worker.current) {
        worker.current = new Worker('/python-worker.js');
        worker.current.onmessage = ({ data }) => {
          if (!alive.current) return;
          if (data.type === 'loading') {
            setStatus('loading');
            setOutput(
              'Downloading Python for your browser. First load may take a minute…',
            );
          } else if (data.type === 'running') {
            clear();
            setStatus('running');
            setOutput('Running your code…');
            timeout.current = setTimeout(
              () =>
                stop(
                  'Execution stopped after 10 seconds. Shorten the calculation or fix a possible infinite loop.',
                ),
              10000,
            );
          } else if (data.type === 'done' || data.type === 'error') {
            clear();
            setStatus(data.type);
            setOutput(String(data.output));
          }
        };
        worker.current.onerror = () =>
          stop(
            'Python could not start. Check your connection and try again, or download the code to run locally.',
          );
      }
      timeout.current = setTimeout(
        () =>
          stop(
            'Python download timed out. Check your connection and retry, or download the example.',
          ),
        90000,
      );
      worker.current.postMessage({ code });
    } catch {
      stop(
        'This browser could not start a worker. Download the example to run it locally.',
      );
    }
  };
  return (
    <div className="python-studio">
      <div className="studio-toolbar">
        <span>
          <i />
          PYTHON STUDIO
        </span>
        <div>
          <button
            onClick={() => downloadText(code, id + '.py', 'text/x-python')}
            aria-label="Download Python code"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => {
              stop();
              setCode(initialCode);
              setOutput('Example restored.');
            }}
            aria-label="Restore original example"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <label className="sr-only" htmlFor="python-code">
        Editable Python code
      </label>
      <textarea
        id="python-code"
        className="python-editor"
        spellCheck={false}
        value={code}
        maxLength={30000}
        onChange={(e) => setCode(e.target.value)}
        rows={14}
      />
      <div className="studio-runbar">
        <div className="actions">
          <button
            className="button primary"
            onClick={run}
            disabled={
              !code.trim() || status === 'loading' || status === 'running'
            }
          >
            <Play size={16} />
            {status === 'loading'
              ? 'Loading Python…'
              : status === 'running'
                ? 'Running…'
                : 'Run code'}
          </button>
          {(status === 'running' || status === 'loading') && (
            <button className="button secondary" onClick={() => stop()}>
              <Square size={14} />
              Stop
            </button>
          )}
        </div>
        <span>Python · standard library · runs on your device</span>
      </div>
      <div className="studio-output">
        <div>
          <span>OUTPUT</span>
          <span className={'run-status status-' + status}>{status}</span>
        </div>
        <pre aria-live="polite" aria-label="Python execution output">
          {output}
        </pre>
      </div>
      <p className="runner-note">
        First run downloads Pyodide from jsDelivr. Standard-library examples run
        here; notebooks that use scikit-learn or PyTorch run in Jupyter or
        Colab. Each run has a fresh Python namespace and a 10-second execution
        limit.
      </p>
    </div>
  );
}
