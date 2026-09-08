'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bookmark,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';
import { parseProgress, mergeProgress } from '@/lib/progress';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { downloadText } from '@/components/lesson-tools';
import type { Module } from '@/lib/curriculum/types';
type Summary = { id: string; title: string; module: string };
export function ProgressDashboard({
  lessons,
  modules,
}: {
  lessons: Summary[];
  modules: Module[];
}) {
  const { progress, update, warning } = useProgress();
  const [message, setMessage] = useState('');
  const completed = lessons.filter((l) => progress.completed.includes(l.id)),
    bookmarks = lessons.filter((l) => progress.bookmarks.includes(l.id)),
    noted = lessons.filter((l) => progress.notes[l.id]);
  const resume =
    lessons.find((l) => l.id === progress.lastLesson) ??
    lessons.find((l) => !progress.completed.includes(l.id)) ??
    lessons[0];
  const savedGroups: [string, Summary[]][] = [['bookmarks',bookmarks],['notes',noted],['completed',completed]];
  return (
    <>
      <div className="progress-overview">
        <div className="panel progress-welcome">
          <div className="eyebrow">A LITTLE FURTHER, EVERY DAY</div>
          <h2>
            {completed.length === lessons.length
              ? 'You’ve explored the whole path.'
              : 'Your next discovery is waiting.'}
          </h2>
          <p>
            {completed.length} of {lessons.length} lessons marked complete. Your
            learning belongs to you.
          </p>
          <Link href={'/learn/' + resume.id} className="button primary">
            {progress.lastLesson ? 'Continue learning' : 'Begin your journey'}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="panel progress-ring">
          <strong>
            {Math.round((completed.length / lessons.length) * 100)}
            <small>%</small>
          </strong>
          <span>of the path explored</span>
          <Progress
            aria-label="Course completion"
            value={(completed.length / lessons.length) * 100}
          />
          <p>
            {Object.values(progress.quiz).filter(Boolean).length} self-checks
            answered correctly
          </p>
        </div>
      </div>
      <div className="module-progress-grid">
        {modules.map((m) => {
          const group = lessons.filter((l) => l.module === m.id),
            count = group.filter((l) =>
              progress.completed.includes(l.id),
            ).length;
          return (
            <Link className="panel" href={'/learn#' + m.id} key={m.id}>
              <div>
                <h3>{m.title}</h3>
                <span>
                  {count}/{group.length}
                </span>
              </div>
              <Progress
                aria-label={m.title + ' completion'}
                value={(count / group.length) * 100}
              />
            </Link>
          );
        })}
      </div>
      <Tabs defaultValue="bookmarks">
        <TabsList className="course-tabs">
          <TabsTrigger value="bookmarks">
            Bookmarks ({bookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="notes">My notes ({noted.length})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>
        {savedGroups.map(([name, items]) => (
          <TabsContent value={name} key={name}>
            {items.length ? (
              items.map((l) => (
                <Link
                  className="saved-lesson panel"
                  href={'/learn/' + l.id}
                  key={l.id}
                >
                  {name === 'completed' ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                  <div>
                    <h3>{l.title}</h3>
                    {name === 'notes' && <p>{progress.notes[l.id]}</p>}
                  </div>
                  <ArrowRight size={18} />
                </Link>
              ))
            ) : (
              <div className="panel empty-state">
                <Bookmark />
                <h2>
                  {name === 'notes'
                    ? 'A place for your own explanations.'
                    : name === 'completed'
                      ? 'Your first finished lesson starts here.'
                      : 'Keep a good idea close.'}
                </h2>
                <p>
                  {name === 'notes'
                    ? 'Save a note at the end of any lesson.'
                    : 'Explore a lesson, then bookmark it or mark it complete.'}
                </p>
                <Link href="/learn" className="text-link">
                  Explore the learning path →
                </Link>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <section className="progress-backup panel">
        <div>
          <h2>Take your learning with you.</h2>
          <p>
            Progress stays on this device. Export a backup and import it
            elsewhere. Imports merge your progress; matching imported notes
            replace the saved note.
          </p>
        </div>
        <div className="actions">
          <button
            className="button secondary"
            onClick={() =>
              downloadText(
                JSON.stringify(progress, null, 2),
                'ml-atlas-progress.json',
                'application/json',
              )
            }
          >
            <Download size={16} />
            Export progress
          </button>
          <label className="button secondary import-label">
            <Upload size={16} />
            Import backup
            <input
              type="file"
              accept=".json,application/json"
              aria-label="Import progress backup"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  if (file.size > 1000000)
                    throw new Error(
                      'Please choose a backup smaller than 1 MB.',
                    );
                  const parsed = parseProgress(await file.text());
                  if (update((p) => mergeProgress(p, parsed)))
                    setMessage('Backup imported and merged successfully.');
                } catch (err) {
                  setMessage(
                    err instanceof Error
                      ? err.message
                      : 'Could not read that backup.',
                  );
                }
                e.target.value = '';
              }}
            />
          </label>
        </div>
        <output>{message || warning}</output>
      </section>
    </>
  );
}
