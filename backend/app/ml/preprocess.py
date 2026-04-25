import os
import numpy as np
from .features import extract_features

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "data", "dataset")
PROCESSED_PATH = os.path.join(BASE_DIR, "processed")

X = []
y = []

MAX_PER_CLASS = 1500

if not os.path.exists(DATASET_PATH):
    print(f"❌ Dataset folder not found: {DATASET_PATH}")
    print("Please extract the dataset to the data/ folder first.")
    exit(1)

for label, folder in enumerate(["real", "fake"]):
    folder_path = os.path.join(DATASET_PATH, folder)

    if not os.path.exists(folder_path):
        print(f"❌ Missing folder: {folder_path}")
        continue

    files = os.listdir(folder_path)
    print(f"\n📂 Processing {folder} ({len(files)} files found)")

    class_count = 0

    for file in files:
        if class_count >= MAX_PER_CLASS:
            break

        if not file.lower().endswith((".wav", ".mp3", ".flac", ".ogg")):
            continue

        file_path = os.path.join(folder_path, file)

        try:
            features = extract_features(file_path)
            if features is None or len(features) == 0:
                print(f"⚠️ Skipping empty features: {file_path}")
                continue
            X.append(features)
            y.append(label)

            class_count += 1

            if class_count % 100 == 0:
                print(f"{folder}: {class_count} processed")

        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")

    print(f"✅ Done {folder}: {class_count} samples")

if len(X) == 0:
    print("❌ No valid samples processed. Check dataset and audio files.")
    exit(1)

print("\n🔥 FINAL DATASET SUMMARY")
print("Total samples:", len(X))

X = np.array(X)
y = np.array(y)

os.makedirs(PROCESSED_PATH, exist_ok=True)

np.save(os.path.join(PROCESSED_PATH, "X_train.npy"), X)
np.save(os.path.join(PROCESSED_PATH, "y_train.npy"), y)

print("✅ Saved dataset")
print("Shape:", X.shape)
print("Fake samples:", int(sum(y)))
print("Real samples:", int(len(y) - sum(y)))