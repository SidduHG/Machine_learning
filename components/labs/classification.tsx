'use client';
import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  classificationData,
  logisticProbability,
  nearestNeighbors,
  knnPredict,
  splitGain,
  gini,
} from '@/lib/algorithms';
import { Plot, px, py, colors } from './plot';
import { Range, Stat } from './controls';
type Mode = 'logistic-regression' | 'knn' | 'decision-tree';
export function ClassificationLab({ mode }: { mode: Mode }) {
  const data = useMemo(() => classificationData(), []);
  const [w, setW] = useState(1);
  const [b, setB] = useState(0);
  const [threshold, setThreshold] = useState(0.5);
  const [k, setK] = useState(5);
  const [qx, setQx] = useState(0.2);
  const [qy, setQy] = useState(0.2);
  const [split, setSplit] = useState(0);
  const left = data.filter((p) => p.x <= split),
    right = data.filter((p) => p.x > split);
  const majority = (group: typeof data) =>
    group.filter((p) => p.label === 1).length > group.length / 2 ? 1 : 0;
  const prediction = (x: number, y: number) =>
    mode === 'logistic-regression'
      ? logisticProbability({ x, y }, w, b) >= threshold
        ? 1
        : 0
      : mode === 'knn'
        ? knnPredict(data, { x, y }, k)
        : majority(x <= split ? left : right);
  const near =
    mode === 'knn' ? nearestNeighbors(data, { x: qx, y: qy }, k) : [];
  const tp = data.filter(
      (p) => p.label === 1 && prediction(p.x, p.y) === 1,
    ).length,
    fn = data.filter((p) => p.label === 1 && prediction(p.x, p.y) === 0).length;
  const positives = data.filter((p) => prediction(p.x, p.y) === 1).length;
  const bestSplit = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => -3.2 + i * 0.1).reduce(
        (best, t) => (splitGain(data, t) > splitGain(data, best) ? t : best),
        0,
      ),
    [data],
  );
  return (
    <>
      <div className="lab-main">
        <div className="lab-stage">
          <Plot
            label={
              mode === 'knn'
                ? 'Nearest-neighbor regions, labeled training points and query'
                : mode === 'decision-tree'
                  ? 'Decision tree split and labeled data'
                  : 'Logistic classification regions and labeled data'
            }
          >
            {Array.from({ length: 30 }, (_, i) =>
              Array.from({ length: 24 }, (_, j) => {
                const x = -4 + (i * 8) / 30,
                  y = -4 + (j * 8) / 24;
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={px(x)}
                    y={py(y + 8 / 24)}
                    width={500 / 30 + 0.5}
                    height={300 / 24 + 0.5}
                    fill={colors[prediction(x + 4 / 30, y + 4 / 24)]}
                    opacity=".13"
                  />
                );
              }),
            )}
            {mode === 'logistic-regression' && (
              <line
                x1={px(-4)}
                y1={py(Math.log(threshold / (1 - threshold)) + 4 * w - b)}
                x2={px(4)}
                y2={py(Math.log(threshold / (1 - threshold)) - 4 * w - b)}
                stroke="#cfdef2"
                strokeWidth="2"
                strokeDasharray="6 5"
              />
            )}
            {mode === 'decision-tree' && (
              <line
                x1={px(split)}
                x2={px(split)}
                y1="55"
                y2="355"
                stroke="#cfdef2"
                strokeWidth="2"
                strokeDasharray="6 5"
              />
            )}
            {near.map((n) => (
              <line
                key={n.index}
                x1={px(qx)}
                y1={py(qy)}
                x2={px(n.point.x)}
                y2={py(n.point.y)}
                stroke="#fff"
                opacity=".55"
                strokeDasharray="3 3"
              />
            ))}
            {data.map((p, i) =>
              p.label === 0 ? (
                <circle
                  key={i}
                  cx={px(p.x)}
                  cy={py(p.y)}
                  r="4.2"
                  fill={colors[0]}
                  stroke="#14243b"
                  strokeWidth="1"
                />
              ) : (
                <path
                  key={i}
                  d={`M${px(p.x)},${py(p.y) - 5}l5,9h-10z`}
                  fill={colors[1]}
                  stroke="#14243b"
                  strokeWidth="1"
                />
              ),
            )}
            {mode === 'knn' && (
              <g>
                <circle
                  cx={px(qx)}
                  cy={py(qy)}
                  r="9"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={px(qx) + 13}
                  y={py(qy) - 12}
                  fill="white"
                  fontSize="12"
                >
                  query
                </text>
              </g>
            )}
          </Plot>
          <div className="plot-legend">
            <span>
              <i style={{ background: colors[0] }} />
              Class 0 · circles
            </span>
            <span>
              <i style={{ background: colors[1] }} />
              Class 1 · triangles
            </span>
            <span>Color = predicted region</span>
          </div>
        </div>
        <div className="lab-controls">
          <div className="eyebrow">
            {mode === 'knn'
              ? 'MOVE YOUR QUERY'
              : mode === 'decision-tree'
                ? 'ASK A QUESTION'
                : 'CHANGE THE DECISION'}
          </div>
          {mode === 'logistic-regression' ? (
            <>
              <Range
                label="Weight w₁"
                value={w}
                min={-3}
                max={3}
                onChange={setW}
              />
              <Range
                label="Bias b"
                value={b}
                min={-3}
                max={3}
                onChange={setB}
              />
              <Range
                label="Positive threshold"
                value={threshold}
                min={0.05}
                max={0.95}
                onChange={setThreshold}
              />
              <p className="control-note">
                The weight for x₂ is fixed at 1. This lab explores a chosen
                boundary; sliders do not train the model.
              </p>
            </>
          ) : mode === 'knn' ? (
            <>
              <Range
                label="Neighbors k"
                value={k}
                min={1}
                max={15}
                step={2}
                onChange={setK}
              />
              <Range
                label="Query x₁"
                value={qx}
                min={-3}
                max={3}
                onChange={setQx}
              />
              <Range
                label="Query x₂"
                value={qy}
                min={-3}
                max={3}
                onChange={setQy}
              />
              <p className="control-note">
                Tied distances use original data order. The white lines connect
                the k nearest training points.
              </p>
            </>
          ) : (
            <>
              <Range
                label="Split: x₁ ≤ threshold"
                value={split}
                min={-3.5}
                max={3.5}
                onChange={setSplit}
              />
              <button
                className="button primary"
                onClick={() => setSplit(bestSplit)}
              >
                Find best grid split
              </button>
              <div className="tree-summary">
                <div>
                  ROOT · {data.length} samples
                  <br />
                  Gini {gini(data.map((p) => p.label ?? 0)).toFixed(3)}
                </div>
                <div className="tree-children">
                  <span>
                    YES
                    <br />
                    {left.length} samples
                    <br />
                    Predict {majority(left)}
                  </span>
                  <span>
                    NO
                    <br />
                    {right.length} samples
                    <br />
                    Predict {majority(right)}
                  </span>
                </div>
              </div>
              <p className="control-note">
                This is one decision stump. The best-split button searches x₁
                thresholds in increments of 0.1. Real trees repeat this process
                across features and child nodes.
              </p>
            </>
          )}
          <button
            className="button secondary"
            onClick={() => {
              setW(1);
              setB(0);
              setThreshold(0.5);
              setK(5);
              setQx(0.2);
              setQy(0.2);
              setSplit(0);
            }}
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>
      <div className="lab-stats" aria-live="polite">
        {mode === 'knn' ? (
          <>
            <Stat
              label="Query prediction"
              value={'Class ' + knnPredict(data, { x: qx, y: qy }, k)}
            />
            <Stat
              label="Class 0 votes"
              value={near.filter((n) => n.point.label === 0).length}
            />
            <Stat
              label="Class 1 votes"
              value={near.filter((n) => n.point.label === 1).length}
            />
          </>
        ) : mode === 'decision-tree' ? (
          <>
            <Stat
              label="Weighted Gini gain"
              value={splitGain(data, split).toFixed(4)}
            />
            <Stat
              label="Left child Gini"
              value={gini(left.map((p) => p.label ?? 0)).toFixed(3)}
            />
            <Stat
              label="Right child Gini"
              value={gini(right.map((p) => p.label ?? 0)).toFixed(3)}
            />
          </>
        ) : (
          <>
            <Stat label="Positive predictions" value={`${positives} / 60`} />
            <Stat
              label="Recall on displayed data"
              value={((tp / (tp + fn)) * 100).toFixed(1) + '%'}
            />
            <Stat
              label="Probability at origin"
              value={logisticProbability({ x: 0, y: 0 }, w, b).toFixed(3)}
            />
          </>
        )}
      </div>
    </>
  );
}
