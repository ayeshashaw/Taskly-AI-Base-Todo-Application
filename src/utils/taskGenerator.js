import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export const generateAITasks = async (goal) => {
  if (!goal) return [];

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Generate 3-5 distinct, actionable, and relevant to-do tasks for the goal: "${goal}".
      For each task, provide a concise title (under 10 words) and a 1-2 line description.
      Format the output as a numbered list, where each item has a 'Title:' and 'Description:' field.
      Example:
      1. Title: Task Title 1
         Description: This is a short description for task 1.
      2. Title: Task Title 2
         Description: This is a short description for task 2.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const tasks = text
      .split("\n\n") // Split by double newline to separate tasks
      .map((taskBlock) => {
        const titleMatch = taskBlock.match(/Title:\s*(.*)/);
        const descriptionMatch = taskBlock.match(/Description:\s*(.*)/);
        return {
          title: titleMatch ? titleMatch[1].trim() : '',
          description: descriptionMatch ? descriptionMatch[1].trim() : '',
        };
      })
      .filter((task) => task.title !== '') // Filter out any tasks without a title
      .slice(0, 5);

    return tasks;
  } catch (err) {
    console.error("Gemini AI Error:", err);
    // Fallback mock tasks
    return [
      `Research about ${goal}`,
      `Create a plan for ${goal}`,
      `Do one ${goal}-related task today`,
      `Track your ${goal} progress`,
      `Review what you learned about ${goal}`,
    ];
  }
};
