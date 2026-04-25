import requests
import time

times = []
for i in range(5):
    start = time.time()
    files = {'file': open('c:/projects/FakeOut-AI/backend/data/dataset/real/file1.wav', 'rb')}
    r = requests.post('http://localhost:8001/predict', files=files)
    times.append(time.time() - start)
    print(f'Run {i+1}: {times[-1]:.3f}s')

print(f'Average: {sum(times)/len(times):.3f}s')
