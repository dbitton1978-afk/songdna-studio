import OpenAI from "openai";
import { calculateSimilarity } from "./similarityEngine.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateVariation = async (dna, similarity = 60, type = "balanced") => {

  const prompt = `
You are a music AI.

Create a NEW Song DNA based on this:

${JSON.stringify(dna)}

Rules:
- DO NOT copy melody or structure
- Keep only abstract characteristics
- Target similarity: ${similarity}%
- Style: ${type}

Return JSON only.
`;

  let newDNA;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    newDNA = JSON.parse(response.choices[0].message.content);

  } catch (err) {
    console.log("OpenAI Error:", err.message);
    return {
      newDNA: dna,
      production_prompt: "AI failed",
      similarity_score: "0"
    };
  }

  const score = calculateSimilarity(dna, newDNA);

  return {
    newDNA,
    production_prompt: "AI Generated Track",
    similarity_score: score.toFixed(2)
  };
};
