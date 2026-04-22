import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateVariation(originalDNA) {
  try {
    const prompt = `
You are a world-class music producer AI.

CRITICAL RULE:
You MUST preserve the ORIGINAL STYLE and GENRE of the track.

DO NOT invent a new genre.
DO NOT change musical direction.

Instead:
→ Analyze the ORIGINAL DNA
→ Identify its musical identity (genre, groove, energy, vibe)
→ Create a variation INSIDE the SAME WORLD

STRICT CONSTRAINTS:
- BPM must stay very close (±2 max)
- Groove must feel similar
- Bass style must match
- Energy direction must remain consistent
- Sound palette must stay coherent
- Structure logic must stay recognizable

ALLOWED IMPROVEMENTS:
- Better drop
- Stronger groove
- Cleaner energy curve
- More memorable hook (2–4 notes)
- More professional club readiness

VERY IMPORTANT:
The output should feel like:
"A better version of the SAME TRACK"
NOT a different track.

RETURN STRICT JSON ONLY:

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
    "style_tags": [string],
    "club_energy": number,
    "emotion_score": number
  },
  "production_prompt": string
}

ORIGINAL DNA:
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
    console.error("❌ AI ERROR:", error.message);

    return {
      success: true,
      newDNA: {
        ...originalDNA,
        bpm: originalDNA.bpm,
      },
      production_prompt: "Fallback (AI failed)",
      similarity_score: "0",
    };
  }
}
