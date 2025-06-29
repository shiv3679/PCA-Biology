# 0. Imports
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# 1. Load data
from sklearn.datasets import load_breast_cancer
cancer = load_breast_cancer()
X = pd.DataFrame(cancer.data, columns=cancer.feature_names)
y = pd.Series(cancer.target, name='label')

# 2. Standardize features (zero-mean, unit-variance is *critical* for PCA)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Fit PCA
pca = PCA(n_components=None, random_state=42)  # keep all PCs initially
X_pca = pca.fit_transform(X_scaled)

# 4. Scree plot – how many PCs to keep?
plt.figure(figsize=(8,4))
plt.plot(range(1, len(pca.explained_variance_ratio_)+1),
         np.cumsum(pca.explained_variance_ratio_)*100, marker='o')
plt.axhline(90, linestyle='--')  # conventional 90% threshold
plt.xlabel('Number of principal components')
plt.ylabel('Cumulative explained variance (%)')
plt.title('Scree plot')
plt.show()

# 5. Quick look at first two PCs
pc_df = pd.DataFrame(X_pca[:, :2], columns=['PC1','PC2'])
pc_df['label'] = y

plt.figure(figsize=(6,6))
sns.scatterplot(data=pc_df, x='PC1', y='PC2', hue='label',
                palette=['#d62728','#2ca02c'], alpha=0.7)
plt.title('Breast-Cancer samples in PC space')
plt.show()

# 6. Feature loadings—what drives PC1?
loadings = pd.Series(pca.components_[0], index=X.columns)\
            .sort_values(key=abs, ascending=False)
print(loadings.head(10))
