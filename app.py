from flask import Flask, request, jsonify
import librosa
import numpy as np
import tempfile
import os

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        # בדיקה שיש קובץ
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # שמירה זמנית
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            file.save(tmp.name)
            file_path = tmp.name

        # טעינת האודיו
        y, sr = librosa.load(file_path)

        # 🎧 BPM
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

        # ⚡ אנרגיה
        rms = librosa.feature.rms(y=y)[0]
        energy = float(np.mean(rms))

        # 🔆 בהירות
        centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        brightness = float(np.mean(centroid))

        # 🥁 מורכבות קצב
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        rhythm = float(np.mean(zcr))

        # ניקוי קובץ זמני
        os.remove(file_path)

        # החזרה ל־Node
        return jsonify({
            "bpm": int(tempo),
            "energy": round(energy, 3),
            "brightness": round(brightness, 2),
            "rhythm_complexity": round(rhythm, 3)
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# חשוב ל-Render
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
