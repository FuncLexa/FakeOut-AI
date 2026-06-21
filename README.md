<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=1a1a2e,16213e,0f3460&height=200&section=header&text=FakeOut%20AI&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Voice%20Deepfake%20Detection%20System&descAlignY=60&descSize=18&animation=fadeIn"/>

<br/>

<img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=16&duration=3000&pause=900&color=00D4FF&center=true&vCenter=true&width=750&lines=Dual-model+ML+ensemble+%28XGBoost+%2B+Random+Forest%29;wav2vec2+embeddings+%2B+MFCC+%2B+spectral+feature+extraction;FastAPI+inference+backend+%2B+React+frontend;Real+vs+Fake+audio+classification"/>

<br/>

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/XGBoost-FF6600?style=for-the-badge&logoColor=white"/>
<img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white"/>
<img src="https://img.shields.io/badge/wav2vec2-412991?style=for-the-badge&logoColor=white"/>
<img src="https://img.shields.io/badge/Librosa-8B0000?style=for-the-badge&logoColor=white"/>

</div>

> **Note:** This repository is maintained under a shared team account (FuncLexa) for FakeOut AI,
> built by Mohammad Adnan Shakil and Sultan Salauddin Ansari at FusionX Hackathon 2026.

---

## What It Does

FakeOut AI is a voice deepfake detection system that classifies audio samples as **real** or **AI-generated** using a dual-model ML ensemble. The system extracts wav2vec2 embeddings alongside 40 MFCC coefficients and spectral features from raw audio, runs inference through XGBoost and Random Forest models in parallel, and returns a classification with confidence score via a FastAPI backend.

Built as a hackathon project focused on the ML pipeline and feature engineering layer — not just wrapping an API.

---

## Architecture

```
Audio Upload (React Frontend)
↓
FastAPI Backend — receives audio file
↓
Feature Extraction
├── wav2vec2 Embeddings — pretrained self-supervised speech representations
├── 40 MFCC Coefficients (Librosa)
├── Spectral Centroid
├── Spectral Rolloff
└── Zero Crossing Rate
↓
Dual-Model Inference
├── XGBoost Classifier
└── Random Forest Classifier
↓
Ensemble Decision → Real / Fake + Confidence Score
↓
JSON Response → React Frontend
```

---

## ML Pipeline

### Feature Extraction
Raw audio is processed to extract two complementary feature sets:

**wav2vec2 embeddings** — pretrained self-supervised speech representations that capture deep acoustic and phonetic patterns beyond hand-crafted features.

**Librosa-based hand-crafted features:**
- **40 MFCC coefficients** — captures timbral texture of voice
- **Spectral centroid** — measures brightness of sound
- **Spectral rolloff** — frequency below which 85% of energy lies
- **Zero crossing rate** — rate of sign changes in signal

Combining learned embeddings with hand-crafted features gives the classifiers both deep acoustic context and interpretable signal-level features.

### Model Architecture
Two classifiers run in parallel on the combined feature vector:

| Model | Role |
|---|---|
| XGBoost | Primary classifier — handles non-linear feature interactions |
| Random Forest | Secondary classifier — ensemble of decision trees for stability |

Final prediction uses majority voting between both models. Disagreement between models is flagged as low confidence.

### Training Data
- Trained on 3000+ labeled audio samples (real vs AI-generated)
- Features normalized using StandardScaler before training
- Train/test split: 80/20

---

## Tech Stack

| Layer | Technology |
|---|---|
| Embeddings | wav2vec2 |
| ML Models | XGBoost, Random Forest (Scikit-learn) |
| Feature Extraction | Librosa |
| Backend | FastAPI (Python) |
| Frontend | React + TailwindCSS |
| Audio Processing | Librosa, NumPy |

---

## Project Structure

```
FakeOut-AI/
├── backend/
│   ├── main.py              # FastAPI app + inference endpoint
│   ├── model/
│   │   ├── extractor.py     # wav2vec2 + Librosa feature extraction
│   │   ├── classifier.py    # XGBoost + RF ensemble logic
│   │   └── models/          # Saved .pkl model files
│   └── requirements.txt
├── client/
│   ├── src/
│   │   ├── components/      # Upload UI, result display
│   │   └── App.jsx
│   └── package.json
└── .gitignore
```

---

## Running Locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd client
npm install
npm run dev
```

Backend runs on `http://localhost:8000`
Frontend runs on `http://localhost:5173`

---

## API Reference

**POST** `/predict`

```json
// Request — multipart/form-data
{
  "file": "<audio_file.wav>"
}

// Response
{
  "prediction": "fake",
  "confidence": 0.87,
  "xgboost_result": "fake",
  "random_forest_result": "fake"
}
```

---

## Key Engineering Decisions

**Why dual-model instead of single classifier?**
Single model overfits to specific deepfake generation patterns. Running XGBoost and Random Forest in parallel and requiring agreement before high-confidence classification reduces false negatives — the more dangerous error in deepfake detection.

**Why wav2vec2 alongside MFCC?**
wav2vec2 embeddings capture deep, learned acoustic patterns from a model pretrained on large speech corpora — picking up subtle generative artifacts that hand-crafted features can miss. MFCC and spectral features stay in the pipeline because they're interpretable and computationally cheap, giving the ensemble both depth and explainability.

**Why MFCC over raw waveform for the hand-crafted half?**
MFCC coefficients capture the perceptual characteristics of audio in a compact 40-dimensional vector. AI-generated voices consistently show anomalies in the higher MFCC coefficients that raw waveform models miss without significantly more training data.

**Why FastAPI over Flask?**
Async request handling and automatic OpenAPI docs generation. For an ML inference endpoint receiving file uploads, async I/O matters for concurrent requests.

---

<div align="center">

**Hackathon Project — Built for production ML pipeline exploration**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0f3460,16213e,1a1a2e&height=100&section=footer"/>

</div>
