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
export function CodeBlock({
  code,
  label = 'Python · standard library',
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          <i className="code-language-dot" />
          {label}
        </span>
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
        <code>
          {code
            .trimEnd()
            .split('\n')
            .map((line, index) => (
              <span className="code-line" key={index}>
                <span className="code-line-number" aria-hidden="true">
                  {index + 1}
                </span>
                <span>{highlightPython(line)}</span>
              </span>
            ))}
        </code>
      </pre>
      {error && (
        <output>Copy unavailable. Select the code to copy it manually.</output>
      )}
    </div>
  );
}
function highlightPython(line: string) {
  const pattern =
    /(#[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:from|import|as|def|return|for|in|if|else|elif|while|try|except|with|True|False|None|and|or|not|assert|raise|class|lambda)\b|\b\d+(?:\.\d+)?\b)/g;
  const nodes: React.ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(pattern)) {
    const index = match.index;
    nodes.push(line.slice(last, index));
    const token = match[0];
    const kind = token.startsWith('#')
      ? 'comment'
      : /^['"]/.test(token)
        ? 'string'
        : /^\d/.test(token)
          ? 'number'
          : 'keyword';
    nodes.push(
      <span className={'syntax-' + kind} key={index}>
        {token}
      </span>,
    );
    last = index + token.length;
  }
  nodes.push(line.slice(last));
  return nodes;
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
