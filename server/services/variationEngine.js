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
export async function generateAutoRemix(originalDNA) {
  try {
    const variations = [];

    for (let i = 0; i < 3; i++) {
      const v = await generateVariation(originalDNA);
      if (v.success) variations.push(v);
    }

    if (variations.length === 0) {
      throw new Error("No variations generated");
    }

    // 🏆 BEST = הכי חזק לפי DNA (אנרגיה + רגש)
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
   🧠 PROMPT BUILDER (GENRE LOCK + SUNO READY)
========================================= */
function buildPrompt(originalDNA) {
  return `
You are a world-class music producer AI.

STEP 1:
Analyze the ORIGINAL DNA and DETECT:
- exact genre
- sub-genre
- groove identity
- emotional direction

STEP 2:
Create a variation ONLY inside that same musical world.

CRITICAL RULE:
You MUST NOT change genre.

BAD:
"electronic track"
GOOD:
"melodic techno", "progressive psytrance", "afro house", etc.

STRICT CONSTRAINTS:
- BPM must stay within ±2
- Same groove feel
- Same bass movement type
- Same emotional tone
- Same structure logic

IMPROVEMENTS:
- Stronger drop
- Better groove
- More precise energy curve
- Catchy hook

---------------------------------------
SUNO OUTPUT RULE:

The production_prompt MUST be:
- One paragraph
- Clear genre
- BPM
- Drum style
- Bassline type
- Melody description
- Energy build
- Drop description
- Atmosphere
- Structure

It must sound like a REAL track description.

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
  "production_prompt": string
}

ORIGINAL DNA:
${JSON.stringify(originalDNA)}
`;
}
