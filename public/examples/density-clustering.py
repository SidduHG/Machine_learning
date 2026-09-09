from collections import Counter
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
