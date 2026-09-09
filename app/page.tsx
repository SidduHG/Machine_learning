import Link from 'next/link';
import { lessons, modules } from '@/lib/curriculum';
import { SurfacePreview } from '@/components/surface-preview';
export default function Home() {
  return (
    <main id="main">
      <section className="course-home wrap">
        <div className="course-home-copy">
          <div className="eyebrow">AN OPEN COURSE IN CLASSICAL ML</div>
          <h1>Learn machine learning.</h1>
          <p>
            A structured course from Python and mathematics to reliable
            predictive models. Study the theory, work through the calculations,
            run the code and test your understanding.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/learn/what-is-ml">
              Start the first chapter →
            </Link>
            <Link className="button secondary" href="/learn">
              Browse the curriculum
            </Link>
          </div>
          <div className="course-home-facts">
            <span>30 detailed chapters</span>
            <span>7 visual labs</span>
            <span>No sign-in required</span>
          </div>
        </div>
        <div className="course-home-visual">
          <div className="course-home-visual-label">
            <span>INTERACTIVE LEARNING</span>
            <strong>Gradient descent</strong>
          </div>
          <SurfacePreview />
          <p>
            A model’s parameters move across its loss surface as the error
            changes.
          </p>
          <Link href="/labs?lab=gradient-descent">
            Explore the interactive lab →
          </Link>
        </div>
      </section>
      <section className="wrap course-home-section">
        <div className="course-home-section-head">
          <div>
            <div className="eyebrow">COURSE CONTENTS</div>
            <h2>Follow a clear learning sequence</h2>
          </div>
          <Link href="/learn">View all chapters →</Link>
        </div>
        <div className="home-module-grid">
          {modules.map((m, i) => (
            <article key={m.id}>
              <span className="home-module-number">
                MODULE {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <ul>
                {lessons
                  .filter((l) => l.module === m.id)
                  .map((l) => (
                    <li key={l.id}>
                      <Link href={'/learn/' + l.id}>{l.title} →</Link>
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="wrap course-home-section">
        <div className="home-study-tools">
          <article>
            <span>01</span>
            <h2>Run practical experiments</h2>
            <p>
              Edit Python examples and use four project notebooks to compare
              baselines, validate models and investigate errors.
            </p>
            <Link href="/practice">Open practice →</Link>
          </article>
          <article>
            <span>02</span>
            <h2>Test your understanding</h2>
            <p>
              Work through 30 intermediate and advanced questions. Review the
              reasoning behind every answer and return to the relevant chapter.
            </p>
            <Link href="/assessment">Take the assessment →</Link>
          </article>
          <article>
            <span>03</span>
            <h2>Study the primary references</h2>
            <p>
              Follow a curated guide to ISLP, Inria, Stanford CS229, StatQuest,
              official documentation and original algorithm papers.
            </p>
            <Link href="/resources">Browse the resource guide →</Link>
          </article>
        </div>
      </section>
    </main>
  );
}
