import numpy as np
import os
import joblib

from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
PROCESSED_PATH = os.path.join(BASE_DIR, "processed")
MODELS_PATH = os.path.join(BASE_DIR, "app", "models")

X_path = os.path.join(PROCESSED_PATH, "X_train.npy")
y_path = os.path.join(PROCESSED_PATH, "y_train.npy")

if not os.path.exists(X_path):
    print("❌ No dataset yet. Run preprocess first.")
    exit(1)

# Load data
X = np.load(X_path)
y = np.load(y_path)

print("📊 Data shape:", X.shape)

if len(X) == 0:
    print("❌ Empty dataset. Cannot train.")
    exit(1)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Check for CUDA availability
try:
    import torch
    use_cuda = torch.cuda.is_available()
    if use_cuda:
        print("🔥 CUDA available - using GPU for XGBoost")
        tree_method = "hist"
        device = "cuda"
    else:
        print("⚠️ CUDA not available - using CPU")
        tree_method = "hist"
        device = "cpu"
except ImportError:
    print("⚠️ PyTorch not installed - using CPU")
    tree_method = "hist"
    device = "cpu"

# Models
xgb = XGBClassifier(
    n_estimators=250,
    max_depth=7,
    learning_rate=0.07,
    subsample=0.85,
    colsample_bytree=0.85,
    scale_pos_weight=1.5,
    eval_metric="logloss",
    tree_method=tree_method,
    device=device,
    random_state=42
)

rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    random_state=42,
    n_jobs=-1
)

# Train
print("🚀 Training XGBoost...")
xgb.fit(X_train, y_train)

print("🌳 Training Random Forest...")
rf.fit(X_train, y_train)

# Predict
xgb_pred = xgb.predict_proba(X_test)
rf_pred = rf.predict_proba(X_test)

ensemble_pred = (xgb_pred + rf_pred) / 2
final_pred = np.argmax(ensemble_pred, axis=1)

# Evaluate
acc = accuracy_score(y_test, final_pred)

print("\n🔥 ENSEMBLE RESULTS")
print("Accuracy:", acc)
print("\n📄 Classification Report:\n", classification_report(y_test, final_pred))

# Save everything
os.makedirs(MODELS_PATH, exist_ok=True)

joblib.dump(xgb, os.path.join(MODELS_PATH, "xgb_model.pkl"))
joblib.dump(rf, os.path.join(MODELS_PATH, "rf_model.pkl"))
joblib.dump(scaler, os.path.join(MODELS_PATH, "scaler.pkl"))

print("✅ Models + scaler saved to:", MODELS_PATH)

# Cleanup
del X, y, X_train, X_test, y_train, y_test
del xgb, rf, scaler
print("🧹 Memory cleaned")