'use client';
import { useMemo, useState } from 'react';
import { regressionData, pca2d, project2d } from '@/lib/algorithms';
import { Plot, px, py } from './plot';
import { Range, Stat } from './controls';
export function PCALab() {
  const points = useMemo(() => regressionData(79), []);
  const pca = pca2d(points);
  const [degrees, setDegrees] = useState(0);
  const angle = (degrees * Math.PI) / 180;
  const { projected, error } = project2d(points, angle);
  const ux = Math.cos(angle),
    uy = Math.sin(angle);
  return (
    <>
      <div className="lab-main">
        <div className="lab-stage">
          <Plot label="Centered data and its projection onto a movable unit direction">
            {points.map((p, i) => (
              <g key={i}>
                <line
                  x1={px(p.x)}
                  y1={py(p.y)}
                  x2={px(projected[i].x)}
                  y2={py(projected[i].y)}
                  stroke="#7991b5"
                  opacity=".5"
                  strokeDasharray="3 3"
                />
                <circle cx={px(p.x)} cy={py(p.y)} r="4" fill="#6ba6ff" />
                <circle
                  cx={px(projected[i].x)}
                  cy={py(projected[i].y)}
                  r="3.5"
                  fill="#f6a565"
                />
              </g>
            ))}
            <line
              x1={px(pca.mean.x - 4 * ux)}
              y1={py(pca.mean.y - 4 * uy)}
              x2={px(pca.mean.x + 4 * ux)}
              y2={py(pca.mean.y + 4 * uy)}
              stroke="#f6a565"
              strokeWidth="2.5"
            />
          </Plot>
          <div className="plot-legend">
            <span>
              <i style={{ background: '#6ba6ff' }} />
              Original points
            </span>
            <span>
              <i style={{ background: '#f6a565' }} />
              Projected points
            </span>
            <span>Dashed segments = lost information</span>
          </div>
        </div>
        <div className="lab-controls">
          <div className="eyebrow">ROTATE YOUR VIEWPOINT</div>
          <Range
            label="Projection angle (degrees)"
            value={degrees}
            min={-90}
            max={90}
            step={1}
            onChange={setDegrees}
          />
          <button
            className="button primary"
            onClick={() => setDegrees((pca.angle * 180) / Math.PI)}
          >
            Align to first component
          </button>
          <button className="button secondary" onClick={() => setDegrees(0)}>
            Reset angle
          </button>
          <p className="control-note">
            PCA is fitted from the covariance of the centered points. The
            direction’s sign is arbitrary. This demonstration uses a 2D dataset
            so every projection and residual can be inspected.
          </p>
        </div>
      </div>
      <div className="lab-stats" aria-live="polite">
        <Stat label="Mean reconstruction error" value={error.toFixed(4)} />
        <Stat
          label="First component angle"
          value={((pca.angle * 180) / Math.PI).toFixed(1) + '°'}
        />
        <Stat
          label="Variance explained by PC1"
          value={(pca.explained * 100).toFixed(1) + '%'}
        />
      </div>
    </>
  );
}
