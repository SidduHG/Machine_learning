import Link from 'next/link';
import { lessons, modules } from '@/lib/curriculum';
import { ChapterOutline } from './chapter-outline';
export function LessonShell({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="textbook-layout">
      <aside className="textbook-sidebar">
        <Link className="textbook-course-title" href="/learn">
          Machine Learning Tutorial
        </Link>
        <details className="textbook-mobile-nav">
          <summary>Browse all chapters</summary>
          <CourseNavigation current={current} />
        </details>
        <div className="textbook-desktop-nav">
          <CourseNavigation current={current} />
        </div>
      </aside>
      <article className="textbook-article">{children}</article>
      <ChapterOutline chapterId={current} />
    </div>
  );
}
function CourseNavigation({ current }: { current: string }) {
  return (
    <nav aria-label="Course chapters">
      {modules.map((m, index) => (
        <div className="textbook-nav-group" key={m.id}>
          <h2>
            <span className="nav-module-index">
              {String(index + 1).padStart(2, '0')}
            </span>
            {m.title}
          </h2>
          {lessons
            .filter((l) => l.module === m.id)
            .map((l) => (
              <Link
                key={l.id}
                href={'/learn/' + l.id}
                aria-current={current === l.id ? 'page' : undefined}
              >
                {l.title}
              </Link>
            ))}
        </div>
      ))}
      <Link className="textbook-assessment-link" href="/assessment">
        ML assessment · 30 questions
      </Link>
    </nav>
  );
}
