'use client';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  regressionData,
  mse,
  regressionStep,
  leastSquares,
  type Parameters,
} from '@/lib/algorithms';
import { Range, Stat } from './controls';
import { Plot, px, py } from './plot';
const Scene = lazy(() => import('./scene'));
export function RegressionLab({ descent = false }: { descent?: boolean }) {
  const data = useMemo(() => regressionData(), []);
  const [parameters, setParameters] = useState<Parameters>({
    w: -0.65,
    b: -0.8,
  });
  const [rate, setRate] = useState(0.1);
  const [path, setPath] = useState<Parameters[]>([{ w: -0.65, b: -0.8 }]);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState(descent ? '3d' : '2d');
  const loss = mse(data, parameters.w, parameters.b);
  const diverged = !Number.isFinite(loss) || loss > 200;
  const step = useCallback(() => {
    if (diverged || path.length >= 120) return;
    const next = regressionStep(data, parameters, rate);
    setParameters(next);
    setPath((p) => [...p, next]);
    if (mse(data, next.w, next.b) > 200 || path.length >= 119) setPlaying(false);
  }, [data, parameters, rate, diverged, path.length]);
  useEffect(() => {
    if (!playing) return;
    if (diverged || path.length >= 120) return;
    const timer = setTimeout(step, 350);
    return () => clearTimeout(timer);
  }, [playing, diverged, path.length, step]);
  const reset = () => {
    setPlaying(false);
    setParameters({ w: -0.65, b: -0.8 });
    setPath([{ w: -0.65, b: -0.8 }]);
  };
  const update = (p: Parameters) => {
    setPlaying(false);
    setParameters(p);
    setPath([p]);
  };
  const scatter = (
    <Plot
      label="Regression data, fitted line and residual distances"
      xLabel="distance (scaled)"
      yLabel="duration (scaled)"
    >
      {data.map((p, i) => (
        <g key={i}>
          <line
            x1={px(p.x)}
            y1={py(p.y)}
            x2={px(p.x)}
            y2={py(parameters.w * p.x + parameters.b)}
            stroke="#e7a879"
            strokeWidth="1"
            opacity=".65"
          />
          <circle cx={px(p.x)} cy={py(p.y)} r="4" fill="#79acfa" />
        </g>
      ))}
      <line
        x1={px(-4)}
        y1={py(-4 * parameters.w + parameters.b)}
        x2={px(4)}
        y2={py(4 * parameters.w + parameters.b)}
        stroke="#f6a46b"
        strokeWidth="2.5"
      />
    </Plot>
  );
  return (
    <>
      <div className="lab-main">
        <div className="lab-stage">
          <Tabs value={view} onValueChange={(v) => setView(String(v))}>
            <TabsList className="plot-tabs">
              <TabsTrigger value="2d">Data & residuals</TabsTrigger>
              <TabsTrigger value="3d">3D loss landscape</TabsTrigger>
            </TabsList>
            <TabsContent value="2d">{scatter}</TabsContent>
            <TabsContent value="3d">
              {diverged ? (
                <div className="plot-fallback">
                  The optimizer left the displayed landscape. Reset and lower
                  the learning rate.
                </div>
              ) : (
                <Suspense
                  fallback={
                    <div className="plot-fallback">
                      Loading the 3D landscape…
                    </div>
                  }
                >
                  <Scene
                    kind="surface"
                    data={data}
                    parameters={parameters}
                    path={path}
                    fallback={
                      <div>
                        <p className="fallback-label">
                          3D unavailable. The same model is shown in 2D.
                        </p>
                        {scatter}
                      </div>
                    }
                  />
                </Suspense>
              )}
            </TabsContent>
          </Tabs>
          <div className="plot-legend">
            <span>
              <i style={{ background: '#79acfa' }} />
              32 observed samples
            </span>
            <span>
              <i style={{ background: '#f6a46b' }} />
              Current model
            </span>
            <span>Loss surface height = MSE / 5</span>
          </div>
        </div>
        <div className="lab-controls">
          <div className="eyebrow">MODEL CONTROLS</div>
          <Range
            label="Slope w"
            value={parameters.w}
            min={-2}
            max={2}
            onChange={(v) => update({ ...parameters, w: v })}
          />
          <Range
            label="Intercept b"
            value={parameters.b}
            min={-2}
            max={2}
            onChange={(v) => update({ ...parameters, b: v })}
          />
          <Range
            label="Learning rate η"
            value={rate}
            min={0.01}
            max={0.8}
            step={0.01}
            onChange={(v) => {
              setPlaying(false);
              setRate(v);
            }}
          />
          <div className="lab-button-grid">
            <button
              className="button primary"
              onClick={() => setPlaying(!playing)}
              disabled={diverged || path.length >= 120}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}{' '}
              {playing ? 'Pause' : 'Train'}
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setPlaying(false);
                step();
              }}
              disabled={diverged || path.length >= 120}
            >
              <SkipForward size={16} />
              One step
            </button>
            <button
              className="button secondary"
              onClick={() => update(leastSquares(data))}
            >
              <Sparkles size={16} />
              Fit least squares
            </button>
            <button className="button secondary" onClick={reset}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
          <p className="control-note">
            Synthetic data. Every update uses all 32 samples. The 3D surface
            displays w and b from −2 to 2.
          </p>
        </div>
      </div>
      <div className="lab-stats" aria-live="polite">
        <Stat
          label="Mean squared error"
          value={Number.isFinite(loss) ? loss.toFixed(4) : 'Diverged'}
        />
        <Stat label="Training steps" value={path.length - 1} />
        <Stat
          label="Current prediction"
          value={`ŷ = ${parameters.w.toFixed(2)}x ${parameters.b >= 0 ? '+' : '−'} ${Math.abs(parameters.b).toFixed(2)}`}
        />
      </div>
      {diverged && (
        <output className="lab-warning">
          The learning rate is too large for this landscape. Reset and try a
          smaller value.
        </output>
      )}
    </>
  );
}
