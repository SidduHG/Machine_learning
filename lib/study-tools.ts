import type { Lesson } from './curriculum/types';
import type { ProgressState } from './progress';
import { searchLessons } from './tutor.ts';

export type StudyTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
function objectInput(input: unknown, keys: string[]) {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('Expected an input object');
  const value = input as Record<string, unknown>;
  if (Object.keys(value).some((key) => !keys.includes(key)))
    throw new Error('Unknown input property');
  return value;
}
export function createStudyTools(
  lessons: Lesson[],
  read: () => ProgressState,
  complete: (ids: string[], completed: boolean) => boolean,
): StudyTool[] {
  return [
    {
      name: 'search_course',
      title: 'Search ML Atlas lessons',
      description:
        'Find original course lessons by topic. Returns titles, summaries and relative lesson URLs without navigating.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 1000 },
        },
        required: ['query'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        const { query } = objectInput(input, ['query']);
        if (typeof query !== 'string' || !query.trim() || query.length > 1000)
          throw new Error('Query must contain 1–1,000 characters');
        return {
          lessons: searchLessons(query, lessons).map(({ lesson }) => ({
            id: lesson.id,
            title: lesson.title,
            summary: lesson.summary,
            url: '/learn/' + lesson.id,
          })),
        };
      },
    },
    {
      name: 'read_learning_progress',
      title: 'Read local course completion',
      description:
        'Read lesson completion saved on this browser. Does not expose personal notes or quiz answers.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        objectInput(input, []);
        return {
          completed: read().completed.filter((id) =>
            lessons.some((l) => l.id === id),
          ),
          total: lessons.length,
        };
      },
    },
    {
      name: 'set_lesson_completion',
      title: 'Update local lesson completion',
      description:
        'Mark one or more lessons complete or incomplete in the same browser-local progress used by My learning. Persists immediately; use only when the learner requests this change.',
      inputSchema: {
        type: 'object',
        properties: {
          lessonIds: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            maxItems: 40,
            uniqueItems: true,
          },
          completed: { type: 'boolean' },
        },
        required: ['lessonIds', 'completed'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const { lessonIds, completed } = objectInput(input, [
          'lessonIds',
          'completed',
        ]);
        if (
          !Array.isArray(lessonIds) ||
          lessonIds.length < 1 ||
          lessonIds.length > 40 ||
          lessonIds.some(
            (id) => typeof id !== 'string' || !lessons.some((l) => l.id === id),
          ) ||
          new Set(lessonIds).size !== lessonIds.length ||
          typeof completed !== 'boolean'
        )
          throw new Error(
            'Provide unique valid lessonIds and a boolean completed value',
          );
        if (!complete(lessonIds, completed))
          throw new Error(
            'Browser storage rejected the change. No completion was saved.',
          );
        return {
          updated: lessonIds,
          completed,
          completedCount: read().completed.filter((id) =>
            lessons.some((l) => l.id === id),
          ).length,
        };
      },
    },
  ];
}
