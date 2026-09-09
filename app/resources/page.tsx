import type { Metadata } from 'next';
import Link from 'next/link';
import library from '@/lib/reading-library.json';
import videos from '@/lib/chapter-videos.json';
import { lessons } from '@/lib/curriculum';
export const metadata: Metadata = {
  title: 'Machine learning books, courses and videos',
};
export default function Resources() {
  return (
    <main id="main" className="wrap resource-guide">
      <header className="resource-guide-head">
        <div className="eyebrow">CURATED REFERENCE LIBRARY</div>
        <h1>Machine learning resources</h1>
        <p>
          A focused reading and viewing guide for this course. Use one main
          textbook, a practical companion, and selected deeper references. The
          goal is to apply what you study, not accumulate unfinished courses.
        </p>
      </header>
      <section className="resource-path">
        <h2>Recommended study order</h2>
        <ol>
          <li>
            <strong>Learn the topic here.</strong> Read the theory, calculate
            the example and run the code.
          </li>
          <li>
            <strong>Build intuition.</strong> Watch the matching StatQuest
            explanation or use Google’s introductory material.
          </li>
          <li>
            <strong>Practice the workflow.</strong> Use Inria’s scikit-learn
            course or the official ISLP lab.
          </li>
          <li>
            <strong>Go deeper.</strong> Read the selected ISLP chapter, CS229
            notes or original paper, then explain its assumptions.
          </li>
        </ol>
      </section>
      <section className="resource-guide-section">
        <h2>Books, courses and documentation</h2>
        <div className="resource-library">
          {library.map((r) => (
            <article key={r.id} id={r.id} className="resource-entry">
              <div className="resource-tags">
                <span>{r.kind}</span>
                <span>{r.level}</span>
              </div>
              <h3>
                <a href={r.url} target="_blank" rel="noreferrer">
                  {r.title} ↗
                </a>
              </h3>
              <p className="resource-author">{r.authors}</p>
              <p>{r.why}</p>
              <p>
                <strong>Focus:</strong> {r.focus}
              </p>
              <p>
                <strong>Study task:</strong> {r.task}
              </p>
              <p className="resource-access">{r.access}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="resource-guide-section">
        <h2>Selected StatQuest videos</h2>
        <p>
          Josh Starmer’s official video index provides the links below. These
          are external videos; ML Atlas does not redistribute their transcripts.
          Use captions or the transcript on YouTube when available, and pair
          each video with its course exercise.
        </p>
        <div className="video-library">
          {videos.map((v) => (
            <article key={v.lesson} className="video-entry">
              <span>STATQUEST · JOSH STARMER</span>
              <h3>
                <a href={v.url} target="_blank" rel="noreferrer">
                  {v.title} ↗
                </a>
              </h3>
              <p>{v.task}</p>
              <Link href={'/learn/' + v.lesson}>
                Related chapter: {lessons.find((l) => l.id === v.lesson)?.title}{' '}
                →
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="resource-guide-section">
        <h2>Quick syntax reference</h2>
        <article className="resource-entry">
          <h3>
            <a
              href="https://www.w3schools.com/python/python_ml_getting_started.asp"
              target="_blank"
              rel="noreferrer"
            >
              W3Schools Python Machine Learning tutorial ↗
            </a>
          </h3>
          <p>
            Use its short topic pages and code examples for a quick first
            encounter or syntax reminder. For mathematical depth and evaluation
            methodology, continue with the textbook and practical course above.
          </p>
          <p>
            <strong>Study task:</strong> Rebuild a short example, then identify
            its target, preprocessing, training data and evaluation boundary.
          </p>
        </article>
      </section>
      <section className="resource-guide-section resource-policy">
        <h2>Content, access and privacy</h2>
        <p>
          The chapters, worked examples and assessment are original ML Atlas
          material. External authors retain ownership of their books, videos,
          courses and papers. Recommendations do not imply endorsement. Public
          access to a resource does not automatically grant permission to
          repackage it.
        </p>
        <p>
          Original course prose uses CC BY 4.0; application and example code use
          MIT. Attribute ML Atlas and link to{' '}
          <a href="https://github.com/SidduHG/Machine_learning">
            the source repository
          </a>{' '}
          when reusing the original material. External assets keep their own
          terms.
        </p>
        <p>
          No learner account is required. Progress, notes, bookmarks and
          assessment attempts are stored in this browser. Export learning
          progress before clearing site data. The course adds no advertising or
          analytics; the host may retain access logs.
        </p>
        <p>
          Python loads the Pyodide runtime from jsDelivr when requested, then
          executes in a browser worker. Ask Atlas searches the course locally
          and does not send questions to an AI provider. It is a course-search
          assistant, not a generative model.
        </p>
        <p>
          The current course covers classical ML. Deep learning is deferred. The
          course is not an exhaustive research encyclopedia or a guarantee of
          employment.{' '}
          <a href="https://github.com/SidduHG/Machine_learning/issues">
            Report a correction
          </a>{' '}
          with the chapter, calculation and supporting source.
        </p>
      </section>
    </main>
  );
}
