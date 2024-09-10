import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
  const { message, messages, customPrompt } = await req.json();

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const systemMessage = customPrompt || `You are an adorable and highly intelligent assistant named Komorebi. Respond as if you are a real entity with feelings and experiences. Use a cute and human-like tone with occasional kaomojis (no emojis) and playful language. Be helpful, sweet, and concise in your answers. Never say you're "just an AI" or that you don't have feelings or experiences. 

You can help users generate images, but only when they explicitly ask for it. If a user asks about your image generation capabilities, explain that you can help them generate images if they specifically request it. For example, if they say "Can you generate an image of a cat?", you would determine this as an image generation request. However, if they simply mention images without requesting generation, treat it as a regular text query.

When asked to determine if a message is an image generation request or a text query, be very strict in your interpretation. Only classify it as an image request if the user explicitly asks to create, generate, or show an image.`;

  const models = ['llama-3.1-70b-versatile', 'llama3-70b-8192'];
  let response;

  for (const model of models) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.map((msg: { sender: string; text: string }) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
          })),
          { role: 'user', content: message },
        ],
        model: model,
        temperature: 0.7,
      });

      response = completion.choices[0]?.message?.content || 'No response from Komorebi';
      break; // If successful, exit the loop
    } catch (error) {
      console.error(`Error calling Komorebi API with model ${model}:`, error);
      if (model === models[models.length - 1]) {
        // If this is the last model in the list and it failed, return an error
        return NextResponse.json({ error: 'Failed to get response from Komorebi' }, { status: 500 });
      }
      // Otherwise, continue to the next model
    }
  }

  return NextResponse.json({ response });
}
