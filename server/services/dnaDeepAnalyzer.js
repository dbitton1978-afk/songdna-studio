import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function deepAnalyzeDNA(originalDNA) {
  try {
    const prompt = `
You are an elite music producer, arranger, and sound designer.

Your task is to convert the provided track DNA into a DEEP PRODUCTION BLUEPRINT.

Think like a producer recreating the track from scratch as accurately as possible.

CRITICAL RULES:
- Preserve the original musical identity
- Do not generalize to broad genres like "electronic dance" if a more precise style is possible
- Be specific and technical
- Describe rhythm, arrangement, sound design, and feel like a real producer

RETURN STRICT JSON ONLY:

{
  "genre": string,
  "subgenre": string,

  "tempo": {
    "bpm": number,
    "groove_type": string,
    "swing": number
  },

  "drums": {
    "kick_pattern": string,
    "snare_clap_pattern": string,
    "hihat_pattern": string,
    "percussion_pattern": string,
    "rhythm_density": string
  },

  "bass": {
    "pattern": string,
    "rhythm": string,
    "syncopation": string,
    "sound_type": string,
    "movement": string
  },

  "melody": {
    "scale_feel": string,
    "movement": string,
    "density": string,
    "hook_style": string,
    "lead_character": string
  },

  "harmony": {
    "mood": string,
    "chord_feel": string,
    "tension_release": string
  },

  "arrangement": {
    "intro_bars": number,
    "build_bars": number,
    "drop_bars": number,
    "break_bars": number,
    "outro_bars": number,
    "structure_flow": string
  },

  "sound_design": {
    "lead_type": string,
    "bass_texture": string,
    "pad_type": string,
    "fx_elements": string,
    "texture": string
  },

  "energy": {
    "curve": string,
    "peak_moments": string,
    "club_feel": string
  },

  "vocal": {
    "presence": string,
    "style": string
  },

  "rebuild_prompt": string
}

IMPORTANT:
The "rebuild_prompt" must be a FULL Suno-ready prompt.
It must include:
- exact genre/subgenre
- BPM
- groove
- kick/drums feel
- bassline movement
- melodic character
- harmony mood
- arrangement flow
- sound design cues
- whether vocals exist or not

Write "rebuild_prompt" as one strong paragraph that Suno can use directly.

INPUT DNA:
${JSON.stringify(originalDNA)}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    let text =
      response?.output?.[0]?.content?.[0]?.text ||
      response?.output_text ||
      "";

    text = String(text)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("❌ DEEP ANALYSIS ERROR:", error.message);
    return {
      error: "deep analysis failed",
    };
  }
}
