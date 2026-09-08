'use client';
import { useState } from 'react';
import { networkForward } from '@/lib/algorithms';
import { Range, Stat } from './controls';
export function NetworkLab() {
  const [x1, setX1] = useState(0.7),
    [x2, setX2] = useState(-0.3),
    [scale, setScale] = useState(1),
    [bias, setBias] = useState(0),
    [phase, setPhase] = useState(3);
  const net = networkForward(x1, x2, scale, bias);
  return (
    <>
      <div className="lab-main">
        <div className="lab-stage">
          <svg
            viewBox="0 0 610 420"
            className="lab-plot"
            role="img"
            aria-label={`Forward pass: inputs ${x1}, ${x2}; hidden activations ${net.hidden.map((v) => v.toFixed(2)).join(', ')}; output probability ${net.probability.toFixed(3)}`}
          >
            <text
              x="100"
              y="48"
              fill="#a6bce0"
              textAnchor="middle"
              fontSize="12"
            >
              INPUTS
            </text>
            <text
              x="300"
              y="48"
              fill="#a6bce0"
              textAnchor="middle"
              fontSize="12"
            >
              ReLU HIDDEN LAYER
            </text>
            <text
              x="505"
              y="48"
              fill="#a6bce0"
              textAnchor="middle"
              fontSize="12"
            >
              SIGMOID OUTPUT
            </text>
            {[145, 285].map((y, i) =>
              [110, 215, 320].map((hy, j) => (
                <g key={`${i}-${j}`} opacity={phase >= 1 ? 1 : 0.16}>
                  <line
                    x1="127"
                    y1={y}
                    x2="268"
                    y2={hy}
                    stroke={
                      [
                        [1, -1],
                        [-1, 1],
                        [1, 1],
                      ][j][i] > 0
                        ? '#658fd0'
                        : '#ad7f9d'
                    }
                    strokeWidth={1 + Math.abs(scale) * 0.6}
                  />
                </g>
              )),
            )}
            {[110, 215, 320].map((y, i) => (
              <line
                key={i}
                x1="331"
                y1={y}
                x2="475"
                y2="215"
                stroke={i === 2 ? '#e3aa7d' : '#76aafa'}
                strokeWidth={Math.min(6, 1 + net.hidden[i])}
                opacity={phase >= 2 ? 0.8 : 0.16}
              />
            ))}
            {[x1, x2].map((v, i) => (
              <g key={i}>
                <circle
                  cx="100"
                  cy={i === 0 ? 145 : 285}
                  r="29"
                  fill="#234571"
                  stroke="#77aafb"
                  strokeWidth="1.5"
                />
                <text
                  x="100"
                  y={(i === 0 ? 145 : 285) + 5}
                  fill="white"
                  textAnchor="middle"
                  fontSize="15"
                >
                  {v.toFixed(2)}
                </text>
                <text
                  x="100"
                  y={(i === 0 ? 145 : 285) + 47}
                  fill="#94aed3"
                  textAnchor="middle"
                  fontSize="12"
                >
                  x{i + 1}
                </text>
              </g>
            ))}
            {net.hidden.map((v, i) => (
              <g key={i} opacity={phase >= 2 ? 1 : 0.3}>
                <circle
                  cx="300"
                  cy={[110, 215, 320][i]}
                  r="31"
                  fill={v > 0 ? '#2d5790' : '#1a2e49'}
                  stroke={v > 0 ? '#7bb0ff' : '#49617d'}
                  strokeWidth="1.5"
                />
                <text
                  x="300"
                  y={[110, 215, 320][i] + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="15"
                >
                  {phase >= 2 ? v.toFixed(2) : '?'}
                </text>
                <text
                  x="300"
                  y={[110, 215, 320][i] + 47}
                  textAnchor="middle"
                  fill="#94aed3"
                  fontSize="11"
                >
                  z{i + 1} = {net.pre[i].toFixed(2)}
                </text>
              </g>
            ))}
            <g opacity={phase >= 3 ? 1 : 0.3}>
              <circle
                cx="508"
                cy="215"
                r="35"
                fill="#80614f"
                stroke="#f5b17f"
                strokeWidth="2"
              />
              <text
                x="508"
                y="220"
                textAnchor="middle"
                fill="white"
                fontSize="16"
              >
                {phase >= 3 ? net.probability.toFixed(3) : '?'}
              </text>
              <text
                x="508"
                y="272"
                textAnchor="middle"
                fill="#e4b696"
                fontSize="12"
              >
                P(class 1)
              </text>
            </g>
          </svg>
          <div className="network-stages">
            <button
              className="button"
              onClick={() => setPhase((phase + 1) % 4)}
            >
              Step forward pass · {phase}/3
            </button>
            <span>
              {
                [
                  'Inputs only',
                  'Weighted sums',
                  'ReLU activations',
                  'Output probability',
                ][phase]
              }
            </span>
          </div>
        </div>
        <div className="lab-controls">
          <div className="eyebrow">FOLLOW THE COMPUTATION</div>
          <Range
            label="Input x₁"
            value={x1}
            min={-2}
            max={2}
            onChange={setX1}
          />
          <Range
            label="Input x₂"
            value={x2}
            min={-2}
            max={2}
            onChange={setX2}
          />
          <Range
            label="Hidden weight scale"
            value={scale}
            min={-2}
            max={2}
            onChange={setScale}
          />
          <Range
            label="Hidden bias"
            value={bias}
            min={-2}
            max={2}
            onChange={setBias}
          />
          <p className="control-note">
            Hidden rows: scale × [1,−1], [−1,1], [1,1]. Output weights:
            [1,1,−0.7], output bias −0.5. This is a forward-pass experiment;
            weights are changed manually.
          </p>
        </div>
      </div>
      <div className="lab-stats" aria-live="polite">
        <Stat
          label="Active hidden units"
          value={`${net.hidden.filter((v) => v > 0).length} / 3`}
        />
        <Stat label="Output logit" value={net.logit.toFixed(3)} />
        <Stat label="Output probability" value={net.probability.toFixed(3)} />
      </div>
    </>
  );
}
