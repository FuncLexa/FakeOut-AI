from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification
import torch
import librosa
import threading

model = None
feature_extractor = None
loading = False
load_thread = None

def load_model_async():
    global model, feature_extractor, loading
    if loading or model is not None:
        return
    
    loading = True
    try:
        model_name = "superb/wav2vec2-base-superb-ks"
        print("[INFO] Loading deep model in background...")
        feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_name)
        model = Wav2Vec2ForSequenceClassification.from_pretrained(model_name)
        model.eval()
        print("[INFO] Deep model loaded")
    except Exception as e:
        print(f"[ERROR] Deep model load failed: {e}")
    finally:
        loading = False

def start_background_load():
    global load_thread
    # Disabled deep model loading due to HuggingFace model issues
    # System will use ML model (XGBoost) as fallback
    print("[INFO] Deep model disabled, using ML model only")
    return

# start_background_load()

def deep_predict(audio_path):
    if model is None or feature_extractor is None:
        print("[WARN] Deep model not ready, using fallback")
        return 0.5

    try:
        audio, sr = librosa.load(audio_path, sr=16000)

        inputs = feature_extractor(
            audio,
            sampling_rate=16000,
            return_tensors="pt",
            padding=True
        )

        with torch.no_grad():
            logits = model(**inputs).logits

        probs = torch.softmax(logits, dim=1).numpy()[0]
        return float(probs[1]) if len(probs) > 1 else 0.5
    except Exception as e:
        print(f"[ERROR] Deep predict error: {e}")
        return 0.5