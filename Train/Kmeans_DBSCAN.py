import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score, calinski_harabasz_score
import pickle
import os

# === 1. Load Your Demand Dataset ===
df = pd.read_csv("demand_visualization_dataset.csv")

# === 2. Train KMeans on all features ===
features = df[["latitude", "longitude"]]
kmeans = KMeans(n_clusters=5, random_state=42)
kmeans_labels = kmeans.fit_predict(features)


# === 3. Evaluate KMeans ===
print("\n📊 KMeans Evaluation:")
if len(set(kmeans_labels)) > 1:
    sil = silhouette_score(features, kmeans_labels)
    ch = calinski_harabasz_score(features, kmeans_labels)
    print(f"   - Clusters found: {len(set(kmeans_labels))}")
    print(f"   - Silhouette Score: {sil:.4f}")
    print(f"   - Calinski-Harabasz Score: {ch:.4f}")
else:
    print("⚠️ KMeans: Only one cluster found.")

# === 4. Train DBSCAN on location only ===
location_df = df[["latitude", "longitude"]]
scaled_loc = StandardScaler().fit_transform(location_df)

dbscan = DBSCAN(eps=0.6, min_samples=3)
dbscan_labels = dbscan.fit_predict(scaled_loc)

# === 5. Evaluate DBSCAN ===
n_clusters = len(set(dbscan_labels)) - (1 if -1 in dbscan_labels else 0)
print(f"\n📊 DBSCAN clusters found: {n_clusters}")
if n_clusters > 1:
    sil = silhouette_score(scaled_loc, dbscan_labels)
    ch = calinski_harabasz_score(scaled_loc, dbscan_labels)
    print(f"   - Silhouette Score: {sil:.4f}")
    print(f"   - Calinski-Harabasz Score: {ch:.4f}")
else:
    print("⚠️ DBSCAN: Still not enough clusters. Try increasing eps again if needed.")

# === 6. Save Models ===
os.makedirs("models", exist_ok=True)
with open("models/kmeans_model.pkl", "wb") as f:
    pickle.dump(kmeans, f)
with open("models/dbscan_model.pkl", "wb") as f:
    pickle.dump(dbscan, f)

print("\n✅ KMeans and DBSCAN models trained and saved to 'models/'")
