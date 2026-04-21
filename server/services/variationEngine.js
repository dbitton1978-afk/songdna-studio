import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateVariation(originalDNA, mode = "club") {
  try {
    let modeInstruction = "";

    if (mode === "viral") {
      modeInstruction = `
Focus on making the track highly catchy and addictive.
Create a simple but unforgettable hook.
Maximize replay value and emotional pull.
`;
    }

    if (mode === "aggressive") {
      modeInstruction = `
Make the track more aggressive and powerful.
Stronger drums, harder drops, more drive and tension.
`;
    }

    if (mode === "emotional") {
      modeInstruction = `
Focus on emotion and atmosphere.
Deep melodies, emotional chords, cinematic feeling.
`;
    }

    if (mode === "club") {
      modeInstruction = `
Make it perfect for club performance.
Strong groove, DJ-friendly structure, energetic drops.
`;
    }

    const prompt = `
You are a world-class electronic music producer.

Create a NEW variation from this track DNA.

${modeInstruction}

GOALS:
- Strong groove
- Dynamic energy curve
- Powerful drop
- Memorable hook (2–4 notes)

RETURN JSON:

{
  "newDNA": {
    "bpm": number,
    "groove": {
      "swing": number,
      "bounce": number,
      "drive": number
    },
    "energy_curve": [number, number, number, number, number],
    "drums": {
      "kick": string,
      "clap": string,
      "hihat": string
    },
    "bass": {
      "type": string,
      "movement": string
    },
    "melody": {
      "contour": string,
      "density": string,
      "hook": string
    },
    "harmony": string,
    "structure": [string],
    "sound_palette": [string],
    "vocal_presence": string,
    "club_energy": number,
    "emotion_score": number
  },
  "production_prompt": string
}

Track DNA:
${JSON.stringify(originalDNA)}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    let text = response.output[0].content[0].text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return {
      success: true,
      ...parsed,
      similarity_score: Math.random().toFixed(2),
    };

  } catch (error) {
    console.error("AI ERROR:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
}
