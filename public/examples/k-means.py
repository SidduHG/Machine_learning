from sklearn.datasets import make_blobs
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
