from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import datetime
import uuid

from app.ml.inference import predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# TEMP STORAGE
# =========================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "temp_audio")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25MB

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Backend running",
    }

# =========================
# MODEL INFO
# =========================
@app.get("/model-info")
def model_info():
    return {
        "model": "XGBoost + RandomForest Ensemble",
        "features": "MFCC (40)",
        "sampling_rate": "16kHz",
        "version": "v1.0"
    }

# =========================
# PREDICT ENDPOINT
# =========================
@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    start = datetime.datetime.now()
    file_path = None
    
    try:
        # VALIDATION - File format
        if not file.filename:
            return {
                "verdict": "ERROR",
                "confidence": 0.0,
                "risk_level": "unknown",
                "model1_verdict": "ERROR",
                "model1_confidence": 0.0,
                "model2_verdict": "ERROR",
                "model2_confidence": 0.0,
                "explanation": "No filename provided.",
                "processing_time": 0.0
            }
        
        if not file.filename.lower().endswith((".wav", ".mp3", ".flac", ".ogg", ".webm", ".m4a")):
            print(" Invalid file format")
            return {
                "verdict": "ERROR",
                "confidence": 0.0,
                "risk_level": "unknown",
                "model1_verdict": "ERROR",
                "model1_confidence": 0.0,
                "model2_verdict": "ERROR",
                "model2_confidence": 0.0,
                "explanation": "Invalid file format. Only .wav, .mp3, .flac, .ogg, .webm, or .m4a allowed.",
                "processing_time": 0.0
            }

        # Generate unique filename to prevent collisions
        ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        print(f" Received file: {file.filename}")
        print(f" Saving to: {file_path}")

        # Read file content to check size
        content = await file.read()
        
        # VALIDATION - File size
        if len(content) == 0:
            return {
                "verdict": "ERROR",
                "confidence": 0.0,
                "risk_level": "unknown",
                "model1_verdict": "ERROR",
                "model1_confidence": 0.0,
                "model2_verdict": "ERROR",
                "model2_confidence": 0.0,
                "explanation": "Empty file uploaded.",
                "processing_time": 0.0
            }
        
        if len(content) > MAX_FILE_SIZE:
            return {
                "verdict": "ERROR",
                "confidence": 0.0,
                "risk_level": "unknown",
                "model1_verdict": "ERROR",
                "model1_confidence": 0.0,
                "model2_verdict": "ERROR",
                "model2_confidence": 0.0,
                "explanation": f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB.",
                "processing_time": 0.0
            }

        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        print(" Running ML prediction...")
        # Run ML prediction
        result = predict(file_path)
        print(f" Prediction result: {result.get('verdict', 'ERROR')}")

        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

        # Add extra metadata
        result["status"] = "processed"
        result["filename"] = file.filename
        result["timestamp"] = str(datetime.datetime.now())

        return result

    except Exception as e:
        print(f" Server error: {e}")
        import traceback
        print(traceback.format_exc())
        # Cleanup on error
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
        
        return {
            "verdict": "ERROR",
            "confidence": 0.0,
            "risk_level": "unknown",
            "model1_verdict": "ERROR",
            "model1_confidence": 0.0,
            "model2_verdict": "ERROR",
            "model2_confidence": 0.0,
            "explanation": f"Analysis failed: {str(e)}",
            "processing_time": round((datetime.datetime.now() - start).total_seconds(), 3)
        }