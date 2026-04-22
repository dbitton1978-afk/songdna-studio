import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function buildSunoPrompt(blueprint) {
  try {
    const prompt = `
You are an expert in writing prompts for Suno AI.

Your job:
Convert a technical music blueprint into a HIGH QUALITY Suno prompt.

CRITICAL:
- Keep the exact genre and vibe
- Make it sound natural and musical
- Do NOT sound technical
- Do NOT output JSON

STYLE:
- 1 paragraph only
- Rich musical description
- Clear groove, bass, melody, energy
- Feel like a real track

INPUT BLUEPRINT:
${JSON.stringify(blueprint)}

OUTPUT:
A clean Suno-ready prompt
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    return response.output[0].content[0].text;

  } catch (error) {
    console.error("❌ SUNO TRANSLATOR ERROR:", error.message);
    return "Failed to generate Suno prompt";
  }
}
