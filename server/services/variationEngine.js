import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================================
   🎧 SINGLE VARIATION
========================================= */
export async function generateVariation(originalDNA, similarity = 60, type = "club") {
  try {
    const detectedGenre = await detectGenreFromDNA(originalDNA);
    const prompt = buildVariationPrompt(originalDNA, detectedGenre, similarity, type);

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = extractText(response);
    const parsed = safeJsonParse(text);

    if (!parsed) {
      throw new Error("Invalid JSON returned from variation generation");
    }

    return {
      success: true,
      ...parsed,
      detected_genre: detectedGenre,
      similarity_score: Number(similarity / 100).toFixed(2),
    };
  } catch (error) {
    console.error("❌ AI ERROR:", error.message);

    return {
      success: false,
      message: "AI failed",
      detected_genre: {
        genre: "unknown",
        subgenre: "unknown",
        groove_identity: "unknown",
        emotional_direction: "unknown",
      },
    };
  }
}

/* =========================================
   🔥 AUTO REMIX
========================================= */
export async function generateAutoRemix(originalDNA, similarity = 60, type = "club") {
  try {
    const detectedGenre = await detectGenreFromDNA(originalDNA);
    const variations = [];

    for (let i = 0; i < 3; i++) {
      const prompt = buildVariationPrompt(originalDNA, detectedGenre, similarity, type);

      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
      });

      const text = extractText(response);
      const parsed = safeJsonParse(text);

      if (parsed) {
        variations.push({
          success: true,
          ...parsed,
          detected_genre: detectedGenre,
          similarity_score: Number(similarity / 100).toFixed(2),
        });
      }
    }

    if (!variations.length) {
      throw new Error("No variations generated");
    }

    const best = [...variations].sort((a, b) => {
      const aScore =
        Number(a.newDNA?.club_energy || 0) +
        Number(a.newDNA?.emotion_score || 0);

      const bScore =
        Number(b.newDNA?.club_energy || 0) +
        Number(b.newDNA?.emotion_score || 0);

      return bScore - aScore;
    })[0];

    return {
      success: true,
      detected_genre: detectedGenre,
      best,
      all: variations,
    };
  } catch (error) {
    console.error("❌ AUTO REMIX ERROR:", error.message);

    return {
      success: false,
      message: "Auto Remix failed",
      detected_genre: {
        genre: "unknown",
        subgenre: "unknown",
        groove_identity: "unknown",
        emotional_direction: "unknown",
      },
    };
  }
}

/* =========================================
   🧠 GENRE DETECTOR ENGINE
========================================= */
async function detectGenreFromDNA(originalDNA) {
  try {
    const prompt = `
You are an expert musicologist and electronic music producer.

Your task is to detect the MOST ACCURATE musical identity from the provided DNA.

Rules:
- Be specific
- Avoid generic labels like "electronic" or "dance" unless absolutely necessary
- Prefer exact genre and subgenre
- Use the DNA only
- Do not invent unrelated styles

Return STRICT JSON ONLY:

{
  "genre": "main genre",
  "subgenre": "exact subgenre",
  "groove_identity": "short description",
  "emotional_direction": "short description"
}

DNA:
${JSON.stringify(originalDNA)}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text = extractText(response);
    const parsed = safeJsonParse(text);

    if (!parsed) {
      throw new Error("Invalid JSON returned from genre detection");
    }

    return {
      genre: parsed.genre || "unknown",
      subgenre: parsed.subgenre || "unknown",
      groove_identity: parsed.groove_identity || "unknown",
      emotional_direction: parsed.emotional_direction || "unknown",
    };
  } catch (error) {
    console.error("❌ GENRE DETECTOR ERROR:", error.message);

    return {
      genre: "unknown",
      subgenre: "unknown",
      groove_identity: "unknown",
      emotional_direction: "unknown",
    };
  }
}

/* =========================================
   🎼 VARIATION PROMPT BUILDER
========================================= */
function buildVariationPrompt(originalDNA, detectedGenre, similarity, type) {
  return `
You are a world-class music producer AI.

DETECTED MUSICAL IDENTITY:
- Genre: ${detectedGenre.genre}
- Subgenre: ${detectedGenre.subgenre}
- Groove identity: ${detectedGenre.groove_identity}
- Emotional direction: ${detectedGenre.emotional_direction}

CRITICAL RULE:
You MUST preserve this exact musical world.
You MUST stay inside the detected genre and subgenre.
You MUST NOT generalize to "electronic dance music".
You MUST NOT switch to another style.

BAD:
- disco
- pop
- generic EDM
- unrelated house
- unrelated techno
unless the detected genre itself is exactly that.

TARGET:
Create a better variation of the SAME TRACK.

STRICT CONSTRAINTS:
- BPM must stay within ±2 from the original
- Groove feel must remain close
- Bass movement must remain close
- Emotional tone must remain close
- Structure logic must remain recognizable
- Similarity target: ${similarity}%
- Variation mode: ${type}

ALLOWED IMPROVEMENTS:
- stronger drop
- tighter groove
- better energy flow
- more usable club/festival impact
- more memorable hook

SUNO RULE:
The production_prompt MUST be directly usable in Suno.
It MUST be ONE paragraph and include:
- exact genre + subgenre
- BPM
- drum style
- bass movement
- melody shape
- harmonic feel
- energy progression
- drop description
- atmosphere
- structure

The prompt MUST start like:
"A [subgenre] track at [BPM] BPM..."

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
  "production_prompt": "FULL SUNO-READY PROMPT HERE"
}

ORIGINAL DNA:
${JSON.stringify(originalDNA)}
`;
}

/* =========================================
   🛠 HELPERS
========================================= */
function extractText(response) {
  const text =
    response?.output?.[0]?.content?.[0]?.text ||
    response?.output_text ||
    "";

  return String(text)
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }

    return null;
  }
}
