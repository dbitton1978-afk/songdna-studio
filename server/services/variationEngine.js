import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateVariationWithAI(dna) {
  try {
    const prompt = `
You are a professional music producer.

Take this track DNA and create a new variation:
${JSON.stringify(dna, null, 2)}

Return ONLY valid JSON with:
- newDNA (modified values)
- production_prompt (text)
- similarity_score (0-1)
`;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = response.output[0].content[0].text;

    return JSON.parse(text);

  } catch (err) {
    console.error("OpenAI Error:", err.message);
    return {
      newDNA: dna,
      production_prompt: "AI failed",
      similarity_score: "0"
    };
  }
}
