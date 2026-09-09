'use client';
import { useCallback, useState, useSyncExternalStore } from 'react';
import {
  STORAGE_KEY,
  emptyProgress,
  parseProgress,
  type ProgressState,
} from '@/lib/progress';
const empty = { data: emptyProgress(), warning: '' };
let rawCache: string | null | undefined = undefined;
let snapshot = empty;
function getSnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== rawCache) {
      rawCache = raw;
      try {
        snapshot = { data: parseProgress(raw), warning: '' };
      } catch {
        snapshot = {
          data: emptyProgress(),
          warning:
            'Saved progress could not be read. Import a backup or make a new save to start fresh.',
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
  window.addEventListener('ml-atlas-progress', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ml-atlas-progress', callback);
  };
}
export function readProgress() {
  return getSnapshot().data;
}
export function useProgress() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  const [error, setError] = useState('');
  const update = useCallback(
    (change: (old: ProgressState) => ProgressState) => {
      try {
        const next = change(getSnapshot().data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event('ml-atlas-progress'));
        setError('');
        return true;
      } catch {
        setError(
          'Your browser could not save this change. Enable site storage or export a backup before closing.',
        );
        return false;
      }
    },
    [],
  );
  return { progress: current.data, warning: error || current.warning, update };
}
