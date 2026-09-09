'use client';
import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import type { StudyTool } from '@/lib/study-tools';
import { readProgress, useProgress } from '@/hooks/use-progress';
type ModelContext = {
  registerTool: (
    tool: StudyTool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function StudyActions() {
  const { update } = useProgress();
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.all([import('@/lib/curriculum'), import('@/lib/study-tools')])
      .then(([{ lessons }, { createStudyTools }]) => {
        if (lifecycle.signal.aborted) return;
        const tools = createStudyTools(
          lessons,
          readProgress,
          (ids, completed) => {
            let saved = false;
            flushSync(() => {
              saved = update((old) => ({
                ...old,
                completed: completed
                  ? [...new Set([...old.completed, ...ids])]
                  : old.completed.filter((id) => !ids.includes(id)),
              }));
            });
            return saved;
          },
        );
        for (const tool of tools) {
          try {
            void Promise.resolve(
              context.registerTool(tool, { signal: lifecycle.signal }),
            ).catch(() => {
              /* Optional integration; the visible interface remains available. */
            });
          } catch {
            /* Unsupported registry implementations must not interrupt the course. */
          }
        }
      })
      .catch(() => {
        /* Ordinary browsers do not require these optional tools. */
      });
    return () => lifecycle.abort();
  }, [update]);
  return null;
}
