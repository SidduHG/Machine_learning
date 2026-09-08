import type { ReactNode } from 'react';
export const px = (x: number) => 55 + (x + 4) * 62.5;
export const py = (y: number) => 355 - (y + 4) * 37.5;
export function Plot({
  children,
  label,
  xLabel = 'feature x₁',
  yLabel = 'feature x₂',
}: {
  children: ReactNode;
  label: string;
  xLabel?: string;
  yLabel?: string;
}) {
  return (
    <svg
      viewBox="0 0 610 415"
      role="img"
      aria-label={label}
      className="lab-plot"
    >
      <defs>
        <clipPath id="plot-clip">
          <rect x="55" y="55" width="500" height="300" />
        </clipPath>
      </defs>
      {[-4, -2, 0, 2, 4].map((v) => (
        <g key={v}>
          <line
            x1={px(v)}
            x2={px(v)}
            y1="55"
            y2="355"
            stroke={v === 0 ? '#587291' : '#263e5e'}
            strokeDasharray={v === 0 ? '' : '3 5'}
          />
          <line
            x1="55"
            x2="555"
            y1={py(v)}
            y2={py(v)}
            stroke={v === 0 ? '#587291' : '#263e5e'}
            strokeDasharray={v === 0 ? '' : '3 5'}
          />
          <text
            x={px(v)}
            y="377"
            textAnchor="middle"
            fill="#92a9c7"
            fontSize="11"
          >
            {v}
          </text>
          <text
            x="39"
            y={py(v) + 4}
            textAnchor="end"
            fill="#92a9c7"
            fontSize="11"
          >
            {v}
          </text>
        </g>
      ))}
      <g clipPath="url(#plot-clip)">{children}</g>
      <text x="303" y="405" textAnchor="middle" fill="#a4bad7" fontSize="12">
        {xLabel}
      </text>
      <text x="20" y="30" fill="#a4bad7" fontSize="12">
        {yLabel}
      </text>
    </svg>
  );
}
export const colors = ['#6ba6ff', '#f6a565', '#b99aff', '#6bd0bd', '#ef83af'];
