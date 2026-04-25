import requests

# Test real audio with debug
files = {'file': open('c:/projects/FakeOut-AI/backend/data/dataset/real/file1.wav', 'rb')}
r = requests.post('http://localhost:8001/predict', files=files)
data = r.json()
print(f'Real: verdict={data["verdict"]}, confidence={data["confidence"]}, risk={data["risk_level"]}')
print(f'  model1: {data["model1_verdict"]} ({data["model1_confidence"]})')
print(f'  model2: {data["model2_verdict"]} ({data["model2_confidence"]})')
print(f'  explanation: {data["explanation"][:100]}...')
