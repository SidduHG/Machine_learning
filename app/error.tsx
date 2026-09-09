'use client';
import Link from 'next/link';
export default function CourseError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="wrap section empty-state">
      <div className="eyebrow">LET’S TRY THAT AGAIN</div>
      <h1>This page couldn’t load.</h1>
      <p>
        Your saved learning progress stays in this browser. Retry the page or
        return to the course.
      </p>
      <div className="hero-actions">
        <button className="button primary" onClick={reset}>
          Try again
        </button>
        <Link className="button secondary" href="/learn">
          Back to the course
        </Link>
      </div>
    </main>
  );
}
