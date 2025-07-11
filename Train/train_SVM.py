# train/train_svm.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report
import pickle
import os

# Load dataset
df = pd.read_csv("quality_dataset_balanced_generated.csv")

# Split features and labels
safe = df[df["label"] == 1]
unsafe = df[df["label"] == 0]

# Sample the majority class down to the size of the minority class
balanced_df = pd.concat([
    safe,
    unsafe.sample(n=len(safe), random_state=42)
]).sample(frac=1).reset_index(drop=True)

X = balanced_df.drop("label", axis=1)
y = balanced_df["label"]

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("📊 Class distribution in original dataset:")
print(df["label"].value_counts())


# Build and train SVM
svm = SVC(kernel="rbf", probability=True, class_weight="balanced")
svm.fit(X_train, y_train)


# Evaluate with labels
label_map = {1: "Safe to Donate", 0: "Not Safe"}
y_pred = svm.predict(X_test)
y_pred_labels = [label_map[i] for i in y_pred]
y_test_labels = [label_map[i] for i in y_test]

print("✅ Classification Report:")
print(classification_report(y_test_labels, y_pred_labels))

# Save both model and label map
os.makedirs("models", exist_ok=True)
with open("models/svm_model.pkl", "wb") as f:
    pickle.dump({
        "model": svm,
        "label_map": label_map
    }, f)

print("✅ SVM model saved as svm_model.pkl (with label map)")
