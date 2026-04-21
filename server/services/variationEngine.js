import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateVariation(dna, mode = "club") {
  try {
    const prompt = `
You are a professional music producer.

Given this track DNA:
${JSON.stringify(dna, null, 2)}

Create a NEW variation of this track.

Rules:
- Keep the same style
- Change groove, melody, and structure creatively
- Improve club energy
- Return ONLY JSON (no text)

Return format:
{
  "bpm": number,
  "groove": { "swing": number, "bounce": number, "drive": number },
  "energy_curve": number[],
  "drums": { "kick": string, "clap": string, "hihat": string },
  "bass": { "type": string, "movement": string },
  "melody": { "contour": string, "density": string },
  "harmony": string,
  "structure": string[],
  "sound_palette": string[],
  "vocal_presence": string,
  "style_tags": string[],
  "club_energy": number,
  "emotion_score": number,
  "production_prompt": string
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate music variations in JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
    });

    const text = response.choices[0].message.content;

    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("AI ERROR:", error.message);

    return {
      error: true,
      message: error.message,
    };
  }
}
