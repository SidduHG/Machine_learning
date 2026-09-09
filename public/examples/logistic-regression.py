from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix
from sklearn.linear_model import LogisticRegression

# Historical benchmark: random-split results do not prove deployment quality.
data = load_wine()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=.25, stratify=data.target, random_state=42)
pipeline = make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))
folds = StratifiedKFold(5, shuffle=True, random_state=42)
scores = cross_val_score(pipeline, X_train, y_train, cv=folds, scoring='f1_macro')
print('Development macro F1 mean/std:', scores.mean(), scores.std())
# Lock the procedure before assessing the reserved test set.
baseline = DummyClassifier(strategy='most_frequent').fit(X_train, y_train)
pipeline.fit(X_train, y_train)
for label, model in [('Baseline', baseline), ('Logistic regression', pipeline)]:
    predicted = model.predict(X_test)
    print(label, 'accuracy:', accuracy_score(y_test, predicted))
    print(label, 'macro F1:', f1_score(y_test, predicted, average='macro'))
    print(confusion_matrix(y_test, predicted))
