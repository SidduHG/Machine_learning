'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
const sections = [
  ['Theory', 'theory'],
  ['Mathematics', 'mathematics'],
  ['Worked example', 'worked-example'],
  ['Python code', 'code'],
  ['Visualization', 'visualization'],
  ['Case study', 'case-study'],
  ['Exercises & quiz', 'exercises'],
  ['Books & videos', 'reading'],
];
export function ChapterOutline({ chapterId }: { chapterId: string }) {
  const [position, setPosition] = useState({ percent: 0, active: 'theory' });
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const article = document.querySelector('.textbook-article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight + 110);
      const percent = Math.max(
        0,
        Math.min(100, Math.round(((110 - rect.top) / distance) * 100)),
      );
      let active = 'theory';
      for (const [, id] of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 160) active = id;
      }
      setPosition((old) =>
        old.percent === percent && old.active === active
          ? old
          : { percent, active },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [chapterId]);
  return (
    <aside className="textbook-toc">
      <div className="reading-status">
        <span>
          <BookOpen size={14} /> Reading progress
        </span>
        <strong>{position.percent}%</strong>
        <Progress
          value={position.percent}
          aria-label="Position through this chapter"
        />
      </div>
      <span>IN THIS CHAPTER</span>
      <nav aria-label="Chapter sections">
        {sections.map(([label, id], i) => (
          <a
            href={'#' + id}
            key={id}
            aria-current={position.active === id ? 'location' : undefined}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            {label}
          </a>
        ))}
      </nav>
      <div className="outline-assessment">
        <span>CHECK YOUR KNOWLEDGE</span>
        <Link href="/assessment">
          ML assessment <ArrowUpRight size={16} />
        </Link>
        <p>30 questions with explained answers.</p>
      </div>
    </aside>
  );
}
