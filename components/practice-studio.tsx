'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Download, FolderCode } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from '@/components/ui/native-select';
import { PythonRunner } from './python-runner';
import { LessonQuiz } from './lesson-progress';
import projects from '@/lib/projects.json';
import type { Lesson, Module } from '@/lib/curriculum/types';
type PracticeLesson = Pick<
  Lesson,
  'id' | 'title' | 'module' | 'code' | 'quiz' | 'exercise' | 'solution'
>;
export function PracticeStudio({
  lessons,
  modules,
  initial,
}: {
  lessons: PracticeLesson[];
  modules: Module[];
  initial: string;
}) {
  const [lessonId, setLessonId] = useState(
    lessons.some((l) => l.id === initial) ? initial : lessons[0].id,
  );
  const lesson = lessons.find((l) => l.id === lessonId)!;
  return (
    <Tabs defaultValue="studio">
      <TabsList className="course-tabs">
        <TabsTrigger value="studio">Python studio</TabsTrigger>
        <TabsTrigger value="checks">Knowledge checks</TabsTrigger>
        <TabsTrigger value="projects">Portfolio projects</TabsTrigger>
      </TabsList>
      <TabsContent value="studio">
        <div className="practice-heading">
          <div>
            <label htmlFor="practice-example">Choose an example</label>
            <NativeSelect
              id="practice-example"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
              {modules.map((m) => (
                <NativeSelectOptGroup key={m.id} label={m.title}>
                  {lessons
                    .filter((l) => l.module === m.id)
                    .map((l) => (
                      <NativeSelectOption value={l.id} key={l.id}>
                        {l.title}
                      </NativeSelectOption>
                    ))}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
          </div>
          <Link className="text-link" href={'/learn/' + lesson.id}>
            Read the lesson <ArrowUpRight size={16} />
          </Link>
        </div>
        <PythonRunner
          key={lesson.id}
          id={lesson.id}
          initialCode={lesson.code}
        />
        <div className="practice-challenge panel">
          <div className="eyebrow">MAKE ONE CHANGE. EXPLAIN THE RESULT.</div>
          <h2>Your experiment</h2>
          <p>{lesson.exercise}</p>
          <details>
            <summary>Show the worked answer</summary>
            <p>{lesson.solution}</p>
          </details>
        </div>
      </TabsContent>
      <TabsContent value="checks">
        <div className="practice-heading">
          <div>
            <label htmlFor="quiz-example">Choose a lesson to revisit</label>
            <NativeSelect
              id="quiz-example"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
              {lessons.map((l) => (
                <NativeSelectOption value={l.id} key={l.id}>
                  {l.title}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        </div>
        <LessonQuiz key={lesson.id} id={lesson.id} quiz={lesson.quiz} />
        <p className="muted">
          Your latest answer is saved on this device. Revisit the explanation
          and try again whenever you like.
        </p>
      </TabsContent>
      <TabsContent value="projects">
        <div className="project-grid">
          {projects.map((p) => (
            <article key={p.id} className="project-card panel">
              <div className="project-top">
                <FolderCode size={25} />
                <span>
                  {p.level} · {p.hours}
                </span>
              </div>
              <div className="eyebrow">{p.category}</div>
              <h2>{p.title}</h2>
              <p>{p.summary}</p>
              <div className="project-data">
                <strong>THE DATA</strong>
                <span>{p.dataset}</span>
              </div>
              <details>
                <summary>Project brief & acceptance criteria</summary>
                <p>{p.brief}</p>
                <h3>Your plan</h3>
                <ol>
                  {p.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <h3>Definition of done</h3>
                <ul>
                  {p.rubric.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <h3>Go further</h3>
                <p>{p.extension}</p>
              </details>
              <div className="project-actions">
                <a
                  className="button primary"
                  href={'/notebooks/' + p.id + '.ipynb'}
                  download
                >
                  <Download size={16} />
                  Download notebook
                </a>
                <a
                  className="text-link"
                  href={p.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source <ArrowUpRight size={16} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="runner-note">
          Notebooks include runnable starting pipelines and a review rubric. Use
          Jupyter or Colab with the listed packages; the small in-browser studio
          supports standard-library examples.
        </p>
      </TabsContent>
    </Tabs>
  );
}
