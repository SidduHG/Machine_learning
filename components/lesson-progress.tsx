'use client';
import { useEffect, useState } from 'react';
import { Bookmark, Check, Save } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';
import { toggleId } from '@/lib/progress';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Lesson } from '@/lib/curriculum/types';
export function LessonProgress({ id }: { id: string }) {
  const { progress, update, warning } = useProgress();
  useEffect(() => {
    if (progress.lastLesson !== id) update((p) => ({ ...p, lastLesson: id }));
  }, [id, progress.lastLesson, update]);
  return (
    <div className="progress-actions">
      <button
        className={
          'button ' +
          (progress.completed.includes(id) ? 'completed-button' : 'primary')
        }
        onClick={() =>
          update((p) => ({ ...p, completed: toggleId(p.completed, id) }))
        }
      >
        <Check size={16} />
        {progress.completed.includes(id)
          ? 'Completed · undo'
          : 'Mark lesson complete'}
      </button>
      <button
        className="button secondary"
        aria-pressed={progress.bookmarks.includes(id)}
        onClick={() =>
          update((p) => ({ ...p, bookmarks: toggleId(p.bookmarks, id) }))
        }
      >
        <Bookmark
          size={16}
          fill={progress.bookmarks.includes(id) ? 'currentColor' : 'none'}
        />
        {progress.bookmarks.includes(id) ? 'Bookmarked' : 'Bookmark'}
      </button>
      <span>Saved on this device</span>
      {warning && <output className="storage-warning">{warning}</output>}
    </div>
  );
}
export function LessonQuiz({ id, quiz }: { id: string; quiz: Lesson['quiz'] }) {
  const [selected, setSelected] = useState<string | null>(null),
    [checked, setChecked] = useState(false);
  const { update } = useProgress();
  const correct = Number(selected) === quiz.answer;
  return (
    <div className="lesson-quiz">
      <div className="eyebrow">QUICK CHECK</div>
      <h3 id={'quiz-' + id}>{quiz.question}</h3>
      <RadioGroup
        aria-labelledby={'quiz-' + id}
        value={selected ?? ''}
        onValueChange={(v) => {
          setSelected(String(v));
          setChecked(false);
        }}
      >
        {quiz.options.map((o, i) => (
          <label
            className={
              'quiz-option ' +
              (checked && i === quiz.answer ? 'correct-option' : '')
            }
            key={o}
            htmlFor={`${id}-option-${i}`}
          >
            <RadioGroupItem id={`${id}-option-${i}`} value={String(i)} />
            <span>{o}</span>
          </label>
        ))}
      </RadioGroup>
      <button
        className="button primary"
        disabled={selected === null}
        onClick={() => {
          setChecked(true);
          update((p) => ({ ...p, quiz: { ...p.quiz, [id]: correct } }));
        }}
      >
        Check answer
      </button>
      {checked && (
        <output
          className={
            'quiz-feedback ' + (correct ? 'is-correct' : 'is-incorrect')
          }
        >
          <strong>
            {correct ? 'That’s right.' : 'Not quite. Here’s why.'}
          </strong>
          {quiz.explanation}
        </output>
      )}
    </div>
  );
}
export function PersonalNote({ id }: { id: string }) {
  const { progress, update, warning } = useProgress();
  const [draft, setDraft] = useState<string | null>(null),
    [saved, setSaved] = useState(false);
  return (
    <div className="personal-note">
      <h2>Your words. Your understanding.</h2>
      <p>
        Explain the idea to your future self. Notes stay in this browser and are
        included in your progress export.
      </p>
      <label htmlFor={'note-' + id} className="sr-only">
        Personal notes for this lesson
      </label>
      <Textarea
        id={'note-' + id}
        value={draft ?? progress.notes[id] ?? ''}
        maxLength={10000}
        onChange={(e) => {
          setDraft(e.target.value);
          setSaved(false);
        }}
        placeholder="The idea clicked when…"
        rows={5}
      />
      <div>
        <button
          className="button secondary"
          onClick={() => {
            const ok = update((p) => ({
              ...p,
              notes: { ...p.notes, [id]: draft ?? progress.notes[id] ?? '' },
            }));
            setSaved(ok);
          }}
        >
          <Save size={16} />
          Save note
        </button>
        <output>{saved ? 'Note saved.' : warning}</output>
      </div>
    </div>
  );
}
