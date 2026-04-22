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
   🔥 AUTO REMIX (כמה וריאציות + BEST)
========================================= */
export async function generateAutoRemix(originalDNA, similarity = 60, type = "club") {
  try {
    const variations = [];

    // 🔁 מייצר 3 וריאציות
    for (let i = 0; i < 3; i++) {
      const v = await generateVariation(originalDNA);
      if (v.success) variations.push(v);
    }

    if (variations.length === 0) {
      throw new Error("No variations generated");
    }

    // 🏆 בחירת BEST לפי energy + emotion
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
   🧠 PROMPT BUILDER (הכי חשוב!)
========================================= */
function buildPrompt(originalDNA) {
  return `
You are a world-class music producer AI.

CRITICAL RULE:
You MUST preserve the ORIGINAL STYLE and GENRE of the track.

DO NOT change genre.
DO NOT create a different musical identity.

Instead:
→ Improve the SAME track
→ Stay inside the SAME musical world

STRICT:
- BPM ±2 max
- Same groove feel
- Same bass type
- Same vibe and energy direction

IMPROVE:
- Drop impact
- Groove quality
- Energy curve
- Hook (2–4 notes)

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
}
