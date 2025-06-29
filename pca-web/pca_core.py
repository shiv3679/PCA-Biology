"""
pca_core.py
Small helper functions so app.py stays clean.
"""

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

def load_demo_breast_cancer():
    """Return the classic Breast-Cancer Wisconsin dataset as a (DataFrame, Series)."""
    from sklearn.datasets import load_breast_cancer
    cancer = load_breast_cancer(as_frame=True)
    X = cancer.data            # 569 × 30 numeric features
    y = pd.Series(cancer.target, name="label")  # 0 = malignant, 1 = benign
    return X, y

def preprocess_matrix(df: pd.DataFrame, center: bool, scale: bool):
    """
    Standardize dataframe according to user choices.
    Returns np.ndarray ready for PCA.
    """
    scaler = StandardScaler(with_mean=center, with_std=scale)
    return scaler.fit_transform(df.values)

def run_pca(X_std: np.ndarray, n_comp: int):
    """Fit PCA and return the fitted object plus transformed coordinates."""
    pca = PCA(n_components=n_comp, random_state=42)
    pcs = pca.fit_transform(X_std)
    return pca, pcs
