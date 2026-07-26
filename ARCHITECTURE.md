# Architecture

## Component Breakdown

### FastAPI Backend
- **Role:** Audio upload, feature extraction, ensemble inference, model info
- **Tech:** FastAPI + Uvicorn + librosa + XGBoost + scikit-learn
- **Location:** backend/app/main.py

### ML Inference Engine
- **Role:** Ensemble prediction (XGBoost + RF) with confidence scoring and LLM explanations
- **Tech:** XGBoost 2.0, Random Forest, OpenAI GPT-3.5-turbo (optional)
- **Location:** backend/app/ml/inference.py

### Feature Extraction
- **Role:** Extracts MFCC, chroma, spectral contrast, ZCR, RMS from audio
- **Tech:** librosa + numpy
- **Location:** backend/app/ml/features.py

### React Frontend
- **Role:** Audio recording/upload, waveform visualization, verdict display, dashboard, history
- **Tech:** React 19 + Vite 8 + Tailwind 4 + Framer Motion + Recharts + WaveSurfer.js + Chart.js
- **Location:** client/src/

### Detection Context
- **Role:** Global state for detection results, history, file management
- **Tech:** React Context API
- **Location:** client/src/context/DetectionContext.jsx

## Key Architectural Decisions

### Decision 1: Dual-Model Ensemble over Single Classifier
**What:** XGBoost + Random Forest run in parallel, outputs averaged for final prediction
**Why:** Ensemble reduces false positive rate. Confidence scoring based on model agreement provides more nuanced verdicts (HIGH RISK / SUSPICIOUS / LIKELY REAL).
**Tradeoff:** Double inference cost. Two models to maintain and deploy.

### Decision 2: ~120-Dimensional Feature Vector over Raw Audio
**What:** 40 MFCC + deltas + chroma + spectral contrast + spectral centroid + ZCR + RMS
**Why:** Hand-crafted audio features capture both timbral (MFCC) and spectral characteristics. More interpretable and efficient than end-to-end deep learning for a constrained dataset.
**Tradeoff:** Feature engineering is domain-specific. May miss patterns that deep embeddings would capture.

### Decision 3: wav2vec2 Disabled (Fallback to 0.5)
**What:** Deep wav2vec2 embeddings are computed but disabled in the ensemble (always returns 0.5)
**Why:** Integration issues with the deep model. Rather than break the pipeline, it's safely disabled with a neutral contribution.
**Tradeoff:** Loses potential accuracy from deep feature extraction. Ensemble relies entirely on hand-crafted features.

### Decision 4: GPT-3.5-turbo for Explainability
**What:** After prediction, optional LLM call generates natural language explanation of the verdict
**Why:** Users want to understand why audio was classified as fake. LLM provides readable analysis referencing specific audio characteristics.
**Tradeoff:** Extra latency and cost per request. Requires OpenAI API key.

## Data Flow
1. User uploads/records audio → React frontend sends file to POST /predict
2. FastAPI validates file format and duration → normalizes to 3 seconds at 16kHz
3. Feature extraction computes ~120-dim feature vector via librosa
4. XGBoost + Random Forest models predict probabilities in parallel → ensemble averaging
5. Verdict logic: both FAKE + avg conf > 85% → HIGH RISK; one FAKE → SUSPICIOUS; else → LIKELY REAL
6. Optional: LLM generates explanation → appended to response
7. Response returned with verdict, confidence, model outputs, explanation

## Known Limitations
- wav2vec2 deep model disabled (integration issue)
- Training dataset not included in repository
- No Docker/deployment config for backend
- LLM explanation requires OpenAI API key (optional)
- Models trained on synthetic/generated data — real-world accuracy unverified

## Future Considerations
- Fix wav2vec2 integration
- Add training dataset to repository
- Add Docker for backend deployment
- Explore real-time detection pipeline
- Add more languages/dialects to training data
