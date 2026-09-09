'use client';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import questions from '@/lib/assessment.json';
import {
  freshAssessment,
  parseAssessment,
  gradeAssessment,
  type AssessmentState,
} from '@/lib/assessment';
const key = 'ml-atlas-assessment-v1';
const empty = { data: freshAssessment(), warning: '' };
let cache: string | null | undefined;
let snapshot = empty;
function read() {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== cache) {
      cache = raw;
      try {
        snapshot = { data: parseAssessment(raw, questions), warning: '' };
      } catch {
        snapshot = {
          data: freshAssessment(),
          warning:
            'The saved assessment could not be read. A new attempt will replace it.',
        };
      }
    }
    return snapshot;
  } catch {
    return empty;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('ml-assessment', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ml-assessment', callback);
  };
}
export function CourseAssessment() {
  const { data, warning } = useSyncExternalStore(subscribe, read, () => empty);
  const [index, setIndex] = useState(0),
    [error, setError] = useState(''),
    [confirmReset, setConfirmReset] = useState(false);
  const q = questions[index];
  const grade = gradeAssessment(questions, data.answers);
  const save = (next: AssessmentState) => {
    try {
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event('ml-assessment'));
      setError('');
      return true;
    } catch {
      setError(
        'Your browser could not save this answer. Enable site storage to keep an assessment attempt.',
      );
      return false;
    }
  };
  return (
    <div className="assessment-layout">
      <aside className="assessment-map">
        <h2>{data.submitted ? 'Results' : 'Your attempt'}</h2>
        <p>
          {grade.answered} / {grade.total} answered
        </p>
        <div className="question-map">
          {questions.map((item, i) => (
            <button
              key={item.id}
              aria-label={
                'Question ' +
                (i + 1) +
                (data.flagged.includes(item.id) ? ', flagged' : '')
              }
              aria-current={index === i ? 'step' : undefined}
              className={[
                data.answers[item.id] !== undefined ? 'answered' : '',
                data.flagged.includes(item.id) ? 'flagged' : '',
                data.submitted
                  ? data.answers[item.id] === item.answer
                    ? 'correct'
                    : 'incorrect'
                  : '',
              ].join(' ')}
              onClick={() => setIndex(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="assessment-small">
          Saved automatically in this browser. Yellow borders mark questions to
          review.
        </p>
        {data.submitted && (
          <div className="assessment-score">
            <strong>
              {grade.correct}/{grade.total}
            </strong>
            <span>
              {Math.round((100 * grade.correct) / grade.total)}% correct
            </span>
            <p>
              This is a learning diagnostic, not a professional certification.
            </p>
          </div>
        )}
        <button className="text-link" onClick={() => setConfirmReset(true)}>
          Start a new attempt
        </button>
        {confirmReset && (
          <div className="assessment-reset">
            <p>Replace the saved answers and result?</p>
            <button
              className="button secondary"
              onClick={() => {
                if (save(freshAssessment())) {
                  setIndex(0);
                  setConfirmReset(false);
                }
              }}
            >
              Reset attempt
            </button>
            <button onClick={() => setConfirmReset(false)}>Keep attempt</button>
          </div>
        )}
      </aside>
      <div className="assessment-main">
        <div className="assessment-question-meta">
          <span>
            QUESTION {index + 1} OF {questions.length}
          </span>
          <span>
            {q.difficulty} · {q.topic}
          </span>
        </div>
        <h2>{q.question}</h2>
        <RadioGroup
          value={
            data.answers[q.id] === undefined ? '' : String(data.answers[q.id])
          }
          onValueChange={(value) => {
            if (!data.submitted)
              save({
                ...data,
                answers: { ...data.answers, [q.id]: Number(value) },
              });
          }}
          disabled={data.submitted}
          aria-label={'Answer to question ' + (index + 1)}
          className="assessment-options"
        >
          {q.options.map((option, i) => (
            <label
              key={option}
              className={
                data.submitted
                  ? i === q.answer
                    ? 'correct'
                    : data.answers[q.id] === i
                      ? 'incorrect'
                      : ''
                  : ''
              }
            >
              <RadioGroupItem value={String(i)} id={q.id + '-' + i} />
              <span>
                <b>{String.fromCharCode(65 + i)}.</b> {option}
              </span>
            </label>
          ))}
        </RadioGroup>
        {!data.submitted && (
          <button
            className="assessment-flag"
            aria-pressed={data.flagged.includes(q.id)}
            onClick={() =>
              save({
                ...data,
                flagged: data.flagged.includes(q.id)
                  ? data.flagged.filter((id) => id !== q.id)
                  : [...data.flagged, q.id],
              })
            }
          >
            {data.flagged.includes(q.id)
              ? '✓ Flagged for review'
              : 'Flag for review'}
          </button>
        )}
        {data.submitted && (
          <div className="assessment-explanation">
            <h3>
              {data.answers[q.id] === q.answer
                ? 'Correct'
                : 'Review this concept'}
            </h3>
            <p>{q.explanation}</p>
            <h4>Why each option is right or wrong</h4>
            <ol>
              {q.rationales.map((r, i) => (
                <li key={r}>
                  <strong>{String.fromCharCode(65 + i)}.</strong> {r}
                </li>
              ))}
            </ol>
            <Link href={'/learn/' + q.lesson}>
              Review the related chapter →
            </Link>
          </div>
        )}
        <output className="assessment-error" aria-live="polite">
          {error || warning}
        </output>
        <div className="assessment-navigation">
          <button
            className="button secondary"
            disabled={index === 0}
            onClick={() => setIndex(index - 1)}
          >
            ← Previous
          </button>
          {index < questions.length - 1 ? (
            <button
              className="button primary"
              onClick={() => setIndex(index + 1)}
            >
              Next question →
            </button>
          ) : !data.submitted ? (
            <button
              className="button primary"
              onClick={() => {
                if (grade.answered !== grade.total) {
                  setError(
                    'Answer all 30 questions before submitting. Use the numbered map to find unanswered questions.',
                  );
                  return;
                }
                save({ ...data, submitted: true });
              }}
            >
              Submit and review
            </button>
          ) : (
            <Link className="button primary" href="/learn">
              Return to course
            </Link>
          )}
        </div>
        {!data.submitted && (
          <p className="assessment-small">
            Answers and explanations appear after you submit all questions. Use
            paper or the Python studio for calculations.
          </p>
        )}
        {data.submitted && grade.review.length > 0 && (
          <div className="assessment-review-links">
            <h3>Suggested revision</h3>
            {[...new Set(grade.review)].map((id) => (
              <Link key={id} href={'/learn/' + id}>
                {questions.find((item) => item.lesson === id)?.topic ?? id} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
