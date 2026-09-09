import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error
from sklearn.linear_model import LinearRegression

# Educational benchmark only; this is not a clinical decision model.
data = load_diabetes()
X_train, X_test, y_train, y_test = train_test_split(data.data, data.target, test_size=.2, random_state=42)
pipeline = make_pipeline(StandardScaler(), LinearRegression())
pipeline.fit(X_train, y_train)
baseline = DummyRegressor(strategy='mean').fit(X_train, y_train)
for label, model in [('Baseline', baseline), ('Linear regression', pipeline)]:
    predicted = model.predict(X_test)
    assert np.isfinite(predicted).all()
    print(label, 'MAE:', mean_absolute_error(y_test, predicted))
    print(label, 'RMSE:', root_mean_squared_error(y_test, predicted))
