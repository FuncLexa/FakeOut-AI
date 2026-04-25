import requests
import concurrent.futures
import time

print("=== Phase 5.2: Testing rapid concurrent requests ===\n")

def test_request(file_path):
    try:
        files = {'file': open(file_path, 'rb')}
        r = requests.post('http://localhost:8001/predict', files=files)
        data = r.json()
        return (True, data['verdict'], data['confidence'])
    except Exception as e:
        return (False, str(e), 0)

# Test 5 concurrent requests
file_path = 'c:/projects/FakeOut-AI/backend/data/dataset/real/file1.wav'
start = time.time()

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(test_request, file_path) for _ in range(5)]
    results = [f.result() for f in concurrent.futures.as_completed(futures)]

elapsed = time.time() - start

success_count = sum(1 for r in results if r[0])
print(f"Sent 5 concurrent requests")
print(f"Success: {success_count}/5")
print(f"Total time: {elapsed:.2f}s")
print(f"Average per request: {elapsed/5:.2f}s")

for i, (success, verdict, conf) in enumerate(results, 1):
    if success:
        print(f"  Request {i}: ✓ {verdict} ({conf:.1f}%)")
    else:
        print(f"  Request {i}: ✗ {verdict}")

print("\n=== Rapid request test complete ===")
