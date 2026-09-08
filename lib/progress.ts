export const STORAGE_KEY = 'ml-atlas-progress-v1';
export type ProgressState = {
  version: 1;
  completed: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  quiz: Record<string, boolean>;
  lastLesson: string | null;
};
export function emptyProgress(): ProgressState {
  return {
    version: 1,
    completed: [],
    bookmarks: [],
    notes: {},
    quiz: {},
    lastLesson: null,
  };
}
const idPattern = /^[a-z0-9-]{1,70}$/;
const safeId = (v: unknown): v is string =>
  typeof v === 'string' && idPattern.test(v);
export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return emptyProgress();
  if (raw.length > 1000000) throw new Error('Progress file exceeds 1 MB');
  const p: unknown = JSON.parse(raw);
  if (
    typeof p !== 'object' ||
    p === null ||
    !('version' in p) ||
    p.version !== 1
  )
    throw new Error('Unsupported progress file');
  const obj = p as Record<string, unknown>;
  if (
    !Array.isArray(obj.completed) ||
    !Array.isArray(obj.bookmarks) ||
    !obj.completed.every(safeId) ||
    !obj.bookmarks.every(safeId)
  )
    throw new Error('Invalid progress list');
  if (
    !obj.notes ||
    typeof obj.notes !== 'object' ||
    Array.isArray(obj.notes) ||
    !obj.quiz ||
    typeof obj.quiz !== 'object' ||
    Array.isArray(obj.quiz)
  )
    throw new Error('Invalid notes or quiz data');
  const notes: Record<string, string> = {},
    quiz: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(obj.notes)) {
    if (!safeId(k) || typeof v !== 'string' || v.length > 10000)
      throw new Error('Invalid lesson note');
    Object.defineProperty(notes, k, {
      value: v,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  }
  for (const [k, v] of Object.entries(obj.quiz)) {
    if (!safeId(k) || typeof v !== 'boolean')
      throw new Error('Invalid quiz result');
    Object.defineProperty(quiz, k, {
      value: v,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  }
  if (obj.lastLesson !== null && !safeId(obj.lastLesson))
    throw new Error('Invalid last lesson');
  return {
    version: 1,
    completed: [...new Set(obj.completed)].slice(0, 1000),
    bookmarks: [...new Set(obj.bookmarks)].slice(0, 1000),
    notes,
    quiz,
    lastLesson: obj.lastLesson as string | null,
  };
}
export function toggleId(list: string[], id: string) {
  if (!safeId(id)) throw new Error('Invalid lesson identifier');
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}
export function mergeProgress(
  a: ProgressState,
  b: ProgressState,
): ProgressState {
  return {
    version: 1,
    completed: [...new Set([...a.completed, ...b.completed])],
    bookmarks: [...new Set([...a.bookmarks, ...b.bookmarks])],
    notes: { ...a.notes, ...b.notes },
    quiz: { ...a.quiz, ...b.quiz },
    lastLesson: b.lastLesson ?? a.lastLesson,
  };
}
