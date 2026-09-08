'use client';
import { useState } from 'react';
import { Download, Printer, Copy, Check } from 'lucide-react';
export function downloadText(
  text: string,
  name: string,
  type = 'text/markdown',
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function LessonTools({ notes, id }: { notes: string; id: string }) {
  return (
    <div className="lesson-tools">
      <button
        className="button secondary"
        onClick={() => downloadText(notes, id + '.md')}
      >
        <Download size={16} />
        Download notes
      </button>
      <button className="button secondary" onClick={() => window.print()}>
        <Printer size={16} />
        Print / PDF
      </button>
    </div>
  );
}
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>PYTHON · STANDARD LIBRARY</span>
        <button
          aria-label="Copy Python example"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setCopied(true);
              setError(false);
              setTimeout(() => setCopied(false), 1800);
            } catch {
              setError(true);
            }
          }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}{' '}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      {error && (
        <output>Copy unavailable. Select the code to copy it manually.</output>
      )}
    </div>
  );
}
export function RevealAnswer({ answer }: { answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="button secondary"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Hide worked answer' : 'Reveal worked answer'}
      </button>
      {open && <p className="answer-reveal">{answer}</p>}
    </div>
  );
}
