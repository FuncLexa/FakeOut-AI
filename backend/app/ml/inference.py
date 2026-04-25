import joblib
import os
import time
import numpy as np
from openai import OpenAI

from .features import extract_features
from .deep_model import deep_predict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "app", "models")

xgb = None
rf = None
scaler = None

def load_models():
    global xgb, rf, scaler
    if xgb is None:
        xgb_path = os.path.join(MODELS_DIR, "xgb_model.pkl")
        rf_path = os.path.join(MODELS_DIR, "rf_model.pkl")
        scaler_path = os.path.join(MODELS_DIR, "scaler.pkl")
        
        if os.path.exists(xgb_path):
            try:
                xgb = joblib.load(xgb_path)
            except Exception as e:
                print(f"⚠️ Failed to load XGBoost model: {e}")
        if os.path.exists(rf_path):
            try:
                rf = joblib.load(rf_path)
            except Exception as e:
                print(f"⚠️ Failed to load RF model: {e}")
        if os.path.exists(scaler_path):
            try:
                scaler = joblib.load(scaler_path)
            except Exception as e:
                print(f"⚠️ Failed to load scaler: {e}")

load_models()

def get_fallback_explanation(verdict):
    explanations = {
        "HIGH RISK": "Multiple acoustic indicators suggest this voice was synthetically generated. The pitch patterns are unusually consistent and lack the natural micro-variations found in human speech. Exercise extreme caution with this audio.",
        "SUSPICIOUS": "Some characteristics of this voice are inconsistent with natural human speech. It may have been processed or partially synthesized. Verify through other means.",
        "LIKELY REAL": "This voice exhibits natural acoustic patterns consistent with human speech, including normal pitch variation and breath artifacts. No significant synthetic markers detected."
    }
    return explanations.get(verdict, "Analysis inconclusive.")

def get_llm_explanation(verdict, confidence, risk_level):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("⚠️ OPENAI_API_KEY not set, using fallback explanation")
        return get_fallback_explanation(verdict)
    
    try:
        client = OpenAI(api_key=api_key)
        prompt = f"""You are an audio forensics expert.
A voice sample analysis returned:
Verdict: {verdict}
Confidence: {confidence}%
Risk Level: {risk_level}

In exactly 2-3 sentences, explain in plain English 
why this voice may or may not be AI-generated.
Be specific about acoustic artifacts.
No technical jargon. Write for a non-technical person.
Do not start with 'The voice' or 'This voice'.
Sound like a security expert warning someone."""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7,
            timeout=10.0
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"LLM Error: {e}, using fallback")
        return get_fallback_explanation(verdict)

def predict(audio_path: str):
    start = time.time()
    features = None

    try:
        print(f"Starting prediction for: {audio_path}")
        load_models()
        
        if xgb is None or scaler is None:
            raise ValueError("Models not loaded. Check if training was completed.")

        print("Extracting features...")
        features = extract_features(audio_path)
        if features is None or len(features) == 0:
            raise ValueError("Failed to extract features from audio")
        
        features = features.reshape(1, -1)
        print(f"Features shape: {features.shape}")
        features = scaler.transform(features)
        print("Features transformed")

        xgb_prob = xgb.predict_proba(features)
        rf_prob = rf.predict_proba(features) if rf else xgb_prob
        final_prob = (xgb_prob + rf_prob) / 2

        prob_fake_ml = float(final_prob[0][1])
        model1_verdict = "FAKE" if prob_fake_ml > 0.5 else "REAL"
        model1_confidence = round(max(prob_fake_ml, 1 - prob_fake_ml) * 100, 2)

        try:
            prob_fake_deep = deep_predict(audio_path)
            # If deep model returns 0.5 (uncertain/fallback), use ML model
            if abs(prob_fake_deep - 0.5) < 0.01:
                print("⚠️ Deep model uncertain, using ML model")
                prob_fake_deep = prob_fake_ml
                model2_verdict = model1_verdict
                model2_confidence = model1_confidence
            else:
                model2_verdict = "FAKE" if prob_fake_deep > 0.5 else "REAL"
                model2_confidence = round(max(prob_fake_deep, 1 - prob_fake_deep) * 100, 2)
        except Exception as e:
            print(f"⚠️ Deep model failed: {e}, using ML model for both")
            prob_fake_deep = prob_fake_ml
            model2_verdict = model1_verdict
            model2_confidence = model1_confidence

        if model1_verdict == "FAKE" and model2_verdict == "FAKE":
            avg_conf = (model1_confidence + model2_confidence) / 2
            if avg_conf > 85:
                verdict = "HIGH RISK"
                risk_level = "high"
            else:
                verdict = "SUSPICIOUS"
                risk_level = "medium"
            confidence = avg_conf
        elif model1_verdict == "FAKE" or model2_verdict == "FAKE":
            verdict = "SUSPICIOUS"
            risk_level = "medium"
            confidence = (model1_confidence + model2_confidence) / 2
        else:
            verdict = "LIKELY REAL"
            risk_level = "low"
            confidence = (model1_confidence + model2_confidence) / 2

        explanation = get_llm_explanation(verdict, confidence, risk_level)

        # Cleanup
        if features is not None:
            del features
        try:
            import torch
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        except:
            pass

        end = time.time()

        return {
            "verdict": verdict,
            "confidence": float(confidence),
            "risk_level": risk_level,
            "model1_verdict": model1_verdict,
            "model1_confidence": float(model1_confidence),
            "model2_verdict": model2_verdict,
            "model2_confidence": float(model2_confidence),
            "explanation": explanation,
            "processing_time": round(end - start, 3)
        }

    except Exception as e:
        import traceback
        print(f"Prediction error: {e}")
        print(traceback.format_exc())
        
        # Cleanup on error
        if features is not None:
            del features
        try:
            import torch
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        except:
            pass
        
        return {
            "verdict": "ERROR",
            "confidence": 0.0,
            "risk_level": "unknown",
            "model1_verdict": "ERROR",
            "model1_confidence": 0.0,
            "model2_verdict": "ERROR",
            "model2_confidence": 0.0,
            "explanation": f"Analysis failed: {str(e)}",
            "processing_time": round(time.time() - start, 3)
        }