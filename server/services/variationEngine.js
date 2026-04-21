import { calculateSimilarity } from "./similarityEngine.js";

export const generateVariation = async (dna, similarity = 60, type = "balanced") => {

  let newDNA = mutateDNA(dna);

  let score = calculateSimilarity(dna, newDNA);

  // אם דומה מדי → מתקנים
  let attempts = 0;

  while (score > similarity / 100 && attempts < 5) {
    newDNA = mutateDNA(dna, 20); // יותר שינוי
    score = calculateSimilarity(dna, newDNA);
    attempts++;
  }

  return {
    newDNA,
    production_prompt: buildPrompt(newDNA, type),
    similarity_score: score.toFixed(2)
  };
};

const mutateDNA = (dna, intensity = 10) => {
  const mutate = (val) => {
    const change = (Math.random() * intensity * 2) - intensity;
    return Math.max(0, Math.min(1, Number(val) + change / 100));
  };

  return {
    ...dna,

    bpm: dna.bpm + Math.floor((Math.random() * 10) - 5),

    groove: {
      swing: mutate(dna.groove.swing),
      bounce: mutate(dna.groove.bounce),
      drive: mutate(dna.groove.drive)
    },

    energy_curve: dna.energy_curve.map(v => mutate(v)),

    harmony: ["dark", "uplifting", "tense"][Math.floor(Math.random() * 3)],

    structure: shuffle(dna.structure),

    club_energy: Math.min(100, dna.club_energy + Math.floor(Math.random() * 15)),

    emotion_score: Math.min(100, dna.emotion_score + Math.floor(Math.random() * 15))
  };
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const buildPrompt = (dna, type) => {
  return `
Create a ${type} electronic track.

BPM: ${dna.bpm}
Style: ${dna.style_tags.join(", ")}

Energy: ${dna.club_energy}
Emotion: ${dna.emotion_score}

Structure: ${dna.structure.join(" → ")}

Make it original and not similar to the source.
`;
};
