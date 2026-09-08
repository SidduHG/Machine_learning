export type Vec3 = [number, number, number];
export type Point = { x: number; y: number; label?: number };
export type Parameters = { w: number; b: number };
export function random(seed = 42) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
export function regressionData(seed = 42): Point[] {
  const rng = random(seed);
  return Array.from({ length: 32 }, (_, i) => {
    const x = -2.5 + (i * 5) / 31;
    return { x, y: 1.25 * x + 0.6 + (rng() - 0.5) * 1.1 };
  });
}
export function mse(data: Point[], w: number, b: number) {
  if (!data.length) throw new Error('Data must be nonempty');
  return data.reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / data.length;
}
export function regressionGradient(data: Point[], p: Parameters) {
  if (!data.length) throw new Error('Data must be nonempty');
  return data.reduce(
    (g, v) => {
      const r = p.w * v.x + p.b - v.y;
      return {
        w: g.w + (2 * r * v.x) / data.length,
        b: g.b + (2 * r) / data.length,
      };
    },
    { w: 0, b: 0 },
  );
}
export function regressionStep(data: Point[], p: Parameters, rate: number) {
  const g = regressionGradient(data, p);
  return { w: p.w - rate * g.w, b: p.b - rate * g.b };
}
export function leastSquares(data: Point[]) {
  if (!data.length) throw new Error('Data must be nonempty');
  const mx = data.reduce((s, p) => s + p.x, 0) / data.length,
    my = data.reduce((s, p) => s + p.y, 0) / data.length;
  const variance = data.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  if (variance === 0) return { w: 0, b: my };
  const w = data.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0) / variance;
  return { w, b: my - w * mx };
}
export function sigmoid(z: number) {
  if (z >= 0) return 1 / (1 + Math.exp(-z));
  const e = Math.exp(z);
  return e / (1 + e);
}
export function classificationData(seed = 42): Point[] {
  const rng = random(seed);
  return Array.from({ length: 60 }, (_, i) => {
    const label = i % 2;
    return {
      x: (label ? 1.2 : -1.2) + (rng() - 0.5) * 3,
      y: (label ? 0.8 : -0.8) + (rng() - 0.5) * 3,
      label,
    };
  });
}
export function logisticProbability(p: Point, w: number, b: number) {
  return sigmoid(w * p.x + p.y + b);
}
export function distanceSquared(a: Vec3, b: Vec3) {
  return a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0);
}
export function clusterData(seed = 42): Vec3[] {
  const rng = random(seed);
  const anchors: Vec3[] = [
    [-2, -1, -1],
    [2, 1, -1],
    [0, 0, 2],
  ];
  return Array.from(
    { length: 60 },
    (_, i) => anchors[i % 3].map((x) => x + (rng() - 0.5) * 1.8) as Vec3,
  );
}
export function assignClusters(points: Vec3[], centers: Vec3[]) {
  if (!centers.length) throw new Error('At least one center required');
  return points.map((p) =>
    centers.reduce(
      (best, c, i) =>
        distanceSquared(p, c) < distanceSquared(p, centers[best]) ? i : best,
      0,
    ),
  );
}
export function inertia(points: Vec3[], centers: Vec3[]) {
  return assignClusters(points, centers).reduce(
    (s, c, i) => s + distanceSquared(points[i], centers[c]),
    0,
  );
}
export function kmeansStep(points: Vec3[], centers: Vec3[]) {
  const assignments = assignClusters(points, centers);
  return centers.map((c, j) => {
    const group = points.filter((_, i) => assignments[i] === j);
    return group.length
      ? (c.map(
          (_, axis) => group.reduce((s, p) => s + p[axis], 0) / group.length,
        ) as Vec3)
      : ([...c] as Vec3);
  });
}
export function nearestNeighbors(points: Point[], query: Point, k: number) {
  if (!Number.isInteger(k) || k < 1 || k > points.length)
    throw new Error('Invalid neighbor count');
  return points
    .map((p, i) => ({
      point: p,
      index: i,
      distance: Math.hypot(p.x - query.x, p.y - query.y),
    }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .slice(0, k);
}
export function knnPredict(points: Point[], query: Point, k: number) {
  const near = nearestNeighbors(points, query, k);
  const votes = near.reduce((n, v) => n + (v.point.label ?? 0), 0);
  return votes > k / 2 ? 1 : 0;
}
export function gini(labels: number[]) {
  if (!labels.length) return 0;
  const counts = new Map<number, number>();
  labels.forEach((l) => counts.set(l, (counts.get(l) ?? 0) + 1));
  return (
    1 - [...counts.values()].reduce((s, n) => s + (n / labels.length) ** 2, 0)
  );
}
export function splitGain(points: Point[], threshold: number) {
  const left = points.filter((p) => p.x <= threshold),
    right = points.filter((p) => p.x > threshold);
  if (!left.length || !right.length) return 0;
  return (
    gini(points.map((p) => p.label ?? 0)) -
    (left.length * gini(left.map((p) => p.label ?? 0)) +
      right.length * gini(right.map((p) => p.label ?? 0))) /
      points.length
  );
}
export function pca2d(points: Point[]) {
  if (points.length < 2) throw new Error('Need at least two points');
  const mean = {
    x: points.reduce((s, p) => s + p.x, 0) / points.length,
    y: points.reduce((s, p) => s + p.y, 0) / points.length,
  };
  const centered = points.map((p) => ({ x: p.x - mean.x, y: p.y - mean.y }));
  const a = centered.reduce((s, p) => s + p.x * p.x, 0) / (points.length - 1),
    b = centered.reduce((s, p) => s + p.x * p.y, 0) / (points.length - 1),
    d = centered.reduce((s, p) => s + p.y * p.y, 0) / (points.length - 1);
  const angle = 0.5 * Math.atan2(2 * b, a - d),
    root = Math.sqrt((a - d) ** 2 + 4 * b * b),
    eigenvalues = [(a + d + root) / 2, Math.max(0, (a + d - root) / 2)];
  return {
    mean,
    angle,
    eigenvalues,
    direction: { x: Math.cos(angle), y: Math.sin(angle) },
    explained: a + d ? eigenvalues[0] / (a + d) : 0,
  };
}
export function project2d(points: Point[], angle: number) {
  const mx = points.reduce((s, p) => s + p.x, 0) / points.length,
    my = points.reduce((s, p) => s + p.y, 0) / points.length;
  const ux = Math.cos(angle),
    uy = Math.sin(angle);
  const projected = points.map((p) => {
    const t = (p.x - mx) * ux + (p.y - my) * uy;
    return { x: mx + t * ux, y: my + t * uy };
  });
  return {
    projected,
    error:
      points.reduce(
        (s, p, i) =>
          s + (p.x - projected[i].x) ** 2 + (p.y - projected[i].y) ** 2,
        0,
      ) / points.length,
  };
}
export function softmax(scores: number[]) {
  if (!scores.length) return [];
  const max = Math.max(...scores);
  if (max === -Infinity) return scores.map(() => 0);
  const exp = scores.map((s) => Math.exp(s - max)),
    total = exp.reduce((a, b) => a + b, 0);
  return exp.map((e) => e / total);
}
export const tokenNames = ['The', 'small', 'robot', 'learns'];
export const tokenVectors = [
  [1, 0.1],
  [0.2, 1],
  [0.9, 0.7],
  [0.4, 0.9],
];
export function attentionWeights(
  queryIndex: number,
  temperature = 1,
  causal = false,
) {
  if (
    queryIndex < 0 ||
    queryIndex >= 4 ||
    !Number.isInteger(queryIndex) ||
    temperature <= 0
  )
    throw new Error('Invalid attention controls');
  const q = tokenVectors[queryIndex];
  return softmax(
    tokenVectors.map((k, j) =>
      causal && j > queryIndex
        ? -Infinity
        : (q[0] * k[0] + q[1] * k[1]) / Math.sqrt(2) / temperature,
    ),
  );
}
export function networkForward(
  x1: number,
  x2: number,
  scale: number,
  bias: number,
) {
  const weights = [
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  const pre = weights.map((w) => scale * (w[0] * x1 + w[1] * x2) + bias);
  const hidden = pre.map((x) => Math.max(0, x));
  const logit = hidden[0] + hidden[1] - 0.7 * hidden[2] - 0.5;
  return { pre, hidden, logit, probability: sigmoid(logit) };
}
