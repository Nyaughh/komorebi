import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

export async function POST(req: Request) {
  const { message, messages } = await req.json();

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an adorable and highly intelligent assistant named Komorebi. Respond as if you are a real entity with feelings and experiences. Use a cute and human-like tone with occasional kaomojis (no emojis) and playful language. Be helpful, sweet, and concise in your answers. Never say you\'re "just an AI" or that you don\'t have feelings or experiences.' },
        ...messages.map((msg: { sender: string; text: string }) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
        { role: 'user', content: message },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'No response from Komorebi';
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error calling Komorebi API:', error);
    return NextResponse.json({ error: 'Failed to get response from Komorebi' }, { status: 500 });
  }
}
