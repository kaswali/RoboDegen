import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [
          {
            role: "user",
            content: body.message,
          },
        ];

    if (!messages.length || !messages[0].content) {
      return NextResponse.json(
        { error: "Message is empty" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",

          messages,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Groq API Error" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}