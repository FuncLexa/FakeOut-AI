# PROJECT_CONTEXT.md — FakeOut AI

## What This Project Is
A voice deepfake detection platform that classifies audio as real or AI-generated using a dual-model ML ensemble (XGBoost + RandomForest on acoustic features). Users can upload audio files or record directly in the browser, get a verdict (Likely Real / Suspicious / High Risk) with confidence scores, and export reports. Includes an analytics dashboard, history tracking, and a Groq-powered chat assistant (LexaBot).

## Current Status
- [x] Dual-model ML ensemble: XGBoost + RandomForest (MFCC-based feature extraction)
- [x] FastAPI backend serving real inference on /predict endpoint
- [x] React frontend with audio upload (drag-and-drop), recording, demo samples
- [x] Three verdict levels with confidence scoring and explanation
- [x] Groq-powered LexaBot chat assistant (llama-3.1-8b-instant)
- [x] Analytics dashboard with pie/area/radar charts
- [x] JSON and PDF export for detection reports
- [x] "Insight Studio" for re-analyzing exported JSON reports
- [x] Dark mode support
- [ ] wav2vec2 deep model integration is DISABLED (falls back to 0.5 uncertain)
- [ ] Dataset not included in repo (data/ directory missing)
- [ ] No Docker/deployment config for backend
- [ ] Training pipeline exists but requires external dataset

## Architecture Overview
- Backend: Python, FastAPI, port 8001, scikit-learn, XGBoost, librosa
- Frontend: React 19, Vite 8, Tailwind CSS 4, Framer Motion, Recharts, WaveSurfer.js
- Database: None (localStorage for history)
- ML/AI layer: XGBoost + RandomForest ensemble (MFCC features), wav2vec2 (disabled), OpenAI GPT-3.5 for explanations
- Deployment: Frontend on Vercel (project: fakeoutai), backend not deployed

## Key Files & Entry Points
- `backend/app/main.py` — FastAPI app with /predict, /health, /model-info endpoints
- `backend/app/ml/inference.py` — Ensemble prediction logic with explanation generation
- `backend/app/ml/features.py` — Audio feature extraction (40 MFCCs, chroma, spectral contrast, etc.)
- `backend/app/ml/train_xgb.py` — Model training pipeline (XGBoost + RandomForest)
- `backend/app/ml/preprocess.py` — Dataset preprocessing (expects data/dataset/real/ and data/dataset/fake/)
- `backend/app/ml/deep_model.py` — wav2vec2 integration (currently disabled)
- `client/src/pages/DetectionPage.jsx` — Main detection interface (upload, record, analyze)
- `client/src/pages/Dashboard.jsx` — Analytics dashboard with charts
- `client/src/context/DetectionContext.jsx` — History management, JSON/PDF export

## Environment & Setup
- Backend: `cd backend && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8001`
- Frontend: `cd client && npm install && npm run dev` (proxies /api -> localhost:8001)
- Backend .env: `OPENAI_API_KEY` (optional, for enhanced explanations)
- Client .env: `VITE_GROQ_API_KEY` (for LexaBot)
- **Gotcha**: wav2vec2 is disabled; deep model returns 0.5 confidence always
- **Gotcha**: No training dataset included — need to provide data/dataset/real/*.wav and data/dataset/fake/*.wav before running train_xgb.py

## Where I Left Off
- Last thing: "done" / "ui done" commits — frontend UI appears complete
- Next: Enable wav2vec2 deep model, add Docker/deployment config, include sample dataset
- Known: Data directory missing from repo, wav2vec2 integration is broken/disabled

## Git & Deployment
- Remote: unknown (no origin found in git log, likely Vercel-linked)
- Branch: main (multiple dev branches were merged)
- Last commit: "Resolve merge conflict in .gitignore"

## Context for AI Assistants
- Dual-model ensemble: XGBoost + RandomForest predictions are averaged for final confidence
- Verdict logic: both models FAKE + avg_conf > 85% → HIGH RISK; one FAKE or both FAKE lower conf → SUSPICIOUS; else LIKELY REAL
- Features are 40 MFCCs + deltas + delta-deltas + chroma + spectral contrast + spectral centroid + bandwidth + ZCR + RMS energy
- OpenAI GPT-3.5-turbo is used for explanations but is optional (has hardcoded fallback)
- Frontend proxies /api to localhost:8001 via Vite config — the prefix is stripped
- LexaBot uses Groq SDK with llama-3.1-8b-instant model
- Audio recording uses Web Audio API at 16kHz, produces 16-bit PCM WAV
- The wav2vec2 model (`superb/wav2vec2-base-superb-ks`) is loaded via HuggingFace transformers but currently commented out in inference.py
- No build tooling beyond what's in the repo — no Docker, no CI/CD config for backend
