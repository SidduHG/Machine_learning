'use client';
import { lazy, Suspense, useState } from 'react';
import { labs } from '@/lib/labs';
const Regression = lazy(() =>
  import('./labs/regression').then((m) => ({ default: m.RegressionLab })),
);
const Classification = lazy(() =>
  import('./labs/classification').then((m) => ({
    default: m.ClassificationLab,
  })),
);
const Clustering = lazy(() =>
  import('./labs/clustering').then((m) => ({ default: m.ClusteringLab })),
);
const PCA = lazy(() =>
  import('./labs/pca').then((m) => ({ default: m.PCALab })),
);
export function LessonExperiment({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const lab = labs.find((l) => l.id === id);
  if (!lab) return null;
  return (
    <div className="chapter-experiment">
      <p>{lab.description}</p>
      <p>
        <strong>Experiment:</strong> {lab.prompt}
      </p>
      <button
        className="button secondary"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? 'Close demonstration' : 'Open interactive demonstration'}
      </button>
      {open && (
        <Suspense fallback={<p>Loading the demonstration…</p>}>
          <div className="embedded-lab">
            {id === 'linear-regression' || id === 'gradient-descent' ? (
              <Regression descent={id === 'gradient-descent'} />
            ) : id === 'logistic-regression' ||
              id === 'knn' ||
              id === 'decision-tree' ? (
              <Classification mode={id} />
            ) : id === 'k-means' ? (
              <Clustering />
            ) : (
              <PCA />
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
}
