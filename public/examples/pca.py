import numpy as np
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
