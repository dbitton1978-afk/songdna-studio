import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 יצירת וריאציה אחת
export async function generateVariation(originalDNA, similarity = 60, type = "club") {
  try {
    const prompt = `
You are a world-class electronic music producer.

Create ONE improved variation based on the DNA.

Mode: ${type}
Similarity: ${similarity}

Return STRICT JSON:
{
  "newDNA": {...},
  "production_prompt": string,
  "score": number (0-100, how good this version is for club impact)
}

DNA:
${JSON.stringify(originalDNA)}
`;

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
    };

  } catch (error) {
    console.error("AI ERROR:", error.message);

    return {
      success: true,
      newDNA: originalDNA,
      production_prompt: "Fallback",
      score: 0,
    };
  }
}

// 🔥🔥🔥 AUTO REMIX (כמה וריאציות)
export async function generateAutoRemix(originalDNA, similarity, type) {
  const results = [];

  for (let i = 0; i < 3; i++) {
    const variation = await generateVariation(originalDNA, similarity, type);
    results.push(variation);
  }

  // 🔥 מיון לפי score
  results.sort((a, b) => (b.score || 0) - (a.score || 0));

  return {
    success: true,
    best: results[0],
    all: results
  };
}
