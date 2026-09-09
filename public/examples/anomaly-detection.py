import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.metrics import roc_auc_score

rng = np.random.default_rng(42)
train = rng.normal(0, 1, size=(200, 2))
normal = rng.normal(0, 1, size=(50, 2))
unusual = rng.uniform(6, 9, size=(10, 2))
test = np.vstack([normal, unusual])
labels = np.array([0]*50+[1]*10)
model = IsolationForest(random_state=42).fit(train)
# score_samples is larger for normal points; negate to rank anomalies higher.
scores = -model.score_samples(test)
print('Synthetic ROC AUC:', roc_auc_score(labels, scores))
print('Highest-scoring test indices:', np.argsort(scores)[-10:].tolist())
