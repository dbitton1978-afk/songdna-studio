import sys
import json
import librosa
import numpy as np

file_path = sys.argv[1]

y, sr = librosa.load(file_path)

# BPM
tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

# Energy
rms = librosa.feature.rms(y=y)[0]
energy = float(np.mean(rms))

# Spectral centroid (brightness)
centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
brightness = float(np.mean(centroid))

# Zero crossing rate (rhythm complexity)
zcr = librosa.feature.zero_crossing_rate(y)[0]
rhythm = float(np.mean(zcr))

result = {
    "bpm": int(tempo),
    "energy": round(energy, 3),
    "brightness": round(brightness, 2),
    "rhythm_complexity": round(rhythm, 3)
}

print(json.dumps(result))
