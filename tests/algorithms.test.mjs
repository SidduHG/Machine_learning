import test from 'node:test';
import assert from 'node:assert/strict';
import {
  regressionData,
  mse,
  regressionGradient,
  regressionStep,
  leastSquares,
  sigmoid,
  clusterData,
  assignClusters,
  inertia,
  kmeansStep,
  nearestNeighbors,
  knnPredict,
  gini,
  splitGain,
  pca2d,
  project2d,
  softmax,
  attentionWeights,
  networkForward,
} from '../lib/algorithms.ts';
const near = (a, b, tol = 1e-8) =>
  assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
test('regression gradient matches finite differences and stable steps reduce loss', () => {
  const data = regressionData();
  let p = { w: -0.65, b: -0.8 };
  const g = regressionGradient(data, p),
    e = 1e-5;
  near(g.w, (mse(data, p.w + e, p.b) - mse(data, p.w - e, p.b)) / (2 * e));
  near(g.b, (mse(data, p.w, p.b + e) - mse(data, p.w, p.b - e)) / (2 * e));
  for (let i = 0; i < 30; i++) {
    const next = regressionStep(data, p, 0.1);
    assert.ok(mse(data, next.w, next.b) <= mse(data, p.w, p.b));
    p = next;
  }
  const exact = leastSquares(data);
  assert.ok(mse(data, p.w, p.b) - mse(data, exact.w, exact.b) < 1e-4);
});
test('large learning rates visibly diverge rather than reporting fake convergence', () => {
  const data = regressionData();
  let p = { w: -0.65, b: -0.8 };
  const before = mse(data, p.w, p.b);
  for (let i = 0; i < 8; i++) p = regressionStep(data, p, 0.8);
  assert.ok(mse(data, p.w, p.b) > before * 10);
});
test('least squares handles a constant input and sigmoid handles extremes', () => {
  assert.deepEqual(
    leastSquares([
      { x: 1, y: 2 },
      { x: 1, y: 4 },
    ]),
    { w: 0, b: 3 },
  );
  near(sigmoid(0), 0.5);
  assert.equal(sigmoid(1000), 1);
  assert.equal(sigmoid(-1000), 0);
});
test('k-means updates never increase inertia and empty centers stay finite', () => {
  const points = clusterData();
  let centers = [
    [-2, 1.8, -2],
    [0, 1.8, -2],
    [2, 1.8, -2],
    [100, 100, 100],
  ];
  for (let i = 0; i < 15; i++) {
    const next = kmeansStep(points, centers);
    assert.ok(inertia(points, next) <= inertia(points, centers) + 1e-8);
    assert.ok(next.flat().every(Number.isFinite));
    centers = next;
  }
  assert.equal(assignClusters(points, centers).length, points.length);
  assert.deepEqual(clusterData(42), points);
});
test('nearest neighbors have deterministic ties and majority voting', () => {
  const points = [
    { x: 0, y: 0, label: 0 },
    { x: 2, y: 0, label: 1 },
    { x: 3, y: 0, label: 1 },
  ];
  assert.equal(nearestNeighbors(points, { x: 1, y: 0 }, 1)[0].index, 0);
  assert.equal(knnPredict(points, { x: 1, y: 0 }, 3), 1);
  assert.throws(() => nearestNeighbors(points, { x: 1, y: 0 }, 4));
});
test('Gini gain rewards a separating split and rejects empty children', () => {
  const points = [
    { x: 1, y: 0, label: 0 },
    { x: 2, y: 0, label: 0 },
    { x: 3, y: 0, label: 1 },
    { x: 4, y: 0, label: 1 },
  ];
  near(gini([0, 0, 1, 1]), 0.5);
  near(splitGain(points, 2.5), 0.5);
  near(splitGain(points, -5), 0);
});
test('PCA finds diagonal data and minimizes reconstruction error', () => {
  const points = [
    { x: -1, y: -1 },
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ];
  const pca = pca2d(points);
  near(pca.angle, Math.PI / 4);
  near(pca.explained, 1);
  near(project2d(points, pca.angle).error, 0);
  assert.ok(project2d(points, 0).error > 0);
});
test('attention is normalized, numerically stable and obeys the causal mask', () => {
  near(softmax([1000, 1000])[0], 0.5);
  for (let q = 0; q < 4; q++) {
    const weights = attentionWeights(q, 0.1, true);
    near(
      weights.reduce((a, b) => a + b, 0),
      1,
    );
    for (let j = q + 1; j < 4; j++) assert.equal(weights[j], 0);
  }
  assert.throws(() => attentionWeights(5));
  assert.throws(() => attentionWeights(1, 0));
});
test('neural forward pass respects ReLU and the declared output weights', () => {
  const n = networkForward(1, -1, 1, 0);
  assert.deepEqual(n.pre, [2, -2, 0]);
  assert.deepEqual(n.hidden, [2, 0, 0]);
  near(n.logit, 1.5);
  near(n.probability, sigmoid(1.5));
});
