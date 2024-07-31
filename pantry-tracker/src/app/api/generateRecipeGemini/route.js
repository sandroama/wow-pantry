import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { ingredients } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Given these ingredients: ${ingredients}, suggest a recipe that uses as many of these ingredients as possible. Provide the recipe name, ingredients list, and step-by-step instructions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recipe = response.text();

    return new Response(JSON.stringify({ recipe }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return new Response(JSON.stringify({ error: 'Error generating recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}