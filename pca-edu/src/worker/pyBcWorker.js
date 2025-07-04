/* eslint-disable no-restricted-globals */
importScripts(
  'https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.js'
);

let ready = (async () => {
  self.pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.6/full/',
  });
  await pyodide.loadPackage(['numpy', 'pandas', 'scikit-learn']);
  pyodide.runPython(`
import json, numpy as np, pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# -------- load demo dataset once ----------
data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
feature_names = list(X.columns)
y = data.target.tolist()    # 0 = malignant, 1 = benign

# -------- run PCA ----------
X_std = StandardScaler().fit_transform(X)
pca  = PCA(n_components=10, random_state=42).fit(X_std)
pcs  = pca.transform(X_std).tolist()
var  = (pca.explained_variance_ratio_ * 100).round(2).tolist()

def get_payload():
    return json.dumps({
        "matrix": X.values.tolist(),
        "feature_names": feature_names,
        "target": y,
        "pcs": pcs,
        "variance": var
    })
`);
})();

self.onmessage = async () => {
  await ready;
  const out = pyodide.runPython('get_payload()')
  self.postMessage(JSON.parse(out));
};
