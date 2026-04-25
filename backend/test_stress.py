import requests
import time

print("=== Phase 5.1: Running full demo flow multiple times ===\n")

test_files = [
    ('real', 'c:/projects/FakeOut-AI/backend/data/dataset/real/file1.wav'),
    ('fake', 'c:/projects/FakeOut-AI/backend/data/dataset/fake/file10006.wav'),
    ('real', 'c:/projects/FakeOut-AI/backend/data/dataset/real/file2.wav'),
    ('fake', 'c:/projects/FakeOut-AI/backend/data/dataset/fake/file10019.wav'),
]

for i, (label, path) in enumerate(test_files, 1):
    print(f"Run {i}: Testing {label} audio")
    start = time.time()
    try:
        files = {'file': open(path, 'rb')}
        r = requests.post('http://localhost:8001/predict', files=files)
        data = r.json()
        elapsed = time.time() - start
        print(f"  ✓ Verdict: {data['verdict']}, Confidence: {data['confidence']:.1f}%, Time: {elapsed:.2f}s")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    time.sleep(0.5)

print("\n=== Stress test complete ===")
