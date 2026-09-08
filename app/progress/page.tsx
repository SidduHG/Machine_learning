import type { Metadata } from 'next';
import { lessons, modules } from '@/lib/curriculum';
import { ProgressDashboard } from '@/components/progress-dashboard';
export const metadata: Metadata = { title: 'My learning' };
export default function ProgressPage() {
  return (
    <main id="main" className="wrap progress-page">
      <div className="page-head">
        <div className="eyebrow">MY LEARNING</div>
        <h1>Make room for your curiosity.</h1>
        <p>
          Your place in the course, your saved ideas, and your own explanations.
          No account needed. Everything is saved on this device.
        </p>
      </div>
      <ProgressDashboard
        modules={modules}
        lessons={lessons.map(({ id, title, module }) => ({
          id,
          title,
          module,
        }))}
      />
    </main>
  );
}
