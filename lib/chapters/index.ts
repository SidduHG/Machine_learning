import foundations from './foundations.json';
import mathematics from './mathematics.json';
import supervised from './supervised.json';
import models from './models.json';
import unsupervised from './unsupervised.json';
import engineering from './engineering.json';
import type { Chapter } from './types';
export const chapters: Chapter[] = [
  ...foundations,
  ...mathematics,
  ...supervised,
  ...models,
  ...unsupervised,
  ...engineering,
];
export const getChapter = (id: string) =>
  chapters.find((chapter) => chapter.id === id);
