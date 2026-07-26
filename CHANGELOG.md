# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-07-03

### Added
- FastAPI backend with `/predict`, `/health`, `/model-info` endpoints
- XGBoost + Random Forest dual-model ensemble for voice deepfake detection
- Audio feature extraction pipeline (40 MFCC + deltas + chroma + spectral contrast + centroid + bandwidth + ZCR + RMS)
- Audio preprocessing with 3-second normalization at 16kHz
- React 19 + Vite 8 frontend with Tailwind CSS 4 styling
- Audio upload via drag-and-drop and file picker
- Browser-based audio recording using Web Audio API (16kHz, 16-bit PCM WAV)
- Waveform visualization with WaveSurfer.js
- Three-tier verdict system: HIGH RISK, SUSPICIOUS, LIKELY REAL
- Confidence scoring based on model agreement
- Analytics dashboard with pie, area, and radar charts (Recharts + Chart.js)
- Detection history with localStorage persistence
- JSON and PDF export for detection reports (jsPDF + html2canvas)
- Insight Studio for re-analyzing exported JSON reports
- Dark mode support via ThemeContext
- Groq-powered LexaBot chat assistant (llama-3.1-8b-instant)
- OpenAI GPT-3.5-turbo integration for optional natural language explanations
- Responsive UI with Framer Motion animations
- Landing, Features, Technology, and Visualize pages
- wav2vec2 deep model integration (currently disabled — returns 0.5 fallback)
- Model training pipeline (XGBoost + Random Forest with preprocessing)
- README and PROJECT_CONTEXT.md documentation
- Linting and build tooling with ESLint + Vite

### Fixed
- `.env` files removed from git tracking
- Repository structure cleaned of root-level stray files
- Gitignore merge conflicts resolved

### Changed
- Updated README with project details and structure
- Project context documentation added for AI assistant compatibility

### Notes
- wav2vec2 deep model is loaded via `superb/wav2vec2-base-superb-ks` but is disabled (integration issue)
- Training dataset not included in repository — requires external data/dataset/ directory
- OpenAI API key optional — fallback explanations provided when key is absent
- Backend not deployed; frontend deployed on Vercel (project: fakeoutai)
