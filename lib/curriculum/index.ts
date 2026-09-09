import foundations from './foundations.json';
import mathematics from './mathematics.json';
import supervised from './supervised.json';
import models from './models.json';
import unsupervised from './unsupervised.json';
import engineering from './engineering.json';
import type { Lesson } from './types';
import { getChapter } from '../chapters';
export { modules } from './types';
export type { Lesson, Module } from './types';
export const lessons: Lesson[] = [
  ...foundations,
  ...mathematics,
  ...supervised,
  ...models,
  ...unsupervised,
  ...engineering,
].map((lesson) => ({
  ...lesson,
  chapter: getChapter(lesson.id),
  minutes: Math.max(lesson.minutes, 35),
}));
export const getLesson = (id: string) => lessons.find((l) => l.id === id);
export const getModuleLessons = (id: string) =>
  lessons.filter((l) => l.module === id);
