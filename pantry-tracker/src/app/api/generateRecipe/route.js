// File: src/app/api/generateRecipe/route.js

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.LLAMA_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": process.env.NEXT_PUBLIC_SITE_NAME,
  }
});

export async function POST(req) {
  try {
    const { ingredients, prompt } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    return new Response(JSON.stringify({ recipe: completion.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calling Llama API:', error);
    return new Response(JSON.stringify({ error: 'Error generating recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}