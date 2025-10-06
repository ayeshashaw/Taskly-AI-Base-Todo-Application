import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const geminiGenerateTasks = async (goal) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Suggest 3–5 short, actionable, to-do tasks for the goal: "${goal}".
      Keep each task concise (under 10 words).
      Reply with only a numbered list.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const tasks = text
      .split("\n")
      .map((t) => t.replace(/^\d+\.?\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    return tasks;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate tasks from Gemini");
  }
};

export const mockGenerateTasks = (goal) => [
  `Research about ${goal}`,
  `Create a plan for ${goal}`,
  `Do one ${goal}-related task today`,
  `Track your ${goal} progress`,
  `Review what you learned about ${goal}`,
];
