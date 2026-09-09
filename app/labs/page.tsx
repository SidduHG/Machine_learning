import type { Metadata } from 'next';
import { LabBrowser } from '@/components/labs/lab-browser';
export const metadata: Metadata = { title: 'Interactive visual labs' };
export default async function LabsPage({
  searchParams,
}: {
  searchParams: Promise<{ lab?: string }>;
}) {
  const { lab } = await searchParams;
  return (
    <main id="main" className="wrap labs-page">
      <div className="page-head">
        <div className="eyebrow">THE VISUAL LABORATORY</div>
        <h1>The moment it clicks.</h1>
        <p>
          Change a parameter. Follow a calculation. Watch an idea become
          something you can see. Seven experiments, with real math under every
          control.
        </p>
      </div>
      <LabBrowser key={lab ?? 'default'} initial={lab ?? 'gradient-descent'} />
    </main>
  );
}
