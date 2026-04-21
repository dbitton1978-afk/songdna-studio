export const generateVariation = async (dna, similarity = 60, type = "balanced") => {

  const mutateValue = (value, range = 10) => {
    const change = (Math.random() * range * 2) - range;
    return Math.max(0, Math.min(1, value + change / 100));
  };

  const newDNA = {
    ...dna,

    bpm: dna.bpm + Math.floor((Math.random() * 10) - 5),

    groove: {
      swing: mutateValue(Number(dna.groove.swing)),
      bounce: mutateValue(Number(dna.groove.bounce)),
      drive: mutateValue(Number(dna.groove.drive))
    },

    energy_curve: dna.energy_curve.map(v =>
      mutateValue(Number(v), 20)
    ),

    harmony: ["dark", "uplifting", "tense"][
      Math.floor(Math.random() * 3)
    ],

    structure: shuffleArray(dna.structure),

    club_energy: Math.min(100, dna.club_energy + Math.floor(Math.random() * 10)),

    emotion_score: Math.min(100, dna.emotion_score + Math.floor(Math.random() * 10))
  };

  return {
    newDNA,
    production_prompt: buildPrompt(newDNA, type),
    similarity_score: Math.random().toFixed(2)
  };
};

const shuffleArray = (arr) => {
  return [...arr].sort(() => Math.random() - 0.5);
};

const buildPrompt = (dna, type) => {
  return `
Create a ${type} electronic track.

BPM: ${dna.bpm}
Style: ${dna.style_tags.join(", ")}

Energy: ${dna.club_energy}
Emotion: ${dna.emotion_score}

Structure: ${dna.structure.join(" → ")}

Groove: swing ${dna.groove.swing}, bounce ${dna.groove.bounce}, drive ${dna.groove.drive}

Make it original and not similar to the source.
`;
};
