import OpenAI, { APIError } from "openai";
import { Stream } from "openai/streaming";
import { ChatCompletionChunk } from "openai/resources/chat/completions";
import { getServerSession, Session } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const openai: OpenAI = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

type RequestData = {
  currentModel: string
  message: string
}

export async function POST(request: NextRequest, response: NextResponse) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return new Response("Not authorized", { status: 401 });
  }

  const { message } = (await request.json()) as RequestData;

  if (!message) {
    return new Response("No message in the request", { status: 400 });
  }

  try {
    const completion: Stream<ChatCompletionChunk> = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    const stream: ReadableStream<Uint8Array> = new ReadableStream({
      async start(controller: ReadableStreamDefaultController<Uint8Array>) {
        const encoder: TextEncoder = new TextEncoder();

        for await (const part of completion) {
          const text: string = part.choices[0]?.delta.content ?? "";
          const chunk: Uint8Array = encoder.encode(text);
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (e) {
    if (e instanceof APIError) {
      switch (e.status) {
        case 401:
          return NextResponse.json("Ensure the correct API key and requesting organization are being used.", { status: 401 });
        case 429:
          return NextResponse.json("You are sending requests too quickly", { status: e.status });
        case 500:
          return NextResponse.json("The server had an error while processing your request", { status: 500 });
        case 503:
          return NextResponse.json("The engine is currently overloaded, please try again later", { status: 503 });
        default:
          return NextResponse.json("Unexpected error, try again later.", { status: 500 });
      }
    }

    return NextResponse.json("Unexpected error, try again later.", { status: 500 });
  }
}
