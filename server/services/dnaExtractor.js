import { exec } from "child_process";
import path from "path";

export const extractDNA = async (filePath) => {
  return new Promise((resolve, reject) => {

    const scriptPath = path.join(process.cwd(), "server", "python", "analyze.py");

    // חשוב: python3 fallback
    const command = `python "${scriptPath}" "${filePath}"`;

    exec(command, (error, stdout, stderr) => {

      console.log("PYTHON STDOUT:", stdout);
      console.log("PYTHON STDERR:", stderr);

      if (error) {
        console.error("❌ Python Execution Error:", error);
        return reject(error);
      }

      try {
        const result = JSON.parse(stdout);

        const dna = {
          bpm: result.bpm || 120,

          groove: {
            swing: Number(result.rhythm_complexity || 0.3),
            bounce: Number(result.energy || 0.5),
            drive: Number((result.energy * 1.2) || 0.6),
          },

          energy_curve: [
            result.energy * 0.6,
            result.energy * 0.8,
            result.energy,
            result.energy * 0.7,
            result.energy * 0.9,
          ].map(v => Number((v || 0.5).toFixed(2))),

          drums: {
            kick: "punchy",
            clap: "tight",
            hihat: "syncopated",
          },

          bass: {
            type: "driving",
            movement: "groovy",
          },

          melody: {
            contour: "dynamic",
            density: "medium",
          },

          harmony: "balanced",

          structure: ["intro", "build", "drop", "break", "drop"],

          sound_palette: ["analog", "digital"],

          vocal_presence: "unknown",

          style_tags: ["audio-derived"],

          club_energy: Math.min(100, Math.floor((result.energy || 0.5) * 200)),

          emotion_score: Math.min(100, Math.floor((result.brightness || 1000) / 20)),
        };

        resolve(dna);

      } catch (e) {
        console.error("❌ JSON Parse Failed:", stdout);
        reject(e);
      }
    });
  });
};
