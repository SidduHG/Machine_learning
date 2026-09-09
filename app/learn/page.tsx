import type { Metadata } from 'next';
import { lessons, modules } from '@/lib/curriculum';
import { CurriculumBrowser } from '@/components/curriculum-browser';
export const metadata: Metadata = { title: 'The learning path' };
export default function Learn() {
  return (
    <main id="main" className="wrap learning-page">
      <div className="page-head">
        <div className="eyebrow">THE LEARNING PATH</div>
        <h1>Machine learning curriculum</h1>
        <p>
          Follow the chapters in order: theory, mathematical explanation, worked
          examples, Python code, interactive demonstrations and exercises. This
          release focuses on classical machine learning.
        </p>
        <div className="course-stats">
          <span>
            <strong>{modules.length}</strong> modules
          </span>
          <span>
            <strong>{lessons.length}</strong> original lessons
          </span>
          <span>
            <strong>
              {Math.round(lessons.reduce((n, l) => n + l.minutes, 0) / 60)}
            </strong>{' '}
            hours of guided study
          </span>
          <span>No sign-in required</span>
        </div>
      </div>
      <CurriculumBrowser
        modules={modules}
        lessons={lessons.map(
          ({ id, title, summary, module, minutes, lab }) => ({
            id,
            title,
            summary,
            module,
            minutes,
            lab,
          }),
        )}
      />
    </main>
  );
}
