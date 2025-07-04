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
import numpy as np, pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

def run_pca(matrix, n_components=3, center=True, scale=True):
    X = np.array(matrix)
    scaler = StandardScaler(with_mean=center, with_std=scale)
    X_std = scaler.fit_transform(X)
    pca = PCA(n_components=n_components, random_state=42)
    pcs = pca.fit_transform(X_std).tolist()
    var = (pca.explained_variance_ratio_ * 100).round(2).tolist()
    return {"pcs": pcs, "variance": var}
`);
})();

/* —————————————————————————————————————— */
self.onmessage = async ({ data }) => {
  await ready;

  const { matrix, nComp, center, scale } = data;

  try {
    /* expose the JS values to Python explicitly */
    pyodide.globals.set('matrix', matrix);
    pyodide.globals.set('nComp', nComp);
    pyodide.globals.set('center', center);
    pyodide.globals.set('scale', scale);

    const resultJson = pyodide.runPython(`
import json
json.dumps(run_pca(matrix, nComp, center, scale))
`);
    self.postMessage({ ok: true, payload: JSON.parse(resultJson) });
  } catch (err) {
    self.postMessage({ ok: false, error: err.toString() });
  }
};
