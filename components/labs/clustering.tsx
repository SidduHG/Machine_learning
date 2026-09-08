'use client';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  clusterData,
  assignClusters,
  kmeansStep,
  inertia,
  type Vec3,
} from '@/lib/algorithms';
import { Range, Stat } from './controls';
import { Plot, px, py, colors } from './plot';
const Scene = lazy(() => import('./scene'));
function initial(k: number): Vec3[] {
  return Array.from({ length: k }, (_, i) => [
    -2 + (i * 4) / Math.max(1, k - 1),
    1.8,
    -2,
  ]);
}
export function ClusteringLab() {
  const [seed, setSeed] = useState(42),
    [k, setK] = useState(3),
    [centers, setCenters] = useState<Vec3[]>(initial(3)),
    [steps, setSteps] = useState(0),
    [playing, setPlaying] = useState(false),
    [converged, setConverged] = useState(false);
  const points = useMemo(() => clusterData(seed), [seed]);
  const assignments = assignClusters(points, centers);
  const step = useCallback(() => {
    const next = kmeansStep(points, centers);
    if (steps >= 49 || next.every((c,i)=>c.every((v,j)=>Math.abs(v-centers[i][j])<1e-8))) setPlaying(false);
    setConverged(
      next.every((c, i) =>
        c.every((v, j) => Math.abs(v - centers[i][j]) < 1e-8),
      ),
    );
    setCenters(next);
    setSteps((s) => s + 1);
  }, [points, centers, steps]);
  useEffect(() => {
    if (!playing) return;
    if (converged || steps >= 50) return;
    const timer = setTimeout(step, 550);
    return () => clearTimeout(timer);
  }, [playing, converged, steps, step]);
  const reset = (count = k) => {
    setPlaying(false);
    setCenters(initial(count));
    setSteps(0);
    setConverged(false);
  };
  const flat = (
    <Plot
      label="Projection of three-dimensional data onto x₁ and x₃; cluster membership uses all three coordinates"
      xLabel="x₁"
      yLabel="x₃ (x₂ hidden)"
    >
      {points.map((p, i) => (
        <circle
          key={i}
          cx={px(p[0])}
          cy={py(p[2])}
          r="4.5"
          fill={colors[assignments[i]]}
        />
      ))}
      {centers.map((c, i) => (
        <g key={i}>
          <path
            d={`M${px(c[0])},${py(c[2]) - 10}l9,10l-9,10l-9,-10z`}
            fill={colors[i]}
            stroke="white"
            strokeWidth="2"
          />
          <text x={px(c[0]) + 12} y={py(c[2]) - 12} fill="white" fontSize="12">
            C{i + 1}
          </text>
        </g>
      ))}
    </Plot>
  );
  return (
    <>
      <div className="lab-main">
        <div className="lab-stage">
          <Tabs defaultValue="3d">
            <TabsList className="plot-tabs">
              <TabsTrigger value="3d">3D clusters</TabsTrigger>
              <TabsTrigger value="2d">2D projection</TabsTrigger>
            </TabsList>
            <TabsContent value="3d">
              <Suspense
                fallback={
                  <div className="plot-fallback">
                    Loading the 3D point cloud…
                  </div>
                }
              >
                <Scene
                  kind="clusters"
                  points={points}
                  centers={centers}
                  assignments={assignments}
                  fallback={
                    <>
                      <p className="fallback-label">
                        3D unavailable. Showing a 2D projection.
                      </p>
                      {flat}
                    </>
                  }
                />
              </Suspense>
            </TabsContent>
            <TabsContent value="2d">{flat}</TabsContent>
          </Tabs>
          <div className="plot-legend">
            {centers.map((_, i) => (
              <span key={i}>
                <i style={{ background: colors[i] }} />C{i + 1}:{' '}
                {assignments.filter((c) => c === i).length} points
              </span>
            ))}
          </div>
        </div>
        <div className="lab-controls">
          <div className="eyebrow">FIND THE CENTERS</div>
          <Range
            label="Number of clusters k"
            value={k}
            min={2}
            max={5}
            step={1}
            onChange={(v) => {
              setK(v);
              reset(v);
            }}
          />
          <div className="lab-button-grid">
            <button
              className="button primary"
              disabled={converged}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}{' '}
              {playing ? 'Pause' : 'Run'}
            </button>
            <button
              className="button secondary"
              disabled={converged}
              onClick={() => {
                setPlaying(false);
                step();
              }}
            >
              <SkipForward size={16} />
              One step
            </button>
            <button className="button secondary" onClick={() => reset()}>
              <RotateCcw size={16} />
              Reset centers
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setSeed((s) => s + 1);
                reset();
              }}
            >
              New dataset
            </button>
          </div>
          <p className="control-note">
            Every step assigns points using 3D Euclidean distance, then moves
            centers to the cluster means. Empty clusters retain their previous
            center. Synthetic data is reproducible from seed {seed}.
          </p>
          <div className="centroid-list">
            {centers.map((c, i) => (
              <p key={i}>
                <strong style={{ color: colors[i] }}>C{i + 1}</strong> [
                {c.map((v) => v.toFixed(2)).join(', ')}]
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="lab-stats" aria-live="polite">
        <Stat
          label="Within-cluster sum of squares"
          value={inertia(points, centers).toFixed(3)}
        />
        <Stat label="Iterations" value={steps} />
        <Stat
          label="Status"
          value={converged ? 'Converged' : 'Ready to update'}
        />
      </div>
    </>
  );
}
