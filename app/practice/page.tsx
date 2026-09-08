import type { Metadata } from 'next';
import { lessons, modules } from '@/lib/curriculum';
import { PracticeStudio } from '@/components/practice-studio';
export const metadata: Metadata = { title: 'Practice & portfolio projects' };
export default async function Practice({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const query = await searchParams;
  return (
    <main id="main" className="wrap practice-page">
      <div className="page-head">
        <div className="eyebrow">LEARN WITH YOUR HANDS</div>
        <h1>Ideas become skills here.</h1>
        <p>
          Run the lesson examples, check your intuition, and turn what you learn
          into a project you can explain.
        </p>
      </div>
      <PracticeStudio
        initial={query.lesson ?? 'linear-regression'}
        modules={modules}
        lessons={lessons.map(
          ({ id, title, module, code, quiz, exercise, solution }) => ({
            id,
            title,
            module,
            code,
            quiz,
            exercise,
            solution,
          }),
        )}
      />
    </main>
  );
}
