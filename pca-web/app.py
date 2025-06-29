#!/usr/bin/env python3
"""
app.py
Interactive PCA explorer for biologists – no CSV required!
Run with:
    streamlit run app.py
"""
import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

from pca_core import load_demo_breast_cancer, preprocess_matrix, run_pca

# ──────────────────────────────────────────────────────────────────────────
# Streamlit page configuration
st.set_page_config(page_title="🧬 PCA Explorer", layout="wide")

st.title("🧬 Principal-Component Analysis (PCA) Explorer")
st.markdown("""
Welcome! This tiny web app lets you **see** high-dimensional biology data in
just a few clicks.

*No dataset handy?* Leave “Use demo data” checked and jump right in.  
Have a gene-expression matrix? Un-check the box and upload a CSV (samples × genes).
""")

# ──────────────────────────────────────────────────────────────────────────
# Sidebar – dataset source
st.sidebar.header("1 ▸ Choose data")
use_demo = st.sidebar.checkbox("Use demo Breast-Cancer dataset", value=True)

if use_demo:
    X_df, y_series = load_demo_breast_cancer()
    st.sidebar.success("✅ Demo dataset loaded (569 samples × 30 features).")
else:
    uploaded = st.sidebar.file_uploader("Upload CSV (samples × genes)", type=["csv","tsv"])
    if uploaded is None:
        st.stop()
    X_df = pd.read_csv(uploaded, sep=None, engine="python")
    y_series = None   # user data may not have labels

# ──────────────────────────────────────────────────────────────────────────
# Sidebar – preprocessing & PCA parameters
st.sidebar.header("2 ▸ Pre-processing")
center = st.sidebar.checkbox("Center (zero-mean)", True)
scale  = st.sidebar.checkbox("Scale (unit variance)", True)

st.sidebar.header("3 ▸ PCA")
max_components = min(10, X_df.shape[1])          # keep UI manageable
n_comp = st.sidebar.slider("Number of PCs", 2, max_components, 3)

# ──────────────────────────────────────────────────────────────────────────
# Main area – run PCA
X_std = preprocess_matrix(X_df, center, scale)
pca, pcs = run_pca(X_std, n_comp)
var_exp = np.round(pca.explained_variance_ratio_ * 100, 2)

# Scree plot – cumulative variance
st.subheader("Explained variance (Scree plot)")
cum_df = pd.DataFrame({
    "PC": np.arange(1, len(var_exp)+1),
    "Cumulative % variance": np.cumsum(var_exp)
})
st.line_chart(cum_df, x="PC", y="Cumulative % variance", height=250)

# 3-D scatter of first 3 PCs (or 2-D if only 2 requested)
st.subheader("Samples in principal-component space")

pc_cols = [f"PC{i}" for i in range(1, n_comp+1)]
pc_df = pd.DataFrame(pcs, columns=pc_cols)
if y_series is not None:
    pc_df["label"] = y_series.map({0:"malignant", 1:"benign"})

if n_comp >= 3:
    fig = px.scatter_3d(
        pc_df, x="PC1", y="PC2", z="PC3",
        color="label" if "label" in pc_df.columns else None,
        hover_name=pc_df.index.astype(str),
        title="Interactive 3-D view"
    )
else:  # 2-D fallback
    fig = px.scatter(
        pc_df, x="PC1", y="PC2",
        color="label" if "label" in pc_df.columns else None,
        hover_name=pc_df.index.astype(str),
        title="Interactive plot"
    )
st.plotly_chart(fig, use_container_width=True)

# Feature loadings for PC1
st.subheader("Top contributors to PC1")
loadings = pd.Series(pca.components_[0], index=X_df.columns)\
    .sort_values(key=np.abs, ascending=False)
st.write(loadings.head(20))
