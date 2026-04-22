import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function deepAnalyzeDNA(originalDNA) {
  try {
    const prompt = `
You are an elite music producer and sound engineer.

Your task is to deeply analyze a track DNA and break it down into a FULL production blueprint.

Think like a professional producer recreating the track from scratch.

OUTPUT MUST BE EXTREMELY DETAILED.

----------------------------------
RETURN STRICT JSON:

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
    "rhythm_density": string
  },

  "bass": {
    "pattern": string,
    "rhythm": string,
    "syncopation": string,
    "sound_type": string
  },

  "melody": {
    "scale_feel": string,
    "movement": string,
    "density": string,
    "hook_style": string
  },

  "arrangement": {
    "intro_bars": number,
    "build_bars": number,
    "drop_bars": number,
    "break_bars": number,
    "structure_flow": string
  },

  "sound_design": {
    "lead_type": string,
    "pad_type": string,
    "fx_elements": string,
    "texture": string
  },

  "energy": {
    "curve": string,
    "peak_moments": string
  },

  "vocal": {
    "presence": string,
    "style": string
  },

  "rebuild_prompt": "FULL PROFESSIONAL TRACK CREATION PROMPT FOR SUNO"
}

----------------------------------

IMPORTANT:
- Be extremely specific
- Use producer terminology
- Describe rhythm patterns clearly
- Describe groove feel
- Describe timing and movement
- The rebuild_prompt must be usable directly in Suno

----------------------------------

INPUT DNA:
${JSON.stringify(originalDNA)}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    let text = response.output[0].content[0].text;
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.error("❌ DEEP ANALYSIS ERROR:", error.message);
    return { error: "deep analysis failed" };
  }
}
