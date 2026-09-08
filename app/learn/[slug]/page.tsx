import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import katex from 'katex';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Cuboid,
} from 'lucide-react';
import {
  lessons,
  getLesson,
  getModuleLessons,
  modules,
} from '@/lib/curriculum';
import { lessonMarkdown } from '@/lib/notes';
import { LessonShell } from '@/components/lesson-shell';
import { LessonProgress, LessonQuiz, PersonalNote } from '@/components/lesson-progress';
import {
  LessonTools,
  CodeBlock,
  RevealAnswer,
} from '@/components/lesson-tools';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = getLesson((await params).slug);
  return { title: l?.title ?? 'Lesson not found', description: l?.summary };
}
export default async function LessonPage({ params }: Props) {
  const l = getLesson((await params).slug);
  if (!l) notFound();
  const mod = modules.find((m) => m.id === l.module)!;
  const index = lessons.indexOf(l);
  const previous = lessons[index - 1],
    next = lessons[index + 1];
  return (
    <main id="main">
      <LessonShell
        title={mod.title}
        current={l.id}
        items={getModuleLessons(mod.id).map(({ id, title }) => ({ id, title }))}
      >
        <header className="lesson-head">
          <div className="eyebrow">
            {mod.title} <span> / </span> LESSON{' '}
            {String(index + 1).padStart(2, '0')}
          </div>
          <h1>{l.title}</h1>
          <p>{l.summary}</p>
          <div className="lesson-head-meta">
            <span>
              <Clock size={15} />
              {l.minutes} min guided study
            </span>
            <span>Original notes · Updated Sep 2026</span>
          </div>
          <LessonTools id={l.id} notes={lessonMarkdown(l)} />
        </header>
        <section className="lesson-section" id="intuition">
          <span className="section-index">01 / THE INTUITION</span>
          <h2>Start with the idea.</h2>
          {l.intuition.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section className="lesson-section" id="steps">
          <span className="section-index">02 / HOW IT WORKS</span>
          <h2>One step at a time.</h2>
          <ol className="numbered-steps">
            {l.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        <section className="lesson-section" id="math">
          <span className="section-index">03 / THE MATHEMATICS</span>
          <h2>Give the idea a precise shape.</h2>
          <div
            className="equation"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(l.formula, {
                displayMode: true,
                throwOnError: false,
                trust: false,
                output: 'htmlAndMathml',
              }),
            }}
          />
          <p>{l.symbols}</p>
        </section>
        <section className="worked-example" id="example">
          <div className="eyebrow">LET’S WORK THROUGH IT</div>
          <h2>{l.example.title}</h2>
          <p>{l.example.body}</p>
          <ol className="numbered-steps">
            {l.example.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
        {l.lab && (
          <Link href={'/labs?lab=' + l.lab} className="lesson-lab-link">
            <Cuboid size={27} />
            <div>
              <strong>Make the idea move.</strong>
              <span>Open the interactive visual lab</span>
            </div>
            <ArrowUpRight />
          </Link>
        )}
        <section className="lesson-section">
          <span className="section-index">04 / FROM MATH TO CODE</span>
          <h2>See the calculation in Python.</h2>
          <p>
            This small example uses the Python standard library. Read it here,
            or edit and run it in the practice studio.
          </p>
          <CodeBlock code={l.code} />
          <Link className="text-link" href={'/practice?lesson=' + l.id}>
            Run & experiment <ArrowUpRight size={17} />
          </Link>
        </section>
        <section className="lesson-section pitfalls">
          <h2>Watch out for these.</h2>
          <ul>
            {l.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        <section className="lesson-section" id="practice">
          <span className="section-index">05 / CHECK YOUR UNDERSTANDING</span>
          <h2>Explain it back.</h2>
          <p>{l.exercise}</p>
          <RevealAnswer answer={l.solution} />
          <LessonQuiz id={l.id} quiz={l.quiz} />
        </section>
        <PersonalNote id={l.id} />
        <LessonProgress id={l.id} />
        <section className="lesson-section further-reading">
          <h2>Go to the source.</h2>
          <p>
            These references extend the original explanation above. They retain
            their own authorship and licenses.
          </p>
          {l.sources.map((s) => (
            <a href={s.url} key={s.url} target="_blank" rel="noreferrer">
              {s.title}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </section>
        <div className="lesson-pagination">
          {previous ? (
            <Link href={'/learn/' + previous.id}>
              <ArrowLeft size={18} />
              <div>
                <small>PREVIOUS LESSON</small>
                <span>{previous.title}</span>
              </div>
            </Link>
          ) : (
            <Link href="/learn">Back to the path</Link>
          )}
          {next ? (
            <Link href={'/learn/' + next.id}>
              <div>
                <small>UP NEXT</small>
                <span>{next.title}</span>
              </div>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <Link href="/practice">
              Build your next project <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </LessonShell>
    </main>
  );
}
