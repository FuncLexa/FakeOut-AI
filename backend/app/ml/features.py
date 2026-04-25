import librosa
import numpy as np
import os

TARGET_DURATION = 3  # seconds
TARGET_SR = 16000
TARGET_LENGTH = TARGET_DURATION * TARGET_SR

def extract_features(file_path):
    if not os.path.exists(file_path):
        raise ValueError(f"File not found: {file_path}")
    
    if os.path.getsize(file_path) == 0:
        raise ValueError("File is empty")
    
    try:
        audio, sr = librosa.load(file_path, sr=TARGET_SR)
    except Exception as e:
        raise ValueError(f"Failed to load audio: {e}")

    if len(audio) == 0:
        raise ValueError("Empty audio after loading")

    # Normalize
    audio = librosa.util.normalize(audio)

    # FIXED LENGTH (pad short, truncate long)
    if len(audio) < TARGET_LENGTH:
        audio = np.pad(audio, (0, TARGET_LENGTH - len(audio)))
    else:
        audio = audio[:TARGET_LENGTH]

    # MFCC
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
    mfcc_mean = np.mean(mfcc, axis=1)

    # Delta features
    delta = librosa.feature.delta(mfcc)
    delta2 = librosa.feature.delta(mfcc, order=2)

    delta_mean = np.mean(delta, axis=1)
    delta2_mean = np.mean(delta2, axis=1)

    # Chroma
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    chroma_mean = np.mean(chroma, axis=1)

    # Spectral Contrast
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sr)
    contrast_mean = np.mean(contrast, axis=1)

    # Spectral centroid & bandwidth
    centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)
    bandwidth = librosa.feature.spectral_bandwidth(y=audio, sr=sr)

    centroid_mean = np.mean(centroid)
    bandwidth_mean = np.mean(bandwidth)

    # ZCR
    zcr = librosa.feature.zero_crossing_rate(audio)
    zcr_mean = np.mean(zcr)

    # RMS
    rms = librosa.feature.rms(y=audio)
    rms_mean = np.mean(rms)

    # Combine
    features = np.hstack([
        mfcc_mean,
        delta_mean,
        delta2_mean,
        chroma_mean,
        contrast_mean,
        [centroid_mean],
        [bandwidth_mean],
        [zcr_mean],
        [rms_mean]
    ])

    return features