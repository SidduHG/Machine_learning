import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import katex from 'katex';
import { lessons, getLesson, modules } from '@/lib/curriculum';
import { getChapter } from '@/lib/chapters';
import library from '@/lib/reading-library.json';
import videos from '@/lib/chapter-videos.json';
import practicalExamples from '@/lib/practical-examples.json';
import { lessonMarkdown } from '@/lib/notes';
import { LessonShell } from '@/components/lesson-shell';
import {
  LessonProgress,
  LessonQuiz,
  PersonalNote,
} from '@/components/lesson-progress';
import {
  LessonTools,
  CodeBlock,
  RevealAnswer,
} from '@/components/lesson-tools';
import { LessonExperiment } from '@/components/lesson-experiment';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = getLesson((await params).slug);
  return { title: l?.title ?? 'Lesson not found', description: l?.summary };
}
function Equation({ formula }: { formula: string }) {
  return (
    <div
      className="equation"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(formula, {
          displayMode: true,
          throwOnError: false,
          trust: false,
          output: 'htmlAndMathml',
        }),
      }}
    />
  );
}
export default async function LessonPage({ params }: Props) {
  const l = getLesson((await params).slug);
  if (!l) notFound();
  const chapter = getChapter(l.id);
  const video = videos.find((v) => v.lesson === l.id);
  const practical = practicalExamples.find((example) => example.id === l.id);
  const mod = modules.find((m) => m.id === l.module)!;
  const index = lessons.indexOf(l);
  const previous = lessons[index - 1],
    next = lessons[index + 1];
  return (
    <main id="main">
      <LessonShell current={l.id}>
        <header className="textbook-head">
          <div className="textbook-breadcrumb">
            <Link href="/learn">Machine learning</Link>
            <span>/</span>
            <span>{mod.title}</span>
          </div>
          <h1>{l.title}</h1>
          <p>{l.summary}</p>
          <div className="textbook-meta">
            Chapter {index + 1} of {lessons.length} · Original course notes ·
            Classical ML
          </div>
          <div className="textbook-page-buttons">
            {previous ? (
              <Link className="button secondary" href={'/learn/' + previous.id}>
                ← Previous
              </Link>
            ) : (
              <Link className="button secondary" href="/learn">
                ← Contents
              </Link>
            )}
            {next && (
              <Link className="button primary" href={'/learn/' + next.id}>
                Next chapter →
              </Link>
            )}
          </div>
          <LessonTools id={l.id} notes={lessonMarkdown(l)} />
        </header>
        {chapter && (
          <div className="chapter-objectives">
            <h2>Learning objectives</h2>
            <ul>
              {chapter.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            {chapter.prerequisites.length > 0 && (
              <p>
                <strong>Prerequisites: </strong>
                {chapter.prerequisites.map((id, i) => (
                  <span key={id}>
                    {i > 0 ? ', ' : ''}
                    <Link href={'/learn/' + id}>
                      {getLesson(id)?.title ?? id}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
        <section className="chapter-section" id="theory">
          <h2>Theory</h2>
          {l.intuition.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {chapter?.sections.map((s) => (
            <section key={s.title}>
              <h3>{s.title}</h3>
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
          <h3>Procedure</h3>
          <ol>
            {l.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        <section className="chapter-section" id="mathematics">
          <h2>Mathematical explanation</h2>
          <Equation formula={l.formula} />
          <p>{l.symbols}</p>
          {chapter && (
            <>
              <h3>{chapter.derivation.title}</h3>
              {chapter.derivation.steps.map((step, i) => (
                <div className="derivation-step" key={i}>
                  <p>
                    <strong>Step {i + 1}.</strong> {step.explanation}
                  </p>
                  <Equation formula={step.formula} />
                </div>
              ))}
            </>
          )}
        </section>
        <section
          className="chapter-section chapter-example"
          id="worked-example"
        >
          <h2>Worked example</h2>
          <h3>{l.example.title}</h3>
          <p>{l.example.body}</p>
          <ol>
            {l.example.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        <section className="chapter-section" id="code">
          <h2>Python implementation</h2>
          <h3>Inspect the calculation</h3>
          <p>
            This runnable example isolates the calculation using the Python
            standard library. Use the project notebooks for complete
            scikit-learn workflows.
          </p>
          <CodeBlock code={l.code} />
          <Link className="button primary" href={'/practice?lesson=' + l.id}>
            Edit and run this code →
          </Link>
          {practical && (
            <div className="chapter-library-example">
              <h3>{practical.title}</h3>
              <p>{practical.environment}</p>
              <CodeBlock code={practical.code} label="Python · scikit-learn" />
              <a
                className="button secondary"
                href={'/examples/' + l.id + '.py'}
                download
              >
                Download complete Python example
              </a>
              <p>
                <strong>Experiment:</strong> {practical.experiment}
              </p>
            </div>
          )}
        </section>
        <section className="chapter-section" id="visualization">
          <h2>Visualization</h2>
          {l.lab ? (
            <LessonExperiment id={l.lab} />
          ) : (
            <div className="concept-flow" aria-label="Calculation sequence">
              {l.steps.map((step, i) => (
                <div key={step}>
                  <span>{i + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        {chapter && (
          <section className="chapter-section" id="case-study">
            <h2>Real-world application</h2>
            <h3>{chapter.caseStudy.title}</h3>
            <p>{chapter.caseStudy.scenario}</p>
            <h4>Decisions to make</h4>
            <ol>
              {chapter.caseStudy.decisions.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
            <div className="chapter-note">
              <strong>Expected deliverable.</strong> {chapter.caseStudy.success}
            </div>
          </section>
        )}
        <section className="chapter-section">
          <h2>Common mistakes and limitations</h2>
          <ul>
            {l.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        <section className="chapter-section" id="exercises">
          <h2>Practice exercises</h2>
          <div className="chapter-problem">
            <h3>Exercise 1</h3>
            <p>{l.exercise}</p>
            <RevealAnswer answer={l.solution} />
          </div>
          {chapter?.problems.map((p, i) => (
            <div className="chapter-problem" key={p.question}>
              <h3>Exercise {i + 2}</h3>
              <p>{p.question}</p>
              <details>
                <summary>Hint</summary>
                <p>{p.hint}</p>
              </details>
              <details>
                <summary>Worked solution</summary>
                <ol>
                  {p.solution.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </details>
            </div>
          ))}
          <h3>Chapter check</h3>
          <LessonQuiz id={l.id} quiz={l.quiz} />
          <div className="chapter-note">
            <strong>Ready for a broader challenge?</strong>{' '}
            <Link href="/assessment">Take the 30-question ML assessment</Link>.
            Questions test calculations, assumptions and experimental decisions,
            with explained answers.
          </div>
        </section>
        <section className="chapter-section" id="reading">
          <h2>Recommended books, tutorials and videos</h2>
          {chapter?.reading.map((r) => {
            const resource = library.find((s) => s.id === r.resource);
            return resource ? (
              <a
                className="chapter-reading"
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                key={r.resource}
              >
                <span>
                  {resource.kind} · {resource.authors}
                </span>
                <h3>{resource.title} ↗</h3>
                <p>
                  <strong>Read:</strong> {r.focus}
                </p>
                <p>
                  <strong>Apply:</strong> {r.task}
                </p>
              </a>
            ) : null;
          })}
          <a
            className="chapter-reading"
            href={video?.url ?? 'https://statquest.org/video_index.html'}
            target="_blank"
            rel="noreferrer"
          >
            <span>VIDEO REFERENCE · JOSH STARMER</span>
            <h3>{video?.title ?? 'StatQuest video index'} ↗</h3>
            <p>
              {video?.task ??
                'Find the corresponding statistics or classical-ML topic. Pause before a worked calculation, predict the next step, then compare your explanation.'}
            </p>
          </a>
          <h3>Technical references</h3>
          <ul>
            {l.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="textbook-meta">
            These are external references, not republished third-party books or
            transcripts.{' '}
            <Link href="/resources">Browse the full resource guide.</Link>
          </p>
        </section>
        <PersonalNote id={l.id} />
        <LessonProgress id={l.id} />
        <div className="lesson-pagination">
          {previous ? (
            <Link href={'/learn/' + previous.id}>← {previous.title}</Link>
          ) : (
            <Link href="/learn">Course contents</Link>
          )}
          {next ? (
            <Link href={'/learn/' + next.id}>{next.title} →</Link>
          ) : (
            <Link href="/assessment">Final ML assessment →</Link>
          )}
        </div>
      </LessonShell>
    </main>
  );
}
