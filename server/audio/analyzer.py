import librosa
import numpy as np
import json
import sys

file_path = sys.argv[1]

y, sr = librosa.load(file_path)

# BPM
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)

# Beat times
beat_times = librosa.frames_to_time(beats, sr=sr)

# Spectral centroid (brightness)
spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]

# RMS energy
rms = librosa.feature.rms(y=y)[0]

# Zero crossing rate (rhythmic density)
zcr = librosa.feature.zero_crossing_rate(y)[0]

# Simple groove estimation
groove = float(np.mean(zcr))

# Energy curve (5 segments)
segments = np.array_split(rms, 5)
energy_curve = [float(np.mean(seg)) for seg in segments]

result = {
    "bpm": float(tempo),
    "groove_density": groove,
    "energy_curve": energy_curve,
    "brightness": float(np.mean(spectral_centroids)),
    "beat_count": len(beats)
}

print(json.dumps(result))
