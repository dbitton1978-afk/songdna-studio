import { exec } from "child_process";
import path from "path";

export const extractDNA = async (filePath) => {
  return new Promise((resolve, reject) => {

    // 📍 מיקום קובץ הפייתון
    const scriptPath = path.join(process.cwd(), "server", "python", "analyze.py");

    // ⚡ הרצת Python
    const command = `python "${scriptPath}" "${filePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Python Error:", error.message);
        return reject(error);
      }

      if (stderr) {
        console.warn("⚠️ Python STDERR:", stderr);
      }

      try {
        const result = JSON.parse(stdout);

        // 🎧 המרה ל-DNA שלנו
        const dna = {
          bpm: result.bpm,

          groove: {
            swing: Number((result.rhythm_complexity).toFixed(2)),
            bounce: Number((result.energy).toFixed(2)),
            drive: Number((result.energy * 1.2).toFixed(2)),
          },

          energy_curve: [
            result.energy * 0.6,
            result.energy * 0.8,
            result.energy,
            result.energy * 0.7,
            result.energy * 0.9,
          ].map(v => Number(v.toFixed(2))),

          drums: {
            kick: result.energy > 0.05 ? "punchy" : "soft",
            clap: "tight",
            hihat: result.rhythm_complexity > 0.05 ? "syncopated" : "straight",
          },

          bass: {
            type: result.energy > 0.05 ? "driving" : "subtle",
            movement: result.rhythm_complexity > 0.05 ? "groovy" : "steady",
          },

          melody: {
            contour: result.brightness > 2000 ? "bright-up" : "deep",
            density: result.energy > 0.05 ? "dense" : "minimal",
          },

          harmony: result.brightness > 2000 ? "bright" : "dark",

          structure: ["intro", "build", "drop", "break", "drop"],

          sound_palette: result.brightness > 2000
            ? ["digital", "bright", "sharp"]
            : ["analog", "deep", "warm"],

          vocal_presence: "unknown",

          style_tags: ["detected-from-audio"],

          club_energy: Math.min(100, Math.floor(result.energy * 2000)),

          emotion_score: Math.min(100, Math.floor(result.brightness / 50)),
        };

        resolve(dna);

      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError.message);
        reject(parseError);
      }
    });
  });
};
