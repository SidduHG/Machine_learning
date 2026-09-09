export function SurfacePreview() {
  const project = (x: number, z: number) => [
    280 + (x - z) * 38,
    190 + (x + z) * 15 - (x * x + z * z) * 6,
  ];
  const paths = [];
  for (let k = -4; k <= 4; k += 0.4) {
    for (const direction of [0, 1]) {
      let d = '';
      for (let t = -4; t <= 4.01; t += 0.2) {
        const [x, y] = project(direction ? k : t, direction ? t : k);
        d += `${d ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `;
      }
      paths.push(d);
    }
  }
  const trail = Array.from({ length: 18 }, (_, i) => {
    const v = 3.6 * Math.pow(0.83, i);
    return project(v, v * 0.53);
  });
  return (
    <div className="surface-preview">
      <svg viewBox="0 0 560 340" role="img" aria-labelledby="surface-title">
        <title id="surface-title">
          Quadratic loss surface with a gradient descent path toward its minimum
        </title>
        <defs>
          <linearGradient id="surface-ink" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#2361ed" />
            <stop offset="1" stopColor="#79b6ff" />
          </linearGradient>
          <radialGradient id="surface-glow">
            <stop stopColor="#b8d2ff" stopOpacity=".65" />
            <stop offset="1" stopColor="#edf4ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="280" cy="230" rx="230" ry="85" fill="url(#surface-glow)" />
        <g transform="translate(0 38)">
          {paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="url(#surface-ink)"
              strokeWidth=".9"
              opacity=".55"
            />
          ))}
          <path
            d={trail.map((p, i) => `${i ? 'L' : 'M'}${p.join(',')}`).join(' ')}
            fill="none"
            stroke="#ef6c47"
            strokeWidth="2.6"
            strokeDasharray="4 4"
          />
          {trail
            .filter((_, i) => i % 3 === 0)
            .map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i === 0 ? 5 : 3}
                fill="#f27b4f"
                stroke="white"
                strokeWidth="1.5"
              />
            ))}
          <circle
            className="minimum-pulse"
            cx="280"
            cy="190"
            r="5"
            fill="#195ae5"
          />
          <text x="468" y="227" className="axis-label">
            weight w₁
          </text>
          <text x="34" y="234" className="axis-label">
            weight w₂
          </text>
          <text x="283" y="18" className="axis-label">
            loss J(w)
          </text>
          <path d="M287 190 L344 169" stroke="#7186a7" strokeDasharray="3 3" />
          <text x="348" y="170" className="axis-label">
            minimum
          </text>
        </g>
      </svg>
      <span className="plot-pill">
        <span className="live-dot" /> Follow the gradient
      </span>
    </div>
  );
}
