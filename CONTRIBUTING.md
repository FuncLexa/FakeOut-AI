# Contributing to FakeOut-AI

First off, thank you for considering contributing to FakeOut-AI. It's people like you that make this tool better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to **muhammedadnanshakil456@gmail.com**.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Describe the behavior you observed and what behavior you expected to see
- Include screenshots or animated GIFs if possible
- Include the browser, OS, and Python version

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When suggesting an enhancement:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Explain why this enhancement would be useful to most users
- List some other tools or applications where this enhancement exists, if applicable

### Pull Requests

1. Fork the repository and create your branch from `main`
2. If you've added code, add tests that cover your changes
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue the pull request

## Development Setup

### Backend

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Styleguides

### Python Styleguide

- Follow PEP 8
- Use type hints where possible
- Write docstrings for public functions

### React Styleguide

- Use functional components with hooks
- Follow the existing component structure
- Use Tailwind CSS classes for styling

## Project Structure

```
backend/
  app/
    main.py            # FastAPI entry point
    ml/
      inference.py      # Ensemble prediction logic
      features.py       # Feature extraction
      deep_model.py     # wav2vec2 (disabled)
      train_xgb.py      # Model training
      preprocess.py     # Data preprocessing
    models/             # Trained model files (.pkl)
client/
  src/
    pages/              # Route-level components
    components/         # Reusable components
    context/            # React contexts
    assets/             # Static assets
```

## Questions?

Feel free to contact the maintainer at **muhammedadnanshakil456@gmail.com**.
