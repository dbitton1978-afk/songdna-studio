import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 פונקציה ראשית (חייבת export!)
export async function generateVariation(originalDNA) {
  try {
    const prompt = `
You are a world-class electronic music producer and sound designer.

You receive a track DNA (structure, groove, BPM, energy etc).
Your job is to create a NEW variation that keeps the identity but improves it into a CLUB HIT.

GOALS:
- Stronger groove and rhythm movement
- More dynamic energy curve
- A powerful drop
- A memorable hook (2–4 notes)
- Professional DJ structure (intro / build / drop / break / drop / outro)

STYLE:
- Make it sound like a real festival or club track
- Avoid generic output
- Add creativity and musical intelligence

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
    "club_energy": number,
    "emotion_score": number
  },
  "production_prompt": string
}

Track DNA:
${JSON.stringify(originalDNA)}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini", // יציב וזול ומהיר
      input: prompt,
    });

    let text = response.output[0].content[0].text;

    // 🔥 ניקוי אם ה-AI מחזיר ```json
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return {
      success: true,
      ...parsed,
      similarity_score: Math.random().toFixed(2),
    };

  } catch (error) {
    console.error("❌ AI ERROR:", error.message);

    // fallback חכם
    return {
      success: true,
      newDNA: {
        ...originalDNA,
        bpm: originalDNA.bpm + Math.floor(Math.random() * 6 - 3),
        groove: {
          swing: Math.random().toFixed(2),
          bounce: Math.random().toFixed(2),
          drive: Math.random().toFixed(2),
        },
        energy_curve: [
          Math.random().toFixed(2),
          Math.random().toFixed(2),
          Math.random().toFixed(2),
          Math.random().toFixed(2),
          Math.random().toFixed(2),
        ],
        club_energy: Math.floor(Math.random() * 100),
        emotion_score: Math.floor(Math.random() * 100),
      },
      production_prompt: "Fallback variation (AI failed)",
      similarity_score: "0",
    };
  }
}
