import requests

# Test real audio
files = {'file': open('c:/projects/FakeOut-AI/backend/data/dataset/real/file1.wav', 'rb')}
r = requests.post('http://localhost:8001/predict', files=files)
data = r.json()
print(f'Real: verdict={data["verdict"]}, confidence={data["confidence"]}, model1={data["model1_verdict"]}({data["model1_confidence"]}), model2={data["model2_verdict"]}({data["model2_confidence"]})')

# Test fake audio
files = {'file': open('c:/projects/FakeOut-AI/backend/data/dataset/fake/file10006.wav', 'rb')}
r = requests.post('http://localhost:8001/predict', files=files)
data = r.json()
print(f'Fake: verdict={data["verdict"]}, confidence={data["confidence"]}, model1={data["model1_verdict"]}({data["model1_confidence"]}), model2={data["model2_verdict"]}({data["model2_confidence"]})')
