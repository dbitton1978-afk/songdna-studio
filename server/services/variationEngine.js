import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================================
   🎧 SINGLE VARIATION
========================================= */
export async function generateVariation(originalDNA) {
  try {
    const prompt = buildPrompt(originalDNA);

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
      success: false,
      message: "AI failed",
    };
  }
}

/* =========================================
   🔥 AUTO REMIX
========================================= */
export async function generateAutoRemix(originalDNA, similarity = 60, type = "club") {
  try {
    const variations = [];

    for (let i = 0; i < 3; i++) {
      const v = await generateVariation(originalDNA);
      if (v.success) variations.push(v);
    }

    if (variations.length === 0) {
      throw new Error("No variations generated");
    }

    // 🏆 BEST = הכי חזק לפי אנרגיה + רגש
    const best = variations.sort((a, b) => {
      return (
        (b.newDNA?.club_energy || 0) +
        (b.newDNA?.emotion_score || 0) -
        ((a.newDNA?.club_energy || 0) +
        (a.newDNA?.emotion_score || 0))
      );
    })[0];

    return {
      success: true,
      best,
      all: variations,
    };

  } catch (error) {
    console.error("❌ AUTO REMIX ERROR:", error.message);

    return {
      success: false,
      message: "Auto Remix failed",
    };
  }
}

/* =========================================
   🧠 PROMPT BUILDER (Suno READY)
========================================= */
function buildPrompt(originalDNA) {
  return `
You are a world-class electronic music producer.

CRITICAL RULE:
You MUST preserve the ORIGINAL GENRE and STYLE of the track.

DO NOT:
- Change genre
- Switch musical direction
- Create a different vibe

Instead:
Create a HIGH-QUALITY variation of the SAME TRACK.

STRICT CONSTRAINTS:
- BPM must stay within ±2
- Groove must feel similar
- Bass style must match
- Emotional tone must stay consistent
- Sound palette must stay aligned

IMPROVE:
- Drop impact
- Groove tightness
- Energy flow
- Hook (short, catchy, genre-appropriate)

---------------------------------------
IMPORTANT OUTPUT RULE:
The "production_prompt" MUST be a FULL Suno-ready prompt.

It MUST include:
- Genre
- BPM
- Drum style
- Bass description
- Melody style
- Energy progression
- Drop description
- Atmosphere
- Structure

Write it as ONE paragraph (no bullet points).

---------------------------------------

RETURN STRICT JSON:

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
  "production_prompt": "FULL SUNO PROMPT HERE"
}

ORIGINAL DNA:
${JSON.stringify(originalDNA)}
`;
}
