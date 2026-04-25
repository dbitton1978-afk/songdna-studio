from flask import Flask, request, jsonify
import librosa
import numpy as np
import tempfile
import os

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            file.save(tmp.name)
            file_path = tmp.name

        y, sr = librosa.load(file_path)

        # BPM
        tempo, beats = librosa.beat.beat_track(y=y, sr=sr)

        # Energy
        rms = librosa.feature.rms(y=y)[0]
        energy = float(np.mean(rms))

        # Brightness
        centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        brightness = float(np.mean(centroid))

        # Rhythm complexity
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        rhythm = float(np.mean(zcr))

        # Energy curve
        segments = np.array_split(rms, 5)
        energy_curve = [float(np.mean(seg)) for seg in segments]

        os.remove(file_path)

        return jsonify({
            "bpm": int(tempo),
            "energy": round(energy, 3),
            "brightness": round(brightness, 2),
            "rhythm_complexity": round(rhythm, 3),
            "energy_curve": energy_curve
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
