import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function buildSunoPrompt(blueprint) {
  try {
    const prompt = `
You are an expert in writing prompts for Suno AI.

Convert the following technical music blueprint into a natural, musical, HIGH QUALITY Suno prompt.

RULES:
- Keep exact genre & vibe
- No technical jargon
- Make it musical and clear
- One paragraph only
- Must sound like a real track description

IMPORTANT:
- Include BPM
- Include groove feel
- Include bass style
- Include melody type
- Include energy and drop
- Include atmosphere
- Include structure

INPUT:
${JSON.stringify(blueprint)}

OUTPUT:
Only the final prompt text (no JSON)
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    return (
      response?.output?.[0]?.content?.[0]?.text ||
      "Failed to generate Suno prompt"
    ).trim();

  } catch (error) {
    console.error("❌ SUNO TRANSLATOR ERROR:", error.message);
    return "Failed to generate Suno prompt";
  }
}
