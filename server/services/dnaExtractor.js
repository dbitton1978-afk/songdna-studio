import { exec } from "child_process";
import path from "path";

/* =========================================
   🧠 REAL AUDIO DNA EXTRACTION (PYTHON)
========================================= */
export const extractDNA = async (filePath) => {
  return new Promise((resolve, reject) => {

    // 📁 נתיב ל-Python analyzer
    const analyzerPath = path.resolve("server/audio/analyzer.py");

    const command = `python "${analyzerPath}" "${filePath}"`;

    exec(command, (error, stdout, stderr) => {

      if (error) {
        console.error("❌ PYTHON ERROR:", error.message);
        return reject(error);
      }

      if (stderr) {
        console.error("⚠️ PYTHON STDERR:", stderr);
      }

      try {
        const result = JSON.parse(stdout);

        /* =========================================
           🎧 בניית DNA אמיתי מהנתונים
        ========================================= */

        const dna = {
          bpm: Math.round(result.bpm || 120),

          groove: {
            swing: Number(result.groove_density || 0.1).toFixed(2),
            bounce: Number(result.groove_density * 1.2 || 0.2).toFixed(2),
            drive: Number(result.groove_density * 1.5 || 0.3).toFixed(2),
          },

          energy_curve: result.energy_curve || [0.2, 0.4, 0.6, 0.8, 1.0],

          drums: {
            kick: result.bpm > 135 ? "fast punchy kick" : "steady club kick",
            clap: "tight electronic clap",
            hihat: "offbeat groove hihat",
          },

          bass: {
            type: result.bpm > 135 ? "rolling psy bass" : "groovy house bass",
            movement: result.groove_density > 0.1 ? "syncopated" : "straight",
          },

          melody: {
            contour: result.brightness > 3000 ? "sharp energetic" : "smooth melodic",
            density: result.beat_count > 200 ? "dense" : "medium",
          },

          harmony: result.brightness > 3000 ? "bright uplifting" : "deep emotional",

          structure: ["intro", "build", "drop", "break", "drop"],

          sound_palette: result.brightness > 3000
            ? ["digital", "bright", "aggressive"]
            : ["analog", "warm", "deep"],

          vocal_presence: "none",

          style_tags: [
            result.bpm > 135 ? "trance" : "house",
            result.groove_density > 0.1 ? "groovy" : "driving"
          ],

          club_energy: Math.min(100, Math.floor(result.brightness / 100)),

          emotion_score: Math.min(100, Math.floor(result.energy_curve[4] * 100)),
        };

        resolve(dna);

      } catch (parseError) {
        console.error("❌ JSON PARSE ERROR:", parseError.message);
        reject(parseError);
      }
    });
  });
};
