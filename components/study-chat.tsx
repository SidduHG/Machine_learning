'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import katex from 'katex';
import { Textarea } from '@/components/ui/textarea';
import { lessons } from '@/lib/curriculum';
import { answerQuestion, type TutorReply } from '@/lib/tutor';
type Exchange = { question: string; reply: TutorReply };
export default function StudyChat() {
  const path = usePathname();
  const routeLesson = path.startsWith('/learn/')
    ? path.split('/')[2]
    : undefined;
  const [lastPath, setLastPath] = useState(path),
    [topic, setTopic] = useState<string | undefined>(),
    [question, setQuestion] = useState(''),
    [messages, setMessages] = useState<Exchange[]>([]),
    [error, setError] = useState('');
  const bottom = useRef<HTMLDivElement>(null);
  const contextId = lastPath !== path ? routeLesson : (topic ?? routeLesson);
  const context = lessons.find((l) => l.id === contextId);
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [messages]);
  const ask = (text: string) => {
    try {
      const reply = answerQuestion(text, lessons, contextId);
      setMessages((old) => [...old, { question: text, reply }].slice(-20));
      setQuestion('');
      setError('');
      if (reply.lessonIds[0]) setTopic(reply.lessonIds[0]);
      setLastPath(path);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Try rephrasing your question.',
      );
    }
  };
  const suggestions = context
    ? ['Explain this', 'Show the math', 'Give me an example', 'Quiz me']
    : [
        'How does gradient descent work?',
        'Why does my loss increase?',
        'Explain PCA simply',
        'What is data leakage?',
      ];
  return (
    <>
      <div className="tutor-mode">
        <span className="live-dot" /> COURSE SEARCH · NO API KEY NEEDED
        <details>
          <summary>How this assistant works</summary>
          <p>
            Atlas finds and quotes relevant sections of the original course. It
            can show examples, math, code, and related lessons. It is not a
            generative AI model and cannot solve arbitrary new problems.
            Questions stay in your browser; chat history is cleared when this
            panel closes.
          </p>
        </details>
      </div>
      {context && (
        <div className="tutor-context">
          <BookOpen size={15} />
          <span>Exploring: {context.title}</span>
        </div>
      )}
      <div
        className="tutor-messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div className="tutor-welcome">
            <Sparkles size={28} />
            <h3>What are you curious about?</h3>
            <p>
              Ask about a concept, request a worked example, or revisit the math
              behind a lesson.
            </p>
            <div className="tutor-suggestions">
              {suggestions.map((s) => (
                <button key={s} onClick={() => ask(s)}>
                  {s}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div className="chat-exchange" key={i}>
              <div className="chat-question">{m.question}</div>
              <div className="chat-reply">
                <div className="chat-author">
                  <Sparkles size={14} />
                  ATLAS · COURSE NOTES
                </div>
                <h3>{m.reply.heading}</h3>
                {m.reply.formula && (
                  <div
                    className="chat-equation"
                    dangerouslySetInnerHTML={{
                      __html: katex.renderToString(m.reply.formula, {
                        displayMode: true,
                        throwOnError: false,
                        trust: false,
                      }),
                    }}
                  />
                )}
                {m.reply.passages.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {m.reply.code && (
                  <pre>
                    <code>{m.reply.code}</code>
                  </pre>
                )}
                {m.reply.lessonIds.length > 0 && (
                  <div className="chat-citations">
                    <span>CONTINUE IN THE COURSE</span>
                    {m.reply.lessonIds.map((id) => (
                      <Link href={'/learn/' + id} key={id}>
                        <BookOpen size={14} />
                        {lessons.find((l) => l.id === id)?.title}
                        <ArrowUpRight size={14} />
                      </Link>
                    ))}
                  </div>
                )}
                {m.reply.sources.map((s) => (
                  <a
                    className="chat-source"
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Further reading: {s.title} ↗
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={bottom} />
      </div>
      <div className="tutor-compose">
        {messages.length > 0 && (
          <div className="chat-quick-actions">
            <button onClick={() => ask('Show the math')}>The math</button>
            <button onClick={() => ask('Give me an example')}>
              An example
            </button>
            <button
              onClick={() => {
                setMessages([]);
                setTopic(undefined);
              }}
              aria-label="Clear chat"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
        >
          <label htmlFor="tutor-question" className="sr-only">
            Ask about machine learning
          </label>
          <Textarea
            id="tutor-question"
            value={question}
            maxLength={1000}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                ask(question);
              }
            }}
            placeholder="Ask about a concept…"
            rows={2}
          />
          <button
            type="submit"
            aria-label="Send question"
            disabled={!question.trim()}
          >
            <ArrowUp size={19} />
          </button>
        </form>
        <output className="tutor-error">{error}</output>
        <p>Grounded in the course. Open the lesson for full context.</p>
      </div>
    </>
  );
}
