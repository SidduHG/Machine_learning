import fs from 'node:fs';
const examples = [];
const add = (id, title, code, experiment) =>
  examples.push({
    id,
    title,
    code,
    experiment,
    environment:
      'Run locally with Python and scikit-learn 1.8.0. These library examples are separate from the standard-library browser runner.',
  });
for (const [id, name, statement, estimator] of [
  [
    'logistic-regression',
    'Logistic regression',
    'from sklearn.linear_model import LogisticRegression',
    'LogisticRegression(max_iter=2000)',
  ],
  [
    'knn',
    'Nearest-neighbor classification',
    'from sklearn.neighbors import KNeighborsClassifier',
    'KNeighborsClassifier(n_neighbors=7)',
  ],
  [
    'naive-bayes',
    'Gaussian naive Bayes',
    'from sklearn.naive_bayes import GaussianNB',
    'GaussianNB()',
  ],
  [
    'decision-trees',
    'Decision tree',
    'from sklearn.tree import DecisionTreeClassifier',
    'DecisionTreeClassifier(max_depth=3, min_samples_leaf=3, random_state=42)',
  ],
  [
    'ensembles',
    'Random forest',
    'from sklearn.ensemble import RandomForestClassifier',
    'RandomForestClassifier(n_estimators=120, min_samples_leaf=2, random_state=42)',
  ],
  [
    'svm',
    'RBF support-vector classifier',
    'from sklearn.svm import SVC',
    "SVC(C=1, gamma='scale')",
  ],
])
  add(
    id,
    name + ' in a complete evaluation pipeline',
    `from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix
${statement}

# Historical benchmark: random-split results do not prove deployment quality.
data = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=.25, stratify=data.target, random_state=42)
pipeline = make_pipeline(StandardScaler(), ${estimator})
folds = StratifiedKFold(5, shuffle=True, random_state=42)
scores = cross_val_score(pipeline, X_train, y_train, cv=folds, scoring='f1_macro')
print('Development macro F1 mean/std:', scores.mean(), scores.std())
# Lock the procedure before assessing the reserved test set.
baseline = DummyClassifier(strategy='most_frequent').fit(X_train, y_train)
pipeline.fit(X_train, y_train)
for label, model in [('Baseline', baseline), ('${name}', pipeline)]:
    predicted = model.predict(X_test)
    print(label, 'accuracy:', accuracy_score(y_test, predicted))
    print(label, 'macro F1:', f1_score(y_test, predicted, average='macro'))
    print(confusion_matrix(y_test, predicted))
`,
    id === 'naive-bayes'
      ? 'This example uses the Gaussian family for numeric measurements. Contrast its assumptions with the count-based naive Bayes example above. Inspect class-specific errors.'
      : 'Change one model control using the development folds, then lock it before a fresh assessment. Explain what flexibility or geometry the control changes.',
  );
for (const [id, name, statement, estimator] of [
  [
    'linear-regression',
    'Linear regression',
    'from sklearn.linear_model import LinearRegression',
    'LinearRegression()',
  ],
  [
    'gradient-descent',
    'SGD regression',
    'from sklearn.linear_model import SGDRegressor',
    'SGDRegressor(max_iter=10000, tol=1e-4, penalty=None, random_state=42)',
  ],
  [
    'regularization',
    'Ridge selection',
    'from sklearn.linear_model import Ridge\nfrom sklearn.model_selection import GridSearchCV',
    'Ridge(alpha=1)',
  ],
])
  add(
    id,
    name + ' with a held-out benchmark',
    `import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error
${statement}

# Educational benchmark only; this is not a clinical decision model.
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=.2, random_state=42)
pipeline = make_pipeline(StandardScaler(), ${estimator})
${id === 'regularization' ? "search = GridSearchCV(pipeline, {'ridge__alpha': [.01, .1, 1, 10, 100]}, cv=5, scoring='neg_mean_absolute_error')\nsearch.fit(X_train, y_train)\npipeline = search.best_estimator_\nprint('Selected parameters:', search.best_params_)" : 'pipeline.fit(X_train, y_train)'}
baseline = DummyRegressor(strategy='mean').fit(X_train, y_train)
for label, model in [('Baseline', baseline), ('${name}', pipeline)]:
    predicted = model.predict(X_test)
    assert np.isfinite(predicted).all()
    print(label, 'MAE:', mean_absolute_error(y_test, predicted))
    print(label, 'RMSE:', root_mean_squared_error(y_test, predicted))
`,
    'Explain the baseline and why all fitted preprocessing belongs to the pipeline. For SGD, compare convergence settings on development data and keep evaluation separate from optimization.',
  );
add(
  'k-means',
  'Fit and inspect a clustering model',
  `from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Synthetic data for studying geometry; no real-world groups are claimed.
X, _ = make_blobs(n_samples=240, centers=3, cluster_std=.7, random_state=42)
scaler = StandardScaler().fit(X)
Z = scaler.transform(X)
for seed in [1, 7, 42]:
    model = KMeans(n_clusters=3, n_init=10, random_state=seed).fit(Z)
    print('Seed/inertia/silhouette:', seed, model.inertia_, silhouette_score(Z, model.labels_))
    print('Centers in original units:', scaler.inverse_transform(model.cluster_centers_))
`,
  'Change cluster shape or density in the synthetic generator. Compare seeds and explain why inertia is not a proof of semantic quality.',
);
add(
  'density-clustering',
  'Inspect DBSCAN clusters and noise',
  `from collections import Counter
from sklearn.datasets import make_moons
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN

# Exploratory clustering of synthetic curved groups, not supervised evaluation.
X, _ = make_moons(n_samples=240, noise=.06, random_state=42)
Z = StandardScaler().fit_transform(X)
for radius in [.15, .25, .4]:
    model = DBSCAN(eps=radius, min_samples=5).fit(Z)
    counts = Counter(model.labels_.tolist())
    print('Radius:', radius, 'cluster counts (-1 means noise):', counts)
    print('Core points:', len(model.core_sample_indices_))
`,
  'Explain how radius changes core connectivity and noise. Do not treat a noise label as verified fraud or bad data.',
);
add(
  'pca',
  'Measure held-out reconstruction after PCA',
  `import numpy as np
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

X = load_wine().data
train, test = train_test_split(X, test_size=.25, random_state=42)
scaler = StandardScaler().fit(train)
train_z, test_z = scaler.transform(train), scaler.transform(test)
pca = PCA(n_components=2).fit(train_z)
scores = pca.transform(test_z)
reconstructed = pca.inverse_transform(scores)
print('Training explained variance ratios:', pca.explained_variance_ratio_)
print('Held-out mean squared reconstruction error:', np.mean((test_z-reconstructed)**2))
print('Score shape:', scores.shape)
`,
  'Compare component counts without claiming that explained variance equals classification accuracy. Preserve training scaling for held-out examples.',
);
add(
  'anomaly-detection',
  'Evaluate anomaly ranking on a controlled synthetic example',
  `import numpy as np
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
`,
  'Move anomalies nearer to the reference distribution. This intentionally easy synthetic evaluation is a mechanism check, not evidence of real-world detection quality.',
);
fs.mkdirSync('public/examples', { recursive: true });
for (const example of examples)
  fs.writeFileSync('public/examples/' + example.id + '.py', example.code);
fs.writeFileSync(
  'lib/practical-examples.json',
  JSON.stringify(examples, null, 2) + '\n',
);
console.log('Generated ' + examples.length + ' complete library examples.');
