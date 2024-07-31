import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { item } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide brief nutritional information for ${item.weight} ${item.unit} of ${item.name}. Include calories, macronutrients, and any notable vitamins or minerals. Keep it concise.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const info = response.text();

    return new Response(JSON.stringify({ info }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return new Response(JSON.stringify({ error: 'Error fetching nutritional information' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}